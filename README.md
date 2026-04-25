# Sports Dashboard

High-performance sports dashboard built with pure HTML, CSS, and JavaScript, now styled with a Bauhaus design system.

## Design Direction (Bauhaus)

1. Minimalism:
Only functional components are visible. Ornamentation is reduced to structural geometric shapes.

2. Grid Systems:
The layout uses a strict 12-column grid for predictable hierarchy and responsive behavior.

3. Simple Typography:
Geometric sans serif typography is used for clear and modern information density.

4. 2D Shape Language:
Square, circle, and triangle elements create atmosphere while remaining consistent with functional composition.

5. Primary Color Logic:
Red, yellow, blue, black, and white control emphasis, interaction states, and module identity.

## Current Feature Set

### Formula 1 Module (Fully Wired)

1. Live Race Center:
- Next race metadata from Ergast
- Countdown timer
- Circuit mini-map
- Weather lookup from Open-Meteo using circuit coordinates

2. Driver Standings:
- Interactive list from current standings
- Select driver to refresh profile state
- Favorite driver persisted in local storage

3. Driver Profile Card:
- Points
- Wins
- Current rank and constructor
- Cumulative points trajectory with Chart.js

4. Constructor Battle:
- Animated relative point bars
- Bauhaus primary-color sequence for scan speed

5. Head-to-Head:
- Driver pair selection
- Average qualifying grid and average finish calculations

### Expansion Modules (Scaffolded in Same Component System)

1. Football:
League snapshot cards, match center placeholders, adapter endpoint callout.

2. Cricket:
Wagon wheel visual placeholder, live scoring adapter endpoint callout.

3. NBA:
Shot chart placeholder and efficiency context cards, adapter endpoint callout.

## Implementation Steps (Detailed)

1. Foundation Setup
- Create semantic page shell in index.html.
- Add tab-based module navigation.
- Add reusable stat card template.

2. Bauhaus UI System
- Define design tokens in styles.css.
- Build flat bordered cards and strict spacing rhythm.
- Add geometric background layer with square, circle, triangle.
- Add responsive collapse behavior for tablet and mobile.

3. Module State Engine
- Build central state object in app.js.
- Track active module and favorite driver in local storage.
- Bind tab events and module rerender flow.

4. Formula 1 Data Layer
- Fetch standings and next race in parallel from Ergast.
- Fetch race-by-race results for trajectory chart.
- Fetch weather from Open-Meteo using next circuit coordinates.

5. F1 Visualization Layer
- Render driver list with active selection state.
- Build constructor bars as relative percentages.
- Render head-to-head panel with computed averages.
- Draw trajectory chart with Chart.js.

6. Universal Framework Expansion
- Keep card and grid components shared.
- Replace only data adapters and sport-specific visualization fragments.
- Preserve the same information architecture for cross-sport consistency.

## Data Providers

1. Formula 1:
- Ergast API
- Open-Meteo

2. Football:
- API-Football or Football-Data.org

3. Cricket:
- CricketData.org or Cricbuzz via RapidAPI

4. NBA:
- BallDontLie

## Local Run

Open index.html directly in a browser.

## Deployment

This is a pure static project. Deploy directly to:

1. GitHub Pages
2. Netlify
3. Vercel

No backend service required.
