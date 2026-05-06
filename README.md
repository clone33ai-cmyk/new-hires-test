# Mr. Pool Leak Repair — New Hire Evaluation App

An interactive assessment tool for evaluating Dispatcher and Technician candidates. Built with React (Vite) + Express + Claude AI + VAPI voice simulation.

---

## Features

- **Role selection landing page** — Dispatcher or Technician
- **45-question deep assessment** per role with:
  - Multiple choice, True/False, and Scenario questions
  - Section-by-section progress with mini reviews
  - Instant feedback with explanations after each answer
- **AI Voice Call Simulation** (Dispatchers only) — powered by VAPI
  - Hire speaks with a realistic AI customer
  - Transcript is evaluated by Claude against the signup script rubric
- **Full results page** with:
  - Combined score (quiz 60% + voice call 40%)
  - Hire recommendation: STRONG HIRE / CONSIDER / NOT RECOMMENDED
  - Section breakdowns, missed questions review, coaching notes
  - Printable PDF report

---

## Project Structure

```
mrpool-eval/
├── backend/
│   ├── index.js              # Express server
│   ├── routes/
│   │   ├── evaluate.js       # Claude AI evaluation endpoints
│   │   └── vapi.js           # VAPI assistant config + webhooks
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Role selection
│   │   │   ├── Intro.jsx         # Name entry + briefing
│   │   │   ├── Quiz.jsx          # 45-question assessment
│   │   │   ├── VoiceSimulation.jsx  # VAPI call UI
│   │   │   └── Results.jsx       # Full results + coaching
│   │   ├── data/
│   │   │   ├── dispatcherQuestions.js   # 45 dispatcher questions
│   │   │   └── technicianQuestions.js   # 45 technician questions
│   │   └── index.css
│   └── .env.example
├── railway.toml
└── package.json
```

---

## Local Development Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/mrpool-eval.git
cd mrpool-eval
npm run install:all
```

### 2. Set up environment variables

**Backend** — create `backend/.env`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** — create `frontend/.env`:
```
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```

> Get your VAPI Public Key from: https://dashboard.vapi.ai → Account → API Keys

### 3. Run in development

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:3000`

---

## VAPI Setup

1. Log in to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Go to **Account → API Keys** and copy your **Public Key**
3. Add it to `frontend/.env` as `VITE_VAPI_PUBLIC_KEY`
4. The assistant is configured dynamically via `/api/vapi/assistant-config` — no manual assistant creation needed

**Optional:** Set up a VAPI webhook URL pointing to `https://your-domain.com/api/vapi/webhook` to receive call-end transcripts server-side.

---

## Deployment on Railway

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mrpool-eval.git
git push -u origin main
```

### 2. Create Railway project

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your `mrpool-eval` repo
3. Railway auto-detects `railway.toml`

### 3. Add environment variables in Railway

In your Railway project → **Variables**, add:
```
ANTHROPIC_API_KEY = your_key
VITE_VAPI_PUBLIC_KEY = your_vapi_key
NODE_ENV = production
```

Railway will automatically:
- Run `npm run install:all && npm run build` (builds the React app)
- Start the Express server which serves the built frontend
- Your app is live at the Railway-assigned URL

---

## Scoring System

| Component | Weight |
|-----------|--------|
| Knowledge Quiz (45 questions) | 60% |
| Voice Call Simulation (dispatchers only) | 40% |

| Score | Recommendation |
|-------|---------------|
| 85–100 | STRONG HIRE |
| 65–84 | CONSIDER |
| 0–64 | NOT RECOMMENDED |

---

## Question Bank Summary

### Dispatcher (45 questions)
- Company Knowledge (10 questions)
- Call Handling & Script (10 questions)
- Scheduling & Operations (5 questions)
- Follow-Up & Sales (5 questions)
- Pool Leak Knowledge (5 questions)
- Repair Pricing (5 questions)
- Scenarios (5 questions)

### Technician (45 questions)
- Company Knowledge (7 questions)
- Detection Methods (10 questions)
- Documentation (4 questions)
- Repair Pricing (9 questions)
- Pool Structure & Symptoms (5 questions)
- Scenarios (10 questions)

---

## Customization

**Adding questions:** Edit `frontend/src/data/dispatcherQuestions.js` or `technicianQuestions.js`

**Adjusting scoring weights:** Edit the `combinedScore` calculation in `frontend/src/pages/Results.jsx`

**Updating the voice customer persona:** Edit `CUSTOMER_PERSONA` in `backend/routes/vapi.js`

**Updating the grading rubric:** Edit `DISPATCHER_SCRIPT_RUBRIC` in `backend/routes/evaluate.js`
