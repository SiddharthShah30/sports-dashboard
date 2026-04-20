const STORAGE_KEYS = {
  module: "paddock:module",
  favoriteDriver: "paddock:favoriteDriver"
};

const state = {
  activeModule: localStorage.getItem(STORAGE_KEYS.module) || "f1",
  favoriteDriver: localStorage.getItem(STORAGE_KEYS.favoriteDriver) || "",
  f1: {
    drivers: [],
    constructors: [],
    selectedDriverId: "",
    nextRace: null,
    countdownTicker: null,
    chart: null
  }
};

const SPORT_META = {
  f1: {
    tag: "F1 COMMAND CENTER",
    headline: "Live telemetry-inspired race intelligence"
  },
  football: {
    tag: "FOOTBALL MATCH OPS",
    headline: "League state, race analytics, and tactical overlays"
  },
  cricket: {
    tag: "CRICKET PERFORMANCE HUB",
    headline: "Ball-by-ball momentum and batter impact profiling"
  },
  nba: {
    tag: "NBA INTEL DECK",
    headline: "Efficiency metrics, shot zones, and conference pressure"
  }
};

const TRACK_PATHS = {
  bahrain: "M30 80 L90 30 L180 35 L240 55 L255 90 L230 120 L160 125 L120 110 L100 85 L70 95 L45 110",
  monza: "M45 35 L210 35 L250 55 L220 95 L140 105 L65 95 L40 70 Z",
  silverstone: "M35 95 L55 55 L105 40 L160 50 L210 35 L250 55 L245 100 L210 120 L160 110 L120 90 L75 105",
  monaco: "M70 120 L90 90 L120 80 L160 90 L180 70 L220 70 L240 95 L210 120 L170 120 L120 135 L85 130",
  spa: "M30 105 L65 65 L120 35 L180 45 L230 65 L250 95 L205 120 L145 115 L90 125"
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function toNum(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchJSON(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function setActiveTab() {
  qsa(".tab-btn").forEach((button) => {
    const isActive = button.dataset.module === state.activeModule;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function setHeaderMeta() {
  const meta = SPORT_META[state.activeModule];
  qs("#moduleTag").textContent = meta.tag;
  qs("#moduleHeadline").textContent = meta.headline;
  qs("#favoriteLabel").textContent = `Favorite Driver: ${state.favoriteDriver || "None"}`;
}

function clearF1Intervals() {
  if (state.f1.countdownTicker) {
    clearInterval(state.f1.countdownTicker);
    state.f1.countdownTicker = null;
  }
}

function formatCountdown(targetIso) {
  const now = Date.now();
  const target = new Date(targetIso).getTime();
  const diff = target - now;
  if (diff <= 0) {
    return "Race weekend is live now";
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;

  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);

  return `${days}d ${hours}h ${minutes}m`;
}

function createStatCard({ title, value, subtitle }) {
  const template = qs("#statCardTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  clone.querySelector(".stat-title").textContent = title;
  clone.querySelector(".stat-value").textContent = value;
  clone.querySelector(".stat-subtitle").textContent = subtitle;
  return clone;
}

function getTrackPathByCircuit(circuitId) {
  return TRACK_PATHS[circuitId] || TRACK_PATHS.silverstone;
}

function safeTeamColor(index) {
  const palette = ["#35e0a1", "#ff5f66", "#ffd166", "#4ac8ff", "#f08bff", "#8aff80", "#ff9f43"];
  return palette[index % palette.length];
}

async function fetchF1CoreData() {
  const [driverData, constructorData, nextRaceData] = await Promise.all([
    fetchJSON("https://ergast.com/api/f1/current/driverStandings.json"),
    fetchJSON("https://ergast.com/api/f1/current/constructorStandings.json"),
    fetchJSON("https://ergast.com/api/f1/current/next.json")
  ]);

  const drivers = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  const constructors = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  const nextRace = nextRaceData?.MRData?.RaceTable?.Races?.[0] || null;

  return { drivers, constructors, nextRace };
}

async function fetchDriverTrajectory(driverId) {
  const data = await fetchJSON(`https://ergast.com/api/f1/current/drivers/${driverId}/results.json?limit=100`);
  const races = data?.MRData?.RaceTable?.Races || [];

  let total = 0;
  const labels = [];
  const values = [];

  races.forEach((race) => {
    const result = race.Results?.[0];
    const points = toNum(result?.points);
    total += points;
    labels.push(`R${race.round}`);
    values.push(Number(total.toFixed(1)));
  });

  return { labels, values };
}

async function fetchDriverComparison(driverIdA, driverIdB) {
  const [dataA, dataB] = await Promise.all([
    fetchJSON(`https://ergast.com/api/f1/current/drivers/${driverIdA}/results.json?limit=100`),
    fetchJSON(`https://ergast.com/api/f1/current/drivers/${driverIdB}/results.json?limit=100`)
  ]);

  function summarize(raceData) {
    const races = raceData?.MRData?.RaceTable?.Races || [];
    const grids = [];
    const finishes = [];

    races.forEach((race) => {
      const result = race.Results?.[0];
      if (!result) {
        return;
      }
      grids.push(toNum(result.grid));
      finishes.push(toNum(result.position));
    });

    const avgGrid = grids.length ? grids.reduce((a, b) => a + b, 0) / grids.length : 0;
    const avgFinish = finishes.length ? finishes.reduce((a, b) => a + b, 0) / finishes.length : 0;

    return {
      rounds: races.length,
      avgGrid: avgGrid.toFixed(2),
      avgFinish: avgFinish.toFixed(2)
    };
  }

  return {
    a: summarize(dataA),
    b: summarize(dataB)
  };
}

async function fetchTrackWeather(lat, lon) {
  if (!lat || !lon) {
    return "Weather unavailable";
  }

  try {
    const weatherData = await fetchJSON(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
    );
    const current = weatherData?.current;
    if (!current) {
      return "Weather unavailable";
    }
    return `${current.temperature_2m}°C | Wind ${current.wind_speed_10m} km/h | Code ${current.weather_code}`;
  } catch (error) {
    return "Weather unavailable";
  }
}

function renderStandingsList(drivers) {
  return drivers
    .map((driver) => {
      const id = driver.Driver.driverId;
      const code = driver.Driver.code || driver.Driver.familyName.slice(0, 3).toUpperCase();
      const team = driver.Constructors?.[0]?.name || "Unknown Team";
      const points = driver.points;
      const isActive = state.f1.selectedDriverId === id;

      return `
        <button class="data-item ${isActive ? "active" : ""}" data-driver-id="${id}">
          <strong>#${driver.position} ${driver.Driver.givenName} ${driver.Driver.familyName} (${code})</strong>
          <span>${team} · ${points} pts</span>
        </button>
      `;
    })
    .join("");
}

function renderConstructorBars(constructors) {
  const leaderPoints = toNum(constructors[0]?.points) || 1;

  return constructors
    .slice(0, 6)
    .map((entry, index) => {
      const pct = Math.max(8, (toNum(entry.points) / leaderPoints) * 100);
      const color = safeTeamColor(index);

      return `
        <div class="card-entry" style="margin-bottom:0.65rem;">
          <div class="label-row">
            <span>${entry.Constructor.name}</span>
            <span>${entry.points} pts</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg, ${color}, rgba(255,255,255,0.35));"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderTrackMap(circuitId) {
  const path = getTrackPathByCircuit(circuitId);
  return `
    <div class="track-map card-entry">
      <svg viewBox="0 0 280 160" role="img" aria-label="Circuit mini map">
        <path class="track-line" d="${path}"></path>
      </svg>
    </div>
  `;
}

function setupCountdown(raceDateIso) {
  clearF1Intervals();
  const countdownEl = qs("#countdownValue");
  if (!countdownEl || !raceDateIso) {
    return;
  }

  const update = () => {
    countdownEl.textContent = formatCountdown(raceDateIso);
  };

  update();
  state.f1.countdownTicker = setInterval(update, 60000);
}

function setupDriverListEvents() {
  qsa("[data-driver-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.f1.selectedDriverId = button.dataset.driverId;
      localStorage.setItem(STORAGE_KEYS.favoriteDriver, state.f1.selectedDriverId);
      state.favoriteDriver = state.f1.selectedDriverId;
      setHeaderMeta();
      await renderF1();
    });
  });
}

function setupHeadToHeadEvents() {
  const compareBtn = qs("#compareBtn");
  const aSelect = qs("#driverA");
  const bSelect = qs("#driverB");
  const output = qs("#comparisonResult");

  if (!compareBtn || !aSelect || !bSelect || !output) {
    return;
  }

  compareBtn.addEventListener("click", async () => {
    output.innerHTML = "<p class='empty-state'>Comparing pace and finish metrics...</p>";

    try {
      const metrics = await fetchDriverComparison(aSelect.value, bSelect.value);
      output.innerHTML = `
        <div class="compare-grid card-entry">
          <div class="compare-cell">
            <strong>${aSelect.value.toUpperCase()}</strong>
            <p>Rounds: ${metrics.a.rounds}</p>
            <p>Avg Grid: ${metrics.a.avgGrid}</p>
            <p>Avg Finish: ${metrics.a.avgFinish}</p>
          </div>
          <div class="compare-cell">
            <strong>${bSelect.value.toUpperCase()}</strong>
            <p>Rounds: ${metrics.b.rounds}</p>
            <p>Avg Grid: ${metrics.b.avgGrid}</p>
            <p>Avg Finish: ${metrics.b.avgFinish}</p>
          </div>
        </div>
      `;
    } catch (error) {
      output.innerHTML = "<p class='empty-state'>Comparison failed. Try another pair.</p>";
    }
  });
}

function setupResetButton() {
  const resetBtn = qs("#resetPrefsBtn");
  if (!resetBtn) {
    return;
  }
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.favoriteDriver);
    state.favoriteDriver = "";
    state.f1.selectedDriverId = "";
    setHeaderMeta();
    if (state.activeModule === "f1") {
      renderF1();
    }
  });
}

function upsertTrajectoryChart(labels, values) {
  const chartEl = qs("#trajectoryChart");
  if (!chartEl) {
    return;
  }

  if (state.f1.chart) {
    state.f1.chart.destroy();
  }

  state.f1.chart = new Chart(chartEl, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Cumulative Points",
          data: values,
          borderColor: "#35e0a1",
          backgroundColor: "rgba(53, 224, 161, 0.18)",
          borderWidth: 2,
          tension: 0.28,
          fill: true,
          pointRadius: 2
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#d4ddf1"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#9fb0cf" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          ticks: { color: "#9fb0cf" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    }
  });
}

function renderF1Skeleton() {
  const grid = qs("#dashboardGrid");
  grid.innerHTML = `
    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Live Race Center <span class="inline-meta" id="raceMeta">Syncing...</span></h3>
      <p><strong>Countdown:</strong> <span id="countdownValue">Loading...</span></p>
      <p><strong>Weather:</strong> <span id="weatherValue">Loading...</span></p>
      <div id="trackMapContainer"></div>
    </article>

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Driver Standings <span class="inline-meta">Tap to expand</span></h3>
      <div id="driverStandings" class="data-list"></div>
    </article>

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Driver Profile Card</h3>
      <div id="profileStats" class="stats-row"></div>
      <div style="height: 190px; margin-top: 0.8rem;">
        <canvas id="trajectoryChart"></canvas>
      </div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Constructor Battle <span class="inline-meta">Points gap visualizer</span></h3>
      <div id="constructorBars"></div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Head-to-Head Tool</h3>
      <div class="split" style="margin-bottom:0.75rem;">
        <select id="driverA" class="select-input"></select>
        <select id="driverB" class="select-input"></select>
      </div>
      <button id="compareBtn" class="small-btn">Compare Qualifying Pace & Race Finishes</button>
      <div id="comparisonResult" style="margin-top:0.75rem;"></div>
    </article>
  `;
}

async function renderF1() {
  renderF1Skeleton();

  try {
    const { drivers, constructors, nextRace } = await fetchF1CoreData();
    state.f1.drivers = drivers;
    state.f1.constructors = constructors;
    state.f1.nextRace = nextRace;

    if (!state.f1.selectedDriverId) {
      state.f1.selectedDriverId = state.favoriteDriver || drivers[0]?.Driver?.driverId || "";
    }

    const raceDateIso = nextRace ? `${nextRace.date}T${nextRace.time || "00:00:00Z"}` : null;
    qs("#raceMeta").textContent = nextRace
      ? `${nextRace.raceName} · ${nextRace.Circuit.Location.locality}`
      : "No race scheduled";

    setupCountdown(raceDateIso);

    const lat = nextRace?.Circuit?.Location?.lat;
    const lon = nextRace?.Circuit?.Location?.long;
    qs("#weatherValue").textContent = await fetchTrackWeather(lat, lon);

    const circuitId = nextRace?.Circuit?.circuitId || "silverstone";
    qs("#trackMapContainer").innerHTML = renderTrackMap(circuitId);

    qs("#driverStandings").innerHTML = renderStandingsList(drivers);
    setupDriverListEvents();

    qs("#constructorBars").innerHTML = renderConstructorBars(constructors);

    const optionsHtml = drivers
      .map((entry) => {
        const id = entry.Driver.driverId;
        const name = `${entry.Driver.givenName} ${entry.Driver.familyName}`;
        return `<option value="${id}">${name}</option>`;
      })
      .join("");

    qs("#driverA").innerHTML = optionsHtml;
    qs("#driverB").innerHTML = optionsHtml;

    const fallbackB = drivers[1]?.Driver?.driverId || drivers[0]?.Driver?.driverId || "";
    qs("#driverA").value = state.f1.selectedDriverId || drivers[0]?.Driver?.driverId || "";
    qs("#driverB").value = fallbackB;
    setupHeadToHeadEvents();

    const selectedDriver = drivers.find((entry) => entry.Driver.driverId === state.f1.selectedDriverId) || drivers[0];
    const profileNode = qs("#profileStats");
    profileNode.innerHTML = "";

    profileNode.appendChild(
      createStatCard({
        title: "Points",
        value: selectedDriver?.points || "0",
        subtitle: "Current season"
      })
    );
    profileNode.appendChild(
      createStatCard({
        title: "Wins",
        value: selectedDriver?.wins || "0",
        subtitle: "Grand Prix victories"
      })
    );
    profileNode.appendChild(
      createStatCard({
        title: "Rank",
        value: `P${selectedDriver?.position || "?"}`,
        subtitle: selectedDriver?.Constructors?.[0]?.name || "Unknown team"
      })
    );

    const trajectory = await fetchDriverTrajectory(selectedDriver.Driver.driverId);
    upsertTrajectoryChart(trajectory.labels, trajectory.values);
  } catch (error) {
    qs("#dashboardGrid").innerHTML = `
      <article class="glass-card card-span-12">
        <h3 class="card-title">Data Stream Interrupted</h3>
        <p class="empty-state">
          Live APIs could not be reached right now. The architecture is ready; verify internet access or endpoint availability and refresh.
        </p>
      </article>
    `;
  }
}

function renderFootball() {
  const grid = qs("#dashboardGrid");
  grid.innerHTML = "";

  const cards = [
    { title: "League Focus", value: "EPL + La Liga", subtitle: "Swap feeds via adapter" },
    { title: "Golden Boot Delta", value: "3 Goals", subtitle: "Top-3 race gap" },
    { title: "Live Match Centers", value: "7 Active", subtitle: "Fixture monitor" }
  ];

  const statWrap = document.createElement("section");
  statWrap.className = "card-span-12 stats-row";
  cards.forEach((card) => statWrap.appendChild(createStatCard(card)));
  grid.appendChild(statWrap);

  grid.insertAdjacentHTML(
    "beforeend",
    `
    <article class="glass-card card-span-7 card-entry">
      <h3 class="card-title">League Table Snapshot</h3>
      <div class="data-list">
        <div class="data-item"><strong>1. Arsenal</strong><span>72 pts | +38 GD</span></div>
        <div class="data-item"><strong>2. Real Madrid</strong><span>70 pts | +31 GD</span></div>
        <div class="data-item"><strong>3. Inter</strong><span>68 pts | +25 GD</span></div>
        <div class="data-item"><strong>4. PSG</strong><span>66 pts | +29 GD</span></div>
      </div>
    </article>

    <article class="glass-card card-span-5 card-entry">
      <h3 class="card-title">Adapter Endpoint</h3>
      <p class="empty-state">Plug in API-Football or Football-Data.org key and map to the reusable card schema.</p>
      <pre style="white-space: pre-wrap; color: #d4ddf1;">fetch("https://api.football-data.org/v4/competitions/PL/standings", {
  headers: { "X-Auth-Token": "YOUR_KEY" }
});</pre>
    </article>
    `
  );
}

function renderCricket() {
  const grid = qs("#dashboardGrid");
  grid.innerHTML = "";

  const cards = [
    { title: "ICC Ranking Lead", value: "India +17", subtitle: "Points over #2" },
    { title: "Live Overs", value: "42.3", subtitle: "Current innings" },
    { title: "Strike Burst", value: "164.2", subtitle: "Powerplay tempo" }
  ];

  const statWrap = document.createElement("section");
  statWrap.className = "card-span-12 stats-row";
  cards.forEach((card) => statWrap.appendChild(createStatCard(card)));
  grid.appendChild(statWrap);

  grid.insertAdjacentHTML(
    "beforeend",
    `
    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Wagon Wheel Zones</h3>
      <p class="empty-state">Render scoring vectors from ball-by-ball coordinates when data source is attached.</p>
      <div class="track-map">
        <svg viewBox="0 0 280 160" role="img" aria-label="Cricket wagon wheel placeholder">
          <circle cx="140" cy="80" r="58" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"></circle>
          <line x1="140" y1="80" x2="212" y2="62" stroke="#35e0a1" stroke-width="3"></line>
          <line x1="140" y1="80" x2="80" y2="48" stroke="#ff7f50" stroke-width="3"></line>
          <line x1="140" y1="80" x2="148" y2="20" stroke="#4ac8ff" stroke-width="3"></line>
        </svg>
      </div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Adapter Endpoint</h3>
      <p class="empty-state">Attach CricketData.org or Cricbuzz API via RapidAPI and normalize events into over-by-over cards.</p>
      <pre style="white-space: pre-wrap; color: #d4ddf1;">fetch("https://api.cricapi.com/v1/currentMatches?apikey=YOUR_KEY&offset=0");</pre>
    </article>
    `
  );
}

function renderNBA() {
  const grid = qs("#dashboardGrid");
  grid.innerHTML = "";

  const cards = [
    { title: "PER Leader", value: "31.4", subtitle: "Season-adjusted" },
    { title: "Conference Spread", value: "4.5 GB", subtitle: "Top 4 race" },
    { title: "Shot Zone Edge", value: "+8.2%", subtitle: "Paint conversion" }
  ];

  const statWrap = document.createElement("section");
  statWrap.className = "card-span-12 stats-row";
  cards.forEach((card) => statWrap.appendChild(createStatCard(card)));
  grid.appendChild(statWrap);

  grid.insertAdjacentHTML(
    "beforeend",
    `
    <article class="glass-card card-span-8 card-entry">
      <h3 class="card-title">Shot Chart Concept</h3>
      <p class="empty-state">Use BallDontLie events to map shot efficiency by court region with the same reusable card component system.</p>
      <div class="track-map">
        <svg viewBox="0 0 280 160" role="img" aria-label="Basketball shot chart placeholder">
          <rect x="30" y="20" width="220" height="120" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"></rect>
          <path d="M140 20 L140 140" stroke="rgba(255,255,255,0.2)" stroke-width="2"></path>
          <circle cx="80" cy="70" r="8" fill="#35e0a1"></circle>
          <circle cx="128" cy="95" r="8" fill="#35e0a1"></circle>
          <circle cx="190" cy="78" r="8" fill="#ff7f50"></circle>
          <circle cx="220" cy="102" r="8" fill="#ff5f66"></circle>
        </svg>
      </div>
    </article>

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Adapter Endpoint</h3>
      <p class="empty-state">BallDontLie is open and clean for standings, players, and game logs.</p>
      <pre style="white-space: pre-wrap; color: #d4ddf1;">fetch("https://api.balldontlie.io/v1/players", {
  headers: { Authorization: "YOUR_KEY" }
});</pre>
    </article>
    `
  );
}

function renderModule() {
  setActiveTab();
  setHeaderMeta();

  if (state.activeModule !== "f1") {
    clearF1Intervals();
  }

  switch (state.activeModule) {
    case "football":
      renderFootball();
      break;
    case "cricket":
      renderCricket();
      break;
    case "nba":
      renderNBA();
      break;
    default:
      renderF1();
      break;
  }
}

function bindGlobalEvents() {
  qsa(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeModule = button.dataset.module;
      localStorage.setItem(STORAGE_KEYS.module, state.activeModule);
      renderModule();
    });
  });

  setupResetButton();
}

function init() {
  bindGlobalEvents();
  renderModule();
}

window.addEventListener("DOMContentLoaded", init);
