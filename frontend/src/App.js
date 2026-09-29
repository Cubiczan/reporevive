import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import RevivalPlan from './pages/RevivalPlan';
import About from './pages/About';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analyze" element={<Analysis />} />
              <Route path="/revival" element={<RevivalPlan />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>RepoRevive v2.0 — Breathe new life into abandoned repositories</p>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
