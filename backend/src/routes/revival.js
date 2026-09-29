const express = require('express');
const router = express.Router();

/**
 * POST /api/revival/checklist
 * Returns a structured revival checklist based on repo state
 */
router.post('/checklist', async (req, res, next) => {
  try {
    const { stalenessScore, revivalPotential, hasReadme, hasLicense, hasContributing, hasTests, hasCI } = req.body;

    const checklist = [
      {
        category: 'Documentation',
        priority: 'high',
        items: [
          { task: 'Update or create README.md with current info', done: hasReadme || false, effort: '30 min' },
          { task: 'Add CONTRIBUTING.md guide', done: hasContributing || false, effort: '45 min' },
          { task: 'Update inline code comments', done: false, effort: '1-2 hours' },
          { task: 'Create or update CHANGELOG.md', done: false, effort: '30 min' }
        ]
      },
      {
        category: 'Legal & Governance',
        priority: 'high',
        items: [
          { task: 'Add or verify LICENSE file', done: hasLicense || false, effort: '5 min' },
          { task: 'Add CODE_OF_CONDUCT.md', done: false, effort: '10 min' },
          { task: 'Add SECURITY.md policy', done: false, effort: '15 min' }
        ]
      },
      {
        category: 'CI/CD & Testing',
        priority: 'medium',
        items: [
          { task: 'Set up GitHub Actions CI pipeline', done: hasCI || false, effort: '1 hour' },
          { task: 'Add or update test suite', done: hasTests || false, effort: '2-4 hours' },
          { task: 'Add dependency vulnerability scanning', done: false, effort: '30 min' },
          { task: 'Configure automated dependency updates (Dependabot)', done: false, effort: '10 min' }
        ]
      },
      {
        category: 'Community',
        priority: 'medium',
        items: [
          { task: 'Triage and label open issues', done: false, effort: '1 hour' },
          { task: 'Respond to open pull requests', done: false, effort: '1-2 hours' },
          { task: 'Add "good first issue" labels to beginner-friendly tasks', done: false, effort: '30 min' },
          { task: 'Pin important issues or discussions', done: false, effort: '10 min' }
        ]
      },
      {
        category: 'Release Management',
        priority: 'low',
        items: [
          { task: 'Create a new release/tag with updated changelog', done: false, effort: '30 min' },
          { task: 'Update package/dependency versions', done: false, effort: '1-2 hours' },
          { task: 'Add release automation via GitHub Actions', done: false, effort: '1 hour' }
        ]
      }
    ];

    const totalTasks = checklist.flatMap(c => c.items).length;
    const completedTasks = checklist.flatMap(c => c.items).filter(i => i.done).length;

    res.json({
      checklist,
      progress: {
        total: totalTasks,
        completed: completedTasks,
        percentage: Math.round((completedTasks / totalTasks) * 100)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/revival/strategies
 * Returns general revival strategies
 */
router.get('/strategies', (req, res) => {
  res.json({
    strategies: [
      {
        name: 'The Quick Win Sprint',
        timeframe: '1 week',
        description: 'Fix docs, add CI, triage issues. Low effort, high visibility.',
        steps: ['Update README', 'Set up GitHub Actions', 'Triage + label all open issues', 'Post a "project is back" announcement']
      },
      {
        name: 'The Community Reboot',
        timeframe: '1 month',
        description: 'Re-engage past contributors and attract new ones.',
        steps: ['Email past contributors', 'Create good-first-issues', 'Join relevant Discord/Slack communities', 'Post on Hacker News / Reddit']
      },
      {
        name: 'The Technical Refresh',
        timeframe: '1-3 months',
        description: 'Modernize the tech stack and improve code quality.',
        steps: ['Upgrade dependencies', 'Add comprehensive tests', 'Refactor legacy code', 'Publish new release']
      },
      {
        name: 'The Handoff Strategy',
        timeframe: '2-4 weeks',
        description: 'Transfer ownership to an active maintainer.',
        steps: ['Post in issues asking for new maintainers', 'Document architecture and decisions', 'Transfer repo ownership', 'Archive if no takers']
      }
    ]
  });
});

module.exports = router;
