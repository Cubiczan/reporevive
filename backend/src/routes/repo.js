const express = require('express');
const router = express.Router();
const {
  fetchRepoData,
  calculateStalenessScore,
  calculateRevivalPotential
} = require('../services/githubService');

/**
 * GET /api/repo/info
 * Query: ?repo=owner/repo&token=optional_pat
 */
router.get('/info', async (req, res, next) => {
  try {
    const { repo, token } = req.query;
    if (!repo) return res.status(400).json({ error: 'Missing "repo" query parameter.' });

    const data = await fetchRepoData(repo, token);
    const staleness = calculateStalenessScore(data);
    const potential = calculateRevivalPotential(data);

    const now = new Date();
    const lastPush = new Date(data.repo.pushed_at);
    const daysSinceLastPush = Math.floor((now - lastPush) / (1000 * 60 * 60 * 24));

    res.json({
      name: data.repo.full_name,
      description: data.repo.description,
      url: data.repo.html_url,
      stars: data.repo.stargazers_count,
      forks: data.repo.forks_count,
      openIssues: data.repo.open_issues_count,
      language: data.repo.language,
      languages: data.languages,
      topics: data.repo.topics || [],
      license: data.repo.license?.name || null,
      archived: data.repo.archived,
      lastPush: data.repo.pushed_at,
      daysSinceLastPush,
      createdAt: data.repo.created_at,
      defaultBranch: data.repo.default_branch,
      hasWiki: data.repo.has_wiki,
      hasProjects: data.repo.has_projects,
      contributorCount: data.contributors.length,
      recentCommits: data.commits.slice(0, 10).map(c => ({
        sha: c.sha.substring(0, 7),
        message: c.commit.message.split('\n')[0],
        author: c.commit.author.name,
        date: c.commit.author.date
      })),
      stalenessScore: staleness,
      revivalPotential: potential,
      releases: data.releases.slice(0, 3).map(r => ({
        tag: r.tag_name,
        name: r.name,
        publishedAt: r.published_at
      }))
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
