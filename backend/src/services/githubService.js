const { Octokit } = require('@octokit/rest');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 }); // 5-min cache

function getOctokit(token) {
  return new Octokit({
    auth: token || process.env.GITHUB_TOKEN,
    userAgent: 'RepoRevive/2.0.0'
  });
}

/**
 * Parse owner and repo from a GitHub URL or "owner/repo" string
 */
function parseRepo(input) {
  const urlMatch = input.match(/github\.com\/([^/]+)\/([^/\s]+)/);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace('.git', '') };

  const parts = input.split('/');
  if (parts.length === 2) return { owner: parts[0], repo: parts[1] };

  throw new Error('Invalid repository format. Use "owner/repo" or a full GitHub URL.');
}

/**
 * Fetch comprehensive repository data including commits, contributors, issues, languages
 */
async function fetchRepoData(repoInput, token) {
  const { owner, repo } = parseRepo(repoInput);
  const cacheKey = `repo:${owner}/${repo}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const octokit = getOctokit(token);

  const [repoInfo, commits, contributors, issues, languages, releases] = await Promise.allSettled([
    octokit.repos.get({ owner, repo }),
    octokit.repos.listCommits({ owner, repo, per_page: 30 }),
    octokit.repos.listContributors({ owner, repo, per_page: 20 }),
    octokit.issues.listForRepo({ owner, repo, state: 'open', per_page: 20 }),
    octokit.repos.listLanguages({ owner, repo }),
    octokit.repos.listReleases({ owner, repo, per_page: 5 })
  ]);

  const data = {
    repo: repoInfo.status === 'fulfilled' ? repoInfo.value.data : null,
    commits: commits.status === 'fulfilled' ? commits.value.data : [],
    contributors: contributors.status === 'fulfilled' ? contributors.value.data : [],
    issues: issues.status === 'fulfilled' ? issues.value.data : [],
    languages: languages.status === 'fulfilled' ? languages.value.data : {},
    releases: releases.status === 'fulfilled' ? releases.value.data : []
  };

  if (!data.repo) throw new Error(`Repository "${owner}/${repo}" not found or inaccessible.`);

  cache.set(cacheKey, data);
  return data;
}

/**
 * Calculate staleness score (0–100, higher = more abandoned)
 */
function calculateStalenessScore(repoData) {
  const now = new Date();
  const lastPush = new Date(repoData.repo.pushed_at);
  const daysSinceLastPush = Math.floor((now - lastPush) / (1000 * 60 * 60 * 24));

  let score = 0;

  // Days since last push (weight: 40)
  if (daysSinceLastPush > 730) score += 40;
  else if (daysSinceLastPush > 365) score += 30;
  else if (daysSinceLastPush > 180) score += 20;
  else if (daysSinceLastPush > 90) score += 10;

  // No recent commits (weight: 20)
  if (repoData.commits.length === 0) score += 20;
  else if (repoData.commits.length < 5) score += 10;

  // Open issues with no activity (weight: 15)
  const staleIssues = repoData.issues.filter(i => {
    const days = Math.floor((now - new Date(i.updated_at)) / (1000 * 60 * 60 * 24));
    return days > 90;
  });
  if (staleIssues.length > 10) score += 15;
  else if (staleIssues.length > 5) score += 8;

  // No releases in a long time (weight: 15)
  if (repoData.releases.length === 0) score += 10;
  else {
    const lastRelease = new Date(repoData.releases[0].published_at);
    const daysSinceRelease = Math.floor((now - lastRelease) / (1000 * 60 * 60 * 24));
    if (daysSinceRelease > 365) score += 15;
    else if (daysSinceRelease > 180) score += 8;
  }

  // Archived flag (weight: 10)
  if (repoData.repo.archived) score += 10;

  return Math.min(score, 100);
}

/**
 * Assess revival potential (0–100, higher = more worth reviving)
 */
function calculateRevivalPotential(repoData) {
  let score = 0;

  // Stars (weight: 30)
  const stars = repoData.repo.stargazers_count;
  if (stars > 1000) score += 30;
  else if (stars > 500) score += 25;
  else if (stars > 100) score += 20;
  else if (stars > 50) score += 12;
  else if (stars > 10) score += 6;

  // Forks (weight: 20)
  const forks = repoData.repo.forks_count;
  if (forks > 200) score += 20;
  else if (forks > 100) score += 15;
  else if (forks > 20) score += 10;
  else if (forks > 5) score += 5;

  // Has description & topics (weight: 15)
  if (repoData.repo.description) score += 8;
  if (repoData.repo.topics && repoData.repo.topics.length > 0) score += 7;

  // Active contributor count (weight: 20)
  const contribs = repoData.contributors.length;
  if (contribs > 10) score += 20;
  else if (contribs > 5) score += 15;
  else if (contribs > 2) score += 10;
  else if (contribs > 0) score += 5;

  // Has open issues (community interest) (weight: 15)
  const issueCount = repoData.repo.open_issues_count;
  if (issueCount > 20) score += 15;
  else if (issueCount > 10) score += 10;
  else if (issueCount > 0) score += 5;

  return Math.min(score, 100);
}

module.exports = { fetchRepoData, parseRepo, calculateStalenessScore, calculateRevivalPotential };
