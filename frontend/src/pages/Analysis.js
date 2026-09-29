import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ScoreGauge, StalenessLabel, PotentialLabel, LanguageBar } from '../components/ScoreComponents';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Analysis() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(searchParams.get('repo') || '');
  const [inputRepo, setInputRepo] = useState(searchParams.get('repo') || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (repo) fetchAnalysis(repo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  const fetchAnalysis = async (repoName) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await axios.post(`${API}/api/analyze`, { repo: repoName });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository. Check the repo name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRepo.trim()) {
      setRepo(inputRepo.trim());
      navigate(`/analyze?repo=${encodeURIComponent(inputRepo.trim())}`);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Repository Analysis</h1>
      <p className="page-subtitle">Enter any GitHub repository to get an AI-powered revival assessment.</p>

      {/* Search */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: '2rem', maxWidth: 600 }}>
        <input
          type="text"
          className="search-row"
          style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' }}
          placeholder="owner/repo or full GitHub URL"
          value={inputRepo}
          onChange={e => setInputRepo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !inputRepo.trim()}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {/* Error */}
      {error && <div className="error-box">⚠️ {error}</div>}

      {/* Loading */}
      {loading && (
        <div className="loading-center">
          <div className="spinner" />
          <p>Analyzing repository with AI…</p>
          <p style={{ fontSize: '0.8rem', marginTop: 8 }}>This may take 15–30 seconds</p>
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          {/* Repo header */}
          <div className="analysis-header">
            <div style={{ flex: 1 }}>
              <div className="repo-name">
                <a href={data.repository.url} target="_blank" rel="noreferrer" style={{ color: '#f1f5f9', textDecoration: 'none' }}>
                  {data.repository.name}
                </a>
              </div>
              <div className="repo-desc">{data.repository.description || 'No description'}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <StalenessLabel score={data.scores.staleness} />
                <PotentialLabel score={data.scores.revivalPotential} />
                <span className="badge badge-blue">Grade: {data.scores.healthGrade}</span>
                {data.repository.archived && <span className="badge badge-red">Archived</span>}
              </div>
              {data.repository.topics.length > 0 && (
                <div className="tags">
                  {data.repository.topics.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <ScoreGauge score={data.scores.staleness} label="Staleness" />
              <div style={{ width: 16 }} />
              <ScoreGauge score={data.scores.revivalPotential} label="Potential" color="#10b981" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            {[
              { value: data.repository.stars.toLocaleString(), label: 'Stars', icon: '⭐' },
              { value: data.repository.forks.toLocaleString(), label: 'Forks', icon: '🍴' },
              { value: data.repository.openIssues.toLocaleString(), label: 'Open Issues', icon: '🐛' },
              { value: data.activity.totalContributors, label: 'Contributors', icon: '👥' },
              { value: data.activity.commitsLast6Months, label: 'Commits (6 mo)', icon: '📝' },
              { value: data.scores.healthGrade, label: 'Health Grade', icon: '📊' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.icon} {s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: 0 }}>
            {['overview', 'revival plan', 'activity', 'languages'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600,
                  color: tab === t ? '#f1f5f9' : '#94a3b8',
                  borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
                  marginBottom: -1, textTransform: 'capitalize', transition: 'color 0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {tab === 'overview' && (
            <div className="grid-2">
              {data.revivalPlan?.summary && (
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                  <div className="card-title">AI Assessment</div>
                  <p style={{ marginTop: 8, lineHeight: 1.7 }}>{data.revivalPlan.summary}</p>
                  {data.revivalPlan.whyItMatters && (
                    <p style={{ marginTop: 8, color: '#94a3b8', fontSize: '0.9rem' }}>{data.revivalPlan.whyItMatters}</p>
                  )}
                </div>
              )}
              {data.revivalPlan?.quickWins && (
                <div className="card">
                  <div className="card-title">⚡ Quick Wins</div>
                  <ul className="plan-list" style={{ marginTop: 12 }}>
                    {data.revivalPlan.quickWins.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              {data.revivalPlan?.communityStrategy && (
                <div className="card">
                  <div className="card-title">🤝 Community Strategy</div>
                  <p style={{ marginTop: 8, fontSize: '0.9rem', color: '#cbd5e1' }}>{data.revivalPlan.communityStrategy}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Revival Plan */}
          {tab === 'revival plan' && data.revivalPlan && (
            <div className="grid-2">
              {data.revivalPlan.shortTermGoals && (
                <div className="card">
                  <div className="card-title">📅 Short-Term Goals (1–4 weeks)</div>
                  <ul className="plan-list" style={{ marginTop: 12 }}>
                    {data.revivalPlan.shortTermGoals.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
              {data.revivalPlan.longTermRoadmap && (
                <div className="card">
                  <div className="card-title">🗺️ Long-Term Roadmap (3–6 months)</div>
                  <ul className="plan-list" style={{ marginTop: 12 }}>
                    {data.revivalPlan.longTermRoadmap.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
              {data.revivalPlan.maintenanceTips && (
                <div className="card">
                  <div className="card-title">🔧 Maintenance Tips</div>
                  <ul className="plan-list" style={{ marginTop: 12 }}>
                    {data.revivalPlan.maintenanceTips.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
              {data.revivalPlan.potentialBlockers && (
                <div className="card">
                  <div className="card-title">⚠️ Potential Blockers</div>
                  <ul className="plan-list" style={{ marginTop: 12 }}>
                    {data.revivalPlan.potentialBlockers.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <div className="card-title">🎯 Get Full Revival Checklist</div>
                <p style={{ marginTop: 8, color: '#94a3b8', fontSize: '0.9rem', marginBottom: 12 }}>
                  Get a step-by-step structured checklist with effort estimates for reviving this repository.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/revival?repo=${encodeURIComponent(data.repository.name)}`)}
                >
                  Open Revival Checklist →
                </button>
              </div>
            </div>
          )}

          {/* Tab: Activity */}
          {tab === 'activity' && (
            <div className="grid-2">
              <div className="card">
                <div className="card-title">Recent Commits</div>
                {data.activity.lastCommitDate ? (
                  <>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '8px 0' }}>
                      Last commit: {new Date(data.activity.lastCommitDate).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p style={{ color: '#94a3b8', marginTop: 8 }}>No commits found</p>
                )}
              </div>
              <div className="card">
                <div className="card-title">Top Contributors</div>
                <div style={{ marginTop: 10 }}>
                  {data.activity.topContributors.length > 0 ? data.activity.topContributors.map(c => (
                    <div key={c.login} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <img src={c.avatar} alt={c.login} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      <span style={{ fontSize: '0.9rem' }}>{c.login}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#94a3b8' }}>{c.contributions} commits</span>
                    </div>
                  )) : <p style={{ color: '#94a3b8' }}>No contributor data</p>}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Languages */}
          {tab === 'languages' && (
            <div className="card" style={{ maxWidth: 640 }}>
              <div className="card-title">Language Breakdown</div>
              <div style={{ marginTop: 16 }}>
                {data.languages.length > 0 ? (
                  <LanguageBar languages={data.languages} />
                ) : (
                  <p style={{ color: '#94a3b8' }}>No language data available</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
