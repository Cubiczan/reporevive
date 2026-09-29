import React from 'react';

export default function About() {
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1 className="page-title">About RepoRevive</h1>
      <p className="page-subtitle">v2.0 — Built at ICO Hangar Hackathon 2024</p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">The Problem</div>
        <p style={{ marginTop: 10, lineHeight: 1.8 }}>
          Over <strong>2.1 million</strong> GitHub repositories are effectively abandoned — no commits in over a year,
          unanswered issues, outdated documentation. These represent countless hours of work, valuable solutions,
          and communities that were once engaged. Most don't need to die; they just need a revival plan.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">Our Solution</div>
        <p style={{ marginTop: 10, lineHeight: 1.8 }}>
          RepoRevive combines the <strong>GitHub API</strong> with <strong>Anthropic's Claude AI</strong> to automatically
          analyze abandoned repositories, score them on staleness and revival potential, and generate personalized,
          actionable revival plans. In under 5 minutes, maintainers get a complete roadmap to bring their project back to life.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">Tech Stack</div>
        <div className="grid-2" style={{ marginTop: 12 }}>
          {[
            { category: 'Frontend', items: ['React 18', 'React Router v6', 'TanStack Query', 'Recharts', 'Lucide React'] },
            { category: 'Backend', items: ['Node.js 20', 'Express.js', 'Octokit (GitHub API)', 'Anthropic Claude API', 'node-cache'] },
            { category: 'AI / ML', items: ['Anthropic Claude Opus', 'Prompt engineering', 'Structured JSON outputs'] },
            { category: 'DevOps', items: ['GitHub Actions CI/CD', 'Docker', 'Vercel (frontend)', 'Railway (backend)'] },
          ].map(group => (
            <div key={group.category}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem' }}>{group.category}</div>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94a3b8' }}>
                {group.items.map(item => (
                  <li key={item} style={{ padding: '3px 0', borderBottom: '1px solid #1e293b' }}>
                    → {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">Improvements in v2.0</div>
        <ul className="plan-list" style={{ marginTop: 12 }}>
          {[
            'Added AI-powered revival plan generation using Claude claude-opus-4-20250805',
            'New staleness scoring algorithm with 6 weighted dimensions',
            'Revival potential score to prioritize which repos to revive',
            'AI-generated README template generation',
            'Good First Issue suggestions to attract contributors',
            'Interactive revival checklist with effort estimates',
            'Language breakdown visualizer',
            'Rate limiting, caching, and security headers',
            'Full test suite (unit + integration)',
            'GitHub Actions CI/CD pipeline',
          ].map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      <div className="card">
        <div className="card-title">Hackathon Track</div>
        <p style={{ marginTop: 10, lineHeight: 1.8 }}>
          <strong>Track:</strong> Developer Tools & Open Source Sustainability<br />
          <strong>Team:</strong> ICO Hangar Ops<br />
          <strong>Event:</strong> ICO Hangar Hackathon 2024
        </p>
      </div>
    </div>
  );
}
