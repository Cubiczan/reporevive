import React from 'react';

export function ScoreGauge({ score, label, color }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const gap = circumference - dash;

  const strokeColor = color || (score > 70 ? '#ef4444' : score > 40 ? '#f59e0b' : '#10b981');

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="score-ring" style={{ width: 100, height: 100 }}>
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#334155" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={strokeColor} strokeWidth="8"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="score-value" style={{ color: strokeColor }}>{score}</div>
      </div>
      <span className="score-label">{label}</span>
    </div>
  );
}

export function ProgressBar({ value, color }) {
  const bg = color || (value > 70 ? '#ef4444' : value > 40 ? '#f59e0b' : '#10b981');
  return (
    <div className="progress-bar-outer">
      <div className="progress-bar-inner" style={{ width: `${value}%`, background: bg }} />
    </div>
  );
}

export function StalenessLabel({ score }) {
  if (score >= 70) return <span className="badge badge-red">🔴 Highly Stale</span>;
  if (score >= 40) return <span className="badge badge-yellow">🟡 Moderately Stale</span>;
  return <span className="badge badge-green">🟢 Active</span>;
}

export function PotentialLabel({ score }) {
  if (score >= 70) return <span className="badge badge-green">⭐ High Potential</span>;
  if (score >= 40) return <span className="badge badge-yellow">📈 Moderate Potential</span>;
  return <span className="badge badge-red">📉 Low Potential</span>;
}

export function LanguageBar({ languages }) {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
  const total = languages.reduce((sum, l) => sum + l.bytes, 0);

  return (
    <div>
      <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', gap: 2, marginBottom: 10 }}>
        {languages.map((l, i) => (
          <div
            key={l.language}
            style={{ width: `${(l.bytes / total) * 100}%`, background: colors[i % colors.length] }}
            title={`${l.language}: ${l.percentage}%`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {languages.map((l, i) => (
          <div key={l.language} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i % colors.length] }} />
            <span>{l.language}</span>
            <span style={{ color: '#94a3b8' }}>{l.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
