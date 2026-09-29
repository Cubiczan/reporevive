const {
  calculateStalenessScore,
  calculateRevivalPotential
} = require('../src/services/githubService');

const mockRepoData = (overrides = {}) => ({
  repo: {
    pushed_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(), // 400 days ago
    stargazers_count: 150,
    forks_count: 30,
    open_issues_count: 12,
    description: 'A test repository',
    topics: ['javascript', 'tools'],
    archived: false,
    ...overrides.repo
  },
  commits: overrides.commits || [],
  contributors: overrides.contributors || [{ login: 'user1', contributions: 50 }, { login: 'user2', contributions: 20 }],
  issues: overrides.issues || [],
  languages: overrides.languages || { JavaScript: 5000, CSS: 1000 },
  releases: overrides.releases || []
});

describe('calculateStalenessScore', () => {
  it('returns high score for very old repo', () => {
    const data = mockRepoData({
      repo: { pushed_at: new Date(Date.now() - 800 * 24 * 60 * 60 * 1000).toISOString(), archived: true }
    });
    const score = calculateStalenessScore(data);
    expect(score).toBeGreaterThan(50);
  });

  it('returns low score for recently active repo', () => {
    const data = mockRepoData({
      repo: { pushed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), archived: false },
      commits: [{ commit: { author: { date: new Date().toISOString() } } }]
    });
    const score = calculateStalenessScore(data);
    expect(score).toBeLessThan(30);
  });

  it('score is capped at 100', () => {
    const score = calculateStalenessScore(mockRepoData());
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateRevivalPotential', () => {
  it('returns high potential for starred, forked repo', () => {
    const data = mockRepoData({
      repo: {
        stargazers_count: 1500,
        forks_count: 300,
        open_issues_count: 25,
        description: 'A popular tool',
        topics: ['popular']
      },
      contributors: Array(15).fill({ login: 'user', contributions: 5 })
    });
    const score = calculateRevivalPotential(data);
    expect(score).toBeGreaterThan(60);
  });

  it('score is capped at 100', () => {
    const score = calculateRevivalPotential(mockRepoData());
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
