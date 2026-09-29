const express = require('express');
const router = express.Router();
const { fetchRepoData, calculateStalenessScore, calculateRevivalPotential } = require('../services/githubService');
const { generateRevivalPlan, generateReadmeTemplate, generateGoodFirstIssues } = require('../services/aiService');

/**
 * POST /api/analyze
 * Body: { repo: "owner/repo", token?: "pat" }
 * Full AI-powered analysis of a repository
 */
router.post('/', async (req, res, next) => {
  try {
    const { repo, token } = req.body;
    if (!repo) return res.status(400).json({ error: 'Missing "repo" in request body.' });

    const data = await fetchRepoData(repo, token);
    const staleness = calculateStalenessScore(data);
    const potential = calculateRevivalPotential(data);

    // Run AI analysis
    const revivalPlan = await generateRevivalPlan(data, staleness, potential);

    // Compute commit frequency over last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    const recentCommits = data.commits.filter(
      c => new Date(c.commit.author.date) > sixMonthsAgo
    );

    // Build language breakdown percentages
    const totalBytes = Object.values(data.languages).reduce((a, b) => a + b, 0);
    const languageBreakdown = Object.entries(data.languages).map(([lang, bytes]) => ({
      language: lang,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
      bytes
    })).sort((a, b) => b.bytes - a.bytes);

    res.json({
      repository: {
        name: data.repo.full_name,
        description: data.repo.description,
        url: data.repo.html_url,
        stars: data.repo.stargazers_count,
        forks: data.repo.forks_count,
        openIssues: data.repo.open_issues_count,
        archived: data.repo.archived,
        lastPush: data.repo.pushed_at,
        topics: data.repo.topics || []
      },
      scores: {
        staleness,
        revivalPotential,
        healthGrade: getHealthGrade(staleness, potential)
      },
      languages: languageBreakdown,
      activity: {
        totalContributors: data.contributors.length,
        commitsLast6Months: recentCommits.length,
        topContributors: data.contributors.slice(0, 5).map(c => ({
          login: c.login,
          contributions: c.contributions,
          avatar: c.avatar_url
        })),
        lastCommitDate: data.commits[0]?.commit?.author?.date || null
      },
      revivalPlan,
      analysedAt: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/analyze/readme
 * Generate AI README for a repo
 */
router.post('/readme', async (req, res, next) => {
  try {
    const { repo, token } = req.body;
    if (!repo) return res.status(400).json({ error: 'Missing "repo" in request body.' });

    const data = await fetchRepoData(repo, token);
    const readme = await generateReadmeTemplate(data);
    res.json({ readme });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/analyze/issues
 * Generate good first issues for a repo
 */
router.post('/issues', async (req, res, next) => {
  try {
    const { repo, token } = req.body;
    if (!repo) return res.status(400).json({ error: 'Missing "repo" in request body.' });

    const data = await fetchRepoData(repo, token);
    const issues = await generateGoodFirstIssues(data);
    res.json({ issues });
  } catch (err) {
    next(err);
  }
});

function getHealthGrade(staleness, potential) {
  const health = 100 - staleness + potential;
  if (health >= 150) return 'A';
  if (health >= 120) return 'B';
  if (health >= 90) return 'C';
  if (health >= 60) return 'D';
  return 'F';
}

module.exports = router;
