const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generate an AI-powered revival plan for a repository
 */
async function generateRevivalPlan(repoData, stalenessScore, revivalPotential) {
  const { repo, commits, contributors, issues, languages, releases } = repoData;

  const languageList = Object.keys(languages).join(', ') || 'Unknown';
  const lastCommit = commits[0]?.commit?.author?.date
    ? new Date(commits[0].commit.author.date).toDateString()
    : 'No commits found';
  const topContributors = contributors.slice(0, 3).map(c => c.login).join(', ') || 'None';

  const prompt = `You are an expert open-source maintainer and developer advocate. Analyze this GitHub repository and provide a structured revival plan.

Repository: ${repo.full_name}
Description: ${repo.description || 'No description'}
Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}
Languages: ${languageList}
Last commit: ${lastCommit}
Open issues: ${repo.open_issues_count}
Contributors: ${topContributors}
Staleness Score: ${stalenessScore}/100 (higher = more abandoned)
Revival Potential: ${revivalPotential}/100 (higher = more worth reviving)
Topics: ${(repo.topics || []).join(', ') || 'None'}

Provide a JSON response with exactly this structure:
{
  "summary": "2-3 sentence honest assessment of the repo's current state",
  "whyItMatters": "Why this repo is worth reviving (or why it isn't)",
  "quickWins": ["3-5 immediate actions that can be done in under an hour"],
  "shortTermGoals": ["3-5 goals for the next 1-4 weeks"],
  "longTermRoadmap": ["3-5 strategic goals for 3-6 months"],
  "maintenanceTips": ["3-4 tips to keep the repo active after revival"],
  "potentialBlockers": ["2-3 risks or challenges to revival"],
  "communityStrategy": "How to re-engage contributors and users"
}

Be specific, actionable, and realistic. Reference the actual repo name and languages.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].text;
  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: content };
  } catch {
    return { summary: content };
  }
}

/**
 * Generate a professional README template for the repository
 */
async function generateReadmeTemplate(repoData) {
  const { repo, languages } = repoData;
  const languageList = Object.keys(languages).join(', ') || 'Unknown';

  const prompt = `Generate a professional, modern README.md for this GitHub repository:

Name: ${repo.name}
Description: ${repo.description || 'A software project'}
Languages: ${languageList}
Stars: ${repo.stargazers_count}
Topics: ${(repo.topics || []).join(', ') || 'None'}
License: ${repo.license?.name || 'Not specified'}

Create a complete README with: badges, description, features, installation, usage, contributing guide, and license sections. Use markdown. Make it compelling and welcoming to contributors.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

/**
 * Generate suggested issue titles to kickstart community activity
 */
async function generateGoodFirstIssues(repoData) {
  const { repo, languages } = repoData;

  const prompt = `For the GitHub repository "${repo.full_name}" (${repo.description || 'a software project'}) using ${Object.keys(languages).join(', ')}, generate 5 "good first issue" titles with brief descriptions. Format as JSON array: [{"title": "...", "description": "...", "labels": ["good first issue", "..."]}]`;

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }]
  });

  try {
    const jsonMatch = message.content[0].text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch {
    return [];
  }
}

module.exports = { generateRevivalPlan, generateReadmeTemplate, generateGoodFirstIssues };
