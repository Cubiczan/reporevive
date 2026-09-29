const request = require('supertest');
const app = require('../src/index');

describe('Health check', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBe('2.0.0');
  });
});

describe('Repo routes', () => {
  it('GET /api/repo/info without repo param returns 400', async () => {
    const res = await request(app).get('/api/repo/info');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('Analyze routes', () => {
  it('POST /api/analyze without repo returns 400', async () => {
    const res = await request(app).post('/api/analyze').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('Revival routes', () => {
  it('GET /api/revival/strategies returns strategies array', async () => {
    const res = await request(app).get('/api/revival/strategies');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.strategies)).toBe(true);
    expect(res.body.strategies.length).toBeGreaterThan(0);
  });

  it('POST /api/revival/checklist returns checklist', async () => {
    const res = await request(app)
      .post('/api/revival/checklist')
      .send({ stalenessScore: 60, revivalPotential: 40 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.checklist)).toBe(true);
    expect(res.body.progress).toBeDefined();
    expect(res.body.progress.total).toBeGreaterThan(0);
  });
});
