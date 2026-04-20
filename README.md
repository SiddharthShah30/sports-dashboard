# The Paddock Dashboard

A high-performance, card-based sports command center built with pure HTML, CSS, and JavaScript.

## What Is Included

- Formula 1 live-style module with:
  - Next race countdown
  - Track weather lookup by circuit coordinates
  - Interactive driver standings list
  - Driver profile cards and season trajectory chart (Chart.js)
  - Constructor battle animated bars
  - Head-to-head driver comparison tool
- Modular tab system for Football, Cricket, and NBA with reusable card architecture.
- Local Storage preferences:
  - Last selected module
  - Favorite driver
- Responsive UI with glassmorphism, gradients, and motion.

## Run Locally

Open `index.html` in a browser.

## Data Sources

### Formula 1 (wired)
- Ergast API
- Open-Meteo (used for weather by circuit coordinates)

### Expansion Modules (adapter stubs included)
- Football: API-Football or Football-Data.org
- Cricket: Cricbuzz (RapidAPI) or CricketData.org
- NBA: BallDontLie

## Adapter Strategy

The UI uses reusable stat cards and consistent list/progress/chart sections.
To integrate another API:

1. Add a fetch function in `app.js`
2. Normalize response into a shared object shape
3. Feed normalized data into existing render functions

## Deploy

This static project can be deployed directly to:

- GitHub Pages
- Netlify
- Vercel

No backend required.
