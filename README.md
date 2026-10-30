# ResuMatch — Resume Screening & Job Description Matcher

A professional web application that analyzes resumes and matches them with the best-fitting job roles using intelligent skill-mapping, not just keyword filtering.

## Features

- **Resume Upload** — Upload PDF/TXT files or paste resume text directly
- **Intelligent Skill Extraction** — Automatically identifies skills, experience, education, and certifications
- **Smart Normalization** — Groups equivalent terms (e.g., "ML" = "Machine Learning")  
- **Evidence-Based Matching** — Every score is traceable to specific resume content
- **Ranked Shortlist** — Top job matches with fit scores, evidence traces, and where to apply
- **Export Reports** — Download detailed match analysis reports
- **Dark/Light Theme** — Fully responsive design with theme support
- **Sample Resumes** — 5 built-in sample resumes for testing

## Quick Start

### Option 1: Double-click
Double-click `start.bat` to launch the server, then open http://localhost:3000

### Option 2: Open directly
Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge).

### Option 3: Command line
```
cd resume-matcher
agy-node server.js
```
Then visit http://localhost:3000

## Project Structure

```
resume-matcher/
├── index.html          # Main HTML page
├── server.js           # Node.js development server
├── start.bat           # Quick-start script
├── README.md           # This file
├── css/
│   ├── styles.css      # Core styles, layout, responsive
│   ├── components.css  # Component styles (matcher, results, loader)
│   └── animations.css  # Animations and transitions
├── js/
│   ├── data.js         # Skill taxonomy, job database, sample resumes
│   ├── engine.js       # Matching engine (parsing, scoring, evidence)
│   └── app.js          # UI interactions and event handlers
├── assets/             # Images and static assets
└── data/               # Data files
```

## How It Works

1. **Upload Resume** — Upload or paste resume content
2. **Intelligent Analysis** — System extracts skills, normalizes them, and maps against job criteria  
3. **Score & Rank** — Each match scored with transparent rubric and evidence traces
4. **Actionable Results** — Ranked shortlist with fit summaries and where to apply

## Team

- **Sohail** (2420080082) — Full-Stack Developer
- **Surya** (2420080080) — ML & Data Pipeline  
- **Komal Swamy** (2420080053) — UX & Frontend Design

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js HTTP server
- **No Dependencies**: Zero external packages required
- **Design**: Custom CSS with CSS Grid, Flexbox, CSS Variables
- **Fonts**: Inter (sans-serif), JetBrains Mono (monospace)
