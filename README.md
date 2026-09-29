# ♻️ RepoRevive

> **AI-powered abandoned repository analysis and revival assistant**

[![CI/CD](https://github.com/icohangar-ops/reporevive/actions/workflows/ci.yml/badge.svg)](https://github.com/icohangar-ops/reporevive/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![Powered by Claude](https://img.shields.io/badge/AI-Claude%20Opus-orange)](https://anthropic.com)

---

## 📌 What is RepoRevive?

Over **2.1 million** GitHub repositories are effectively abandoned — no commits in over a year, unanswered issues, outdated documentation. These represent countless hours of developer work and valuable open-source solutions that communities have walked away from.

**RepoRevive** breathes new life into these abandoned codebases. Enter any GitHub repository URL and within 60 seconds get:

- 📊 **Staleness & Revival Potential scores** — data-driven assessment across 6 dimensions
- 🤖 **AI-generated revival plan** — actionable roadmap powered by Claude Opus
- 📝 **Professional README generator** — auto-generated from your actual code
- 🎯 **Good First Issues** — attract new contributors instantly
- ✅ **Interactive revival checklist** — step-by-step with effort estimates

---

## 🎯 Hackathon Track

**Developer Tools & Open Source Sustainability**
ICO Hangar Hackathon 2024 | Team: icohangar-ops

---

## 🚀 Live Demo

| Environment | URL |
|---|---|
| Frontend | https://reporevive.vercel.app |
| Backend API | https://reporevive-api.railway.app |
| Demo Video | https://youtu.be/reporevive-demo |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| TanStack Query | Server state management |
| Recharts | Data visualization |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 + Express | API server |
| @octokit/rest | GitHub API client |
| @anthropic-ai/sdk | Claude AI integration |
| node-cache | In-memory caching |
| helmet + rate-limit | Security middleware |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization |
| GitHub Actions | CI/CD pipeline |
| Vercel | Frontend hosting |
| Railway | Backend hosting |

---

## ✨ Improvements in v2.0

| Feature | v1.0 | v2.0 |
|---|---|---|
| Staleness scoring | Basic date check | 6-dimension weighted algorithm |
| AI analysis | None | Claude Opus revival plans |
| README generation | None | ✅ AI-powered |
| Good First Issues | None | ✅ AI-generated |
| Revival checklist | Static | ✅ Interactive with effort estimates |
| Language breakdown | None | ✅ Visual percentage chart |
| Security | None | ✅ Helmet, rate limiting, CORS |
| Testing | None | ✅ Unit + integration tests |
| CI/CD | None | ✅ GitHub Actions |
| Docker | None | ✅ Full docker-compose setup |

---

## 📦 Project Structure

```
reporevive/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── backend/
│   ├── src/
│   │   ├── index.js            # Express app entry point
│   │   ├── routes/
│   │   │   ├── repo.js         # Repository info endpoint
│   │   │   ├── analyze.js      # AI analysis endpoints
│   │   │   └── revival.js      # Checklist & strategies
│   │   └── services/
│   │       ├── githubService.js # GitHub API + scoring algorithms
│   │       └── aiService.js     # Claude AI integration
│   ├── tests/
│   │   ├── api.test.js         # Integration tests
│   │   └── scoring.test.js     # Unit tests for scoring
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Root component + routing
│   │   ├── App.css             # Global styles (dark theme)
│   │   ├── index.js            # React entry point
│   │   ├── components/
│   │   │   ├── Header.js       # Navigation header
│   │   │   └── ScoreComponents.js # Gauges, bars, badges
│   │   └── pages/
│   │       ├── Home.js         # Landing page
│   │       ├── Analysis.js     # Repository analysis dashboard
│   │       ├── RevivalPlan.js  # Strategies & checklist
│   │       └── About.js        # About + tech stack
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- A GitHub Personal Access Token (for higher API rate limits)
- An Anthropic API key (for AI features)

### 1. Clone the repository
```bash
git clone https://github.com/icohangar-ops/reporevive.git
cd reporevive
```

### 2. Configure the backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN and ANTHROPIC_API_KEY
npm install
npm run dev
```

### 3. Start the frontend
```bash
cd ../frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) — the app is running!

---

## 🐳 Docker (Recommended)

```bash
# Copy and fill in your secrets
cp backend/.env.example .env

# Start everything
docker-compose up --build
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000

---

## 🔌 API Reference

### GET `/health`
Health check.

### GET `/api/repo/info?repo=owner/repo`
Returns repository metadata, staleness score, and revival potential.

### POST `/api/analyze`
```json
{ "repo": "owner/repo", "token": "optional_pat" }
```
Full AI-powered analysis including revival plan, language breakdown, and activity metrics.

### POST `/api/analyze/readme`
```json
{ "repo": "owner/repo" }
```
Generates a professional README.md for the repository.

### POST `/api/analyze/issues`
```json
{ "repo": "owner/repo" }
```
Suggests 5 "good first issues" to kickstart community activity.

### POST `/api/revival/checklist`
Returns an interactive revival checklist with effort estimates.

### GET `/api/revival/strategies`
Returns 4 proven revival strategies with step-by-step guides.

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Run with coverage
npm test -- --coverage
```

Test suite covers:
- ✅ API endpoint validation
- ✅ Staleness scoring algorithm
- ✅ Revival potential scoring
- ✅ Error handling

---

## 📊 Scoring Methodology

### Staleness Score (0–100, higher = more abandoned)
| Factor | Weight | Criteria |
|---|---|---|
| Days since last push | 40 | >730 days = max |
| Recent commit count | 20 | 0 commits = max |
| Stale open issues | 15 | >10 stale issues |
| Release recency | 15 | >365 days since release |
| Archived flag | 10 | Archived = max |

### Revival Potential Score (0–100, higher = more worth reviving)
| Factor | Weight | Criteria |
|---|---|---|
| Star count | 30 | >1000 stars = max |
| Fork count | 20 | >200 forks = max |
| Description + topics | 15 | Both present = max |
| Contributor count | 20 | >10 contributors = max |
| Open issues | 15 | >20 issues = max |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'feat: add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👥 Team

Built with ❤️ by the **icohangar-ops** team at ICO Hangar Hackathon 2024.

---

*RepoRevive — Because great code deserves a second chance.*
