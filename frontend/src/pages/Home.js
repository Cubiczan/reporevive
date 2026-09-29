import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLE_REPOS = [
  'nicehash/NiceHashQuickMiner',
  'gruntjs/grunt',
  'bower/bower',
  'tj/commander.js'
];

export default function Home() {
  const [repo, setRepo] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (repo.trim()) {
      navigate(`/analyze?repo=${encodeURIComponent(repo.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✨ AI-Powered Repository Revival</div>
        <h1>
          Revive Your <span className="accent">Abandoned</span> GitHub Repos
        </h1>
        <p>
          RepoRevive analyzes stale GitHub repositories and generates AI-powered revival plans,
          README templates, and community strategies — so your code never dies.
        </p>
        <div className="hero-actions">
          <a href="#search" className="btn btn-primary">Analyze a Repo →</a>
          <a href="https://github.com/icohangar-ops/reporevive" className="btn btn-outline" target="_blank" rel="noreferrer">View on GitHub</a>
        </div>
      </section>

      {/* Search box */}
      <div id="search" style={{ maxWidth: 640, margin: '0 auto 3rem', padding: '0 1rem' }}>
        <form onSubmit={handleAnalyze} className="search-box">
          <label htmlFor="repo-input">Enter a GitHub Repository</label>
          <div className="search-row">
            <input
              id="repo-input"
              type="text"
              placeholder="owner/repo or full GitHub URL"
              value={repo}
              onChange={e => setRepo(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!repo.trim()}>
              Analyze
            </button>
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#94a3b8' }}>
            Try: {EXAMPLE_REPOS.map((r, i) => (
              <React.Fragment key={r}>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                  onClick={() => setRepo(r)}
                >{r}</button>
                {i < EXAMPLE_REPOS.length - 1 && ', '}
              </React.Fragment>
            ))}
          </div>
        </form>
      </div>

      {/* Features */}
      <section className="features">
        <h2 className="features-title">Everything You Need to Revive a Repo</h2>
        <p className="features-sub">From diagnosis to execution — RepoRevive handles it all.</p>
        <div className="grid-3">
          {[
            { icon: '🔬', title: 'Staleness Analysis', desc: 'Quantifies how abandoned a repo is using commits, issues, stars, and release history.' },
            { icon: '💡', title: 'Revival Potential Score', desc: 'Calculates whether a repo is worth reviving based on community interest and activity.' },
            { icon: '🤖', title: 'AI Revival Plans', desc: 'Claude AI generates specific, actionable steps tailored to each repository.' },
            { icon: '📝', title: 'README Generator', desc: 'Auto-generates a professional README.md based on your repo\'s actual code and context.' },
            { icon: '🎯', title: 'Good First Issues', desc: 'Suggests beginner-friendly issues to attract new contributors to your project.' },
            { icon: '✅', title: 'Revival Checklist', desc: 'Structured checklist covering docs, CI/CD, community, and release management.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'rgba(99,102,241,0.05)', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '3rem 2rem', marginBottom: '3rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { value: '2.1M+', label: 'Abandoned repos on GitHub' },
            { value: '73%', label: 'Have potential for revival' },
            { value: '< 5 min', label: 'Time to get a revival plan' },
            { value: 'Claude AI', label: 'Powered by Anthropic' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{s.value}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
