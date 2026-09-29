import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ProgressBar } from '../components/ScoreComponents';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PRIORITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

export default function RevivalPlan() {
  const [searchParams] = useSearchParams();
  const [repo, setRepo] = useState(searchParams.get('repo') || '');
  const [checklist, setChecklist] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedItems, setCompletedItems] = useState({});

  useEffect(() => {
    fetchStrategies();
    if (repo) fetchChecklist(repo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStrategies = async () => {
    try {
      const res = await axios.get(`${API}/api/revival/strategies`);
      setStrategies(res.data.strategies);
    } catch {}
  };

  const fetchChecklist = async (repoName) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/revival/checklist`, {
        stalenessScore: 60,
        revivalPotential: 40,
        hasReadme: false,
        hasLicense: false,
        hasTests: false,
        hasCI: false
      });
      setChecklist(res.data);
    } catch {
      setChecklist(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setCompletedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalDone = checklist
    ? checklist.checklist.flatMap((c, ci) =>
        c.items.map((_, ii) => completedItems[`${ci}-${ii}`] || _.done)
      ).filter(Boolean).length
    : 0;

  const totalItems = checklist?.progress?.total || 0;

  return (
    <div className="page">
      <h1 className="page-title">Revival Strategies & Checklist</h1>
      <p className="page-subtitle">Proven strategies to bring your repository back to life.</p>

      {/* Strategy cards */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>🎯 Proven Revival Strategies</h2>
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {strategies.map(s => (
          <div key={s.name} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <span className="badge badge-blue">{s.timeframe}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 12 }}>{s.description}</p>
            <ol style={{ paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              {s.steps.map((step, i) => <li key={i} style={{ marginBottom: 4 }}>{step}</li>)}
            </ol>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>✅ Revival Checklist</h2>

      {!checklist && !loading && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none', width: 320, marginRight: 10 }}
            placeholder="owner/repo"
            value={repo}
            onChange={e => setRepo(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => fetchChecklist(repo)} disabled={!repo}>
            Generate Checklist
          </button>
        </div>
      )}

      {loading && <div className="loading-center"><div className="spinner" /></div>}

      {checklist && (
        <>
          {/* Progress */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Overall Progress</div>
                <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                  {totalDone} of {totalItems} tasks completed
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>
                {Math.round((totalDone / totalItems) * 100)}%
              </div>
            </div>
            <ProgressBar value={Math.round((totalDone / totalItems) * 100)} color="#6366f1" />
          </div>

          {checklist.checklist.map((category, ci) => (
            <div key={category.category} className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-header">
                <div className="card-title">{category.category}</div>
                <span
                  className="badge"
                  style={{
                    background: `${PRIORITY_COLOR[category.priority]}22`,
                    color: PRIORITY_COLOR[category.priority],
                    textTransform: 'capitalize'
                  }}
                >
                  {category.priority} priority
                </span>
              </div>
              {category.items.map((item, ii) => {
                const key = `${ci}-${ii}`;
                const done = completedItems[key] !== undefined ? completedItems[key] : item.done;
                return (
                  <div
                    key={ii}
                    className={`checklist-item ${done ? 'check-done' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleItem(ci, ii)}
                  >
                    <span className="check-icon">{done ? '✅' : '⬜'}</span>
                    <span className="check-text" style={{ flex: 1 }}>{item.task}</span>
                    <span className="effort-badge">⏱ {item.effort}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
