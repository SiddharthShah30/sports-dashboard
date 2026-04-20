const STORAGE_KEYS = {
  module: "paddock:module",
  favoriteDriver: "paddock:favoriteDriver"
};

const ERGAST_BASES = ["https://api.jolpi.ca/ergast/f1", "https://ergast.com/api/f1"];

const TEAM_LOGO_ASSETS = {
  Ferrari: "https://cdn.simpleicons.org/ferrari/ED1131",
  Mercedes: "https://cdn.simpleicons.org/mercedes/00A19B",
  McLaren: "https://cdn.simpleicons.org/mclaren/F58020",
  "Red Bull Racing": "https://cdn.simpleicons.org/redbull/1E41FF",
  "Aston Martin": "https://cdn.simpleicons.org/astonmartin/00665E",
  Alpine: "https://cdn.simpleicons.org/alpine/0F70CE",
  Williams: "https://cdn.simpleicons.org/williams/005AFF",
  Audi: "https://cdn.simpleicons.org/audi/111111",
  Cadillac: "https://cdn.simpleicons.org/cadillac/0A2240"
};

const state = {
  activeModule: localStorage.getItem(STORAGE_KEYS.module) || "f1",
  favoriteDriver: localStorage.getItem(STORAGE_KEYS.favoriteDriver) || "",
  f1: {
    drivers: [],
    constructors: [],
    lastRaceResults: [],
    lastQualifying: [],
    driverMediaMap: {},
    teamLogoMap: {},
    selectedDriverId: "",
    nextRace: null,
    map: null,
    countdownTicker: null,
    chart: null
  }
};

const SPORT_META = {
  f1: {
    tag: "FORMULA 1 LIVE CENTER",
    headline: "Trackside timing, standings, and race intelligence in one cockpit"
  },
  football: {
    tag: "FOOTBALL LIVE CENTER",
    headline: "Structured league intelligence with modular match centers"
  },
  cricket: {
    tag: "CRICKET LIVE CENTER",
    headline: "Over-by-over telemetry translated into geometric insight"
  },
  nba: {
    tag: "NBA LIVE CENTER",
    headline: "Shot geography, efficiency ranking, and conference pressure"
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

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initialsFromName(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() || "").join("") || "DR";
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

async function fetchErgast(path) {
  let lastError = null;
  for (const base of ERGAST_BASES) {
    try {
      return await fetchJSON(`${base}${path}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Unable to load Ergast data");
}

async function fetchOpenF1DriverMedia() {
  try {
    const drivers = await fetchJSON("https://api.openf1.org/v1/drivers?session_key=latest");
    const map = {};
    drivers.forEach((driver) => {
      const key = (driver.name_acronym || "").toUpperCase();
      if (!key) {
        return;
      }
      map[key] = {
        headshotUrl: driver.headshot_url || "",
        teamName: driver.team_name || "",
        teamColor: driver.team_colour ? `#${driver.team_colour}` : ""
      };
    });
    return map;
  } catch (error) {
    return {};
  }
}

async function fetchTeamLogoMap(constructors) {
  const entries = await Promise.all(
    constructors.map(async (entry) => {
      const teamName = entry?.Constructor?.name;
      if (TEAM_LOGO_ASSETS[teamName]) {
        return [teamName, TEAM_LOGO_ASSETS[teamName]];
      }

      const teamWiki = entry?.Constructor?.url;
      if (!teamName || !teamWiki) {
        return [teamName, ""];
      }

      try {
        const title = decodeURIComponent(teamWiki.split("/").pop() || "");
        if (!title) {
          return [teamName, ""];
        }
        const summary = await fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
        const thumb = summary?.thumbnail?.source || summary?.originalimage?.source || "";
        return [teamName, thumb];
      } catch (error) {
        return [teamName, ""];
      }
    })
  );

  return Object.fromEntries(entries.filter(([key]) => Boolean(key)));
}

function setActiveTab() {
  qsa(".tab-btn").forEach((button) => {
    const isActive = button.dataset.module === state.activeModule;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderQuickIntelStrip({ countdown = "--", raceName = "No race loaded", raceDate = "--", raceTime = "--", leader = "--", gap = "--" }) {
  const quickCountdown = qs("#quickCountdown");
  const quickRaceName = qs("#quickRaceName");
  const quickRaceDate = qs("#quickRaceDate");
  const quickRaceTime = qs("#quickRaceTime");
  const quickLeader = qs("#quickLeader");
  const quickGap = qs("#quickGap");
  if (!quickCountdown || !quickRaceName || !quickRaceDate || !quickRaceTime || !quickLeader || !quickGap) {
    return;
  }

  quickCountdown.textContent = countdown;
  quickRaceName.textContent = raceName;
  quickRaceDate.textContent = raceDate;
  quickRaceTime.textContent = raceTime;
  quickLeader.textContent = leader;
  quickGap.textContent = gap;
}

function setHeaderMeta() {
  const meta = SPORT_META[state.activeModule];
  qs("#moduleTag").textContent = meta.tag;
  qs("#moduleHeadline").textContent = meta.headline;
  qs("#favoriteLabel").textContent = `Favorite Driver: ${state.favoriteDriver || "None"}`;
  document.body.setAttribute("data-module", state.activeModule);
}

function clearF1Intervals() {
  if (state.f1.countdownTicker) {
    clearInterval(state.f1.countdownTicker);
    state.f1.countdownTicker = null;
  }
  destroyRaceMap();
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
  const secondMs = 1000;

  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);
  const seconds = Math.floor((diff % minuteMs) / secondMs);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getAvatarUrl(headshot, displayName) {
  if (headshot) {
    return headshot;
  }
  const initials = initialsFromName(displayName);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=111111&color=ffffff&rounded=false&bold=true`;
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
  const palette = ["#e63926", "#1459d9", "#f1c40f", "#101010", "#e63926", "#1459d9", "#f1c40f"];
  return palette[index % palette.length];
}

async function fetchF1CoreData() {
  const [driverData, constructorData, nextRaceData, lastResultsData, lastQualifyingData] = await Promise.all([
    fetchErgast("/current/driverStandings.json"),
    fetchErgast("/current/constructorStandings.json"),
    fetchErgast("/current/next.json"),
    fetchErgast("/current/last/results.json"),
    fetchErgast("/current/last/qualifying.json")
  ]);

  const drivers = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  const constructors = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  const nextRace = nextRaceData?.MRData?.RaceTable?.Races?.[0] || null;
  const lastRaceResults = lastResultsData?.MRData?.RaceTable?.Races?.[0]?.Results || [];
  const lastQualifying = lastQualifyingData?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [];

  return { drivers, constructors, nextRace, lastRaceResults, lastQualifying };
}

async function fetchDriverTrajectory(driverId) {
  const data = await fetchErgast(`/current/drivers/${driverId}/results.json?limit=100`);
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
    fetchErgast(`/current/drivers/${driverIdA}/results.json?limit=100`),
    fetchErgast(`/current/drivers/${driverIdB}/results.json?limit=100`)
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
    return `${current.temperature_2m}C | Wind ${current.wind_speed_10m} km/h | Code ${current.weather_code}`;
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
      const media = state.f1.driverMediaMap[(code || "").toUpperCase()] || {};
      const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
      const avatarUrl = getAvatarUrl(media.headshotUrl, driverName);
      const fallbackAvatar = getAvatarUrl("", driverName);

      return `
        <button class="data-item ${isActive ? "active" : ""}" data-driver-id="${id}">
          <div class="driver-item-main">
            <img class="driver-avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(driverName)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(fallbackAvatar)}'" />
            <div class="driver-copy">
              <strong>#${driver.position} ${driverName} (${code})</strong>
              <span>${team} | ${points} pts</span>
            </div>
          </div>
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
      const teamName = entry.Constructor.name;
      const logo = state.f1.teamLogoMap[teamName] || "";

      return `
        <div class="card-entry" style="margin-bottom:0.65rem;">
          <div class="label-row">
            <span>${logo ? `<img class="team-logo" src="${escapeHtml(logo)}" alt="${escapeHtml(teamName)}" loading="lazy" onerror="this.style.display='none'" />` : ""}${teamName}</span>
            <span>${entry.points} pts</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-fill" style="width:${pct}%;background:${color};"></div>
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

function renderStartingGridLayout(qualifyingRows, resultRows) {
  const sourceRows = qualifyingRows?.length ? qualifyingRows : resultRows || [];
  if (!sourceRows.length) {
    return "<p class='empty-state'>Latest grid data unavailable.</p>";
  }

  const byPosition = new Map();
  sourceRows.forEach((row) => {
    const position = toNum(row.position);
    if (position > 0) {
      byPosition.set(position, row);
    }
  });

  const rows = [];
  for (let pos = 1; pos <= 20; pos += 2) {
    const left = byPosition.get(pos);
    const right = byPosition.get(pos + 1);

    const leftName = left ? `${left.Driver.givenName} ${left.Driver.familyName}` : "TBD";
    const rightName = right ? `${right.Driver.givenName} ${right.Driver.familyName}` : "TBD";
    const leftCode = left?.Driver?.code || left?.Driver?.familyName?.slice(0, 3)?.toUpperCase() || "---";
    const rightCode = right?.Driver?.code || right?.Driver?.familyName?.slice(0, 3)?.toUpperCase() || "---";

    rows.push(`
      <div class="grid-row">
        <button class="grid-slot" data-open-map="true" aria-label="Open circuit map from grid row ${pos}">
          <span class="grid-pos">P${pos}</span>
          <span class="grid-code">${escapeHtml(leftCode)}</span>
          <span class="grid-name">${escapeHtml(leftName)}</span>
        </button>
        <button class="grid-slot" data-open-map="true" aria-label="Open circuit map from grid row ${pos + 1}">
          <span class="grid-pos">P${pos + 1}</span>
          <span class="grid-code">${escapeHtml(rightCode)}</span>
          <span class="grid-name">${escapeHtml(rightName)}</span>
        </button>
      </div>
    `);
  }

  return `<div class="starting-grid">${rows.join("")}</div>`;
}

function destroyRaceMap() {
  if (state.f1.map) {
    state.f1.map.remove();
    state.f1.map = null;
  }
}

function renderCircuitRealMap(lat, lon, circuitName, hostSelector = "#raceMapModal") {
  const mapHost = qs(hostSelector);
  if (!mapHost) {
    return;
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum) || typeof L === "undefined") {
    mapHost.innerHTML = renderTrackMap("silverstone");
    return;
  }

  mapHost.innerHTML = "<div class='track-map real-map card-entry'><div id='raceMap'></div></div>";
  destroyRaceMap();

  state.f1.map = L.map("raceMap", {
    zoomControl: true,
    attributionControl: true
  }).setView([latNum, lonNum], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(state.f1.map);

  L.marker([latNum, lonNum]).addTo(state.f1.map).bindPopup(escapeHtml(circuitName || "Circuit")).openPopup();
}

function setupGridMapLauncher(lat, lon, circuitName) {
  const gridContainer = qs("#latestGridLayout");
  const modal = qs("#circuitMapModal");
  const closeBtn = qs("#closeCircuitMapModal");
  const openHint = qs("#gridLaunchHint");

  if (!gridContainer || !modal || !closeBtn) {
    return;
  }

  const canOpenMap = Number.isFinite(Number(lat)) && Number.isFinite(Number(lon));
  if (openHint) {
    openHint.textContent = canOpenMap
      ? "Latest starting grid. Click any slot to open circuit location map."
      : "Grid is available. Map location is unavailable for this race.";
  }

  const openModal = () => {
    if (!canOpenMap) {
      return;
    }
    modal.classList.remove("hidden");
    renderCircuitRealMap(lat, lon, circuitName, "#raceMapModal");
  };

  gridContainer.querySelectorAll("[data-open-map='true']").forEach((slot) => {
    slot.addEventListener("click", openModal);
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    destroyRaceMap();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
      destroyRaceMap();
    }
  });
}

function formatRaceDateTime(date, time) {
  if (!date) {
    return { weekday: "TBD", dateLabel: "TBD", timeLabel: "TBD" };
  }

  const iso = `${date}T${time || "00:00:00Z"}`;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) {
    return { weekday: "TBD", dateLabel: date, timeLabel: time || "TBD" };
  }

  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(dt),
    dateLabel: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC"
    }).format(dt),
    timeLabel: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC"
    }).format(dt)
  };
}

function renderMiniStandingsRows(rows, type) {
  if (!rows.length) {
    return "<p class='empty-state'>No standings data available.</p>";
  }

  const topRows = rows.slice(0, 10);
  if (type === "qualifying") {
    return `
      <div class="mini-table">
        ${topRows
          .map(
            (row) => `
          <div class="mini-row">
            <span>P${row.position}</span>
            <span>${row.Driver.givenName} ${row.Driver.familyName}</span>
            <span>${row.Q3 || row.Q2 || row.Q1 || "-"}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  return `
    <div class="mini-table">
      ${topRows
        .map(
          (row) => `
        <div class="mini-row">
          <span>P${row.position}</span>
          <span>${row.Driver.givenName} ${row.Driver.familyName}</span>
          <span>${row.points} pts</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function setupCountdown(raceDateIso) {
  const countdownEl = qs("#countdownValue");
  if (!countdownEl || !raceDateIso) {
    return;
  }

  const update = () => {
    const countdownText = formatCountdown(raceDateIso);
    countdownEl.textContent = countdownText;
    const quickCountdown = qs("#quickCountdown");
    if (quickCountdown) {
      quickCountdown.textContent = countdownText;
    }
  };

  update();
  state.f1.countdownTicker = setInterval(update, 1000);
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
          borderColor: "#1459d9",
          backgroundColor: "rgba(20, 89, 217, 0.17)",
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
            color: "#101010"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#303030" },
          grid: { color: "rgba(0,0,0,0.12)" }
        },
        y: {
          ticks: { color: "#303030" },
          grid: { color: "rgba(0,0,0,0.12)" }
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
      <p><strong>Day:</strong> <span id="raceDay">Loading...</span></p>
      <p><strong>Date:</strong> <span id="raceDate">Loading...</span></p>
      <p><strong>Time (UTC):</strong> <span id="raceTime">Loading...</span></p>
      <p><strong>Countdown:</strong> <span id="countdownValue">Loading...</span></p>
      <p><strong>Weather:</strong> <span id="weatherValue">Loading...</span></p>
      <p class="inline-meta" id="gridLaunchHint">Loading latest starting grid...</p>
      <div id="latestGridLayout"></div>
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

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Constructor Battle <span class="inline-meta">Points gap visualizer</span></h3>
      <div id="constructorBars"></div>
    </article>

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Last Race Result Standings</h3>
      <div id="lastRaceStandings"></div>
    </article>

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Last Qualifying Standings</h3>
      <div id="lastQualifyingStandings"></div>
    </article>

    <article class="glass-card card-span-12 card-entry">
      <h3 class="card-title">Head-to-Head Tool</h3>
      <div class="split" style="margin-bottom:0.75rem;">
        <select id="driverA" class="select-input"></select>
        <select id="driverB" class="select-input"></select>
      </div>
      <button id="compareBtn" class="small-btn">Compare Qualifying Pace and Race Finishes</button>
      <div id="comparisonResult" style="margin-top:0.75rem;"></div>
    </article>

    <div id="circuitMapModal" class="map-modal hidden" role="dialog" aria-modal="true" aria-label="Circuit location map">
      <div class="map-modal-card glass-card">
        <div class="map-modal-head">
          <h3 class="card-title" style="margin:0;">Circuit Location Map</h3>
          <button id="closeCircuitMapModal" class="small-btn">Close</button>
        </div>
        <div id="raceMapModal"></div>
      </div>
    </div>
  `;
}

async function renderF1() {
  renderF1Skeleton();
  clearF1Intervals();

  renderQuickIntelStrip({
    countdown: "Loading...",
    raceName: "Fetching next Grand Prix",
    raceDate: "Loading...",
    raceTime: "Loading...",
    leader: "Loading...",
    gap: "Calculating"
  });

  try {
    const { drivers, constructors, nextRace, lastRaceResults, lastQualifying } = await fetchF1CoreData();
    state.f1.drivers = drivers;
    state.f1.constructors = constructors;
    state.f1.nextRace = nextRace;
    state.f1.lastRaceResults = lastRaceResults;
    state.f1.lastQualifying = lastQualifying;

    const [driverMediaMap, teamLogoMap] = await Promise.all([
      fetchOpenF1DriverMedia(),
      fetchTeamLogoMap(constructors)
    ]);
    state.f1.driverMediaMap = driverMediaMap;
    state.f1.teamLogoMap = teamLogoMap;

    if (!state.f1.selectedDriverId) {
      state.f1.selectedDriverId = state.favoriteDriver || drivers[0]?.Driver?.driverId || "";
    }

    const raceDateIso = nextRace ? `${nextRace.date}T${nextRace.time || "00:00:00Z"}` : null;
    const raceDateParts = formatRaceDateTime(nextRace?.date, nextRace?.time);
    qs("#raceMeta").textContent = nextRace
      ? `${nextRace.raceName} | ${nextRace.Circuit.Location.locality}`
      : "No race scheduled";
    qs("#raceDay").textContent = raceDateParts.weekday;
    qs("#raceDate").textContent = raceDateParts.dateLabel;
    qs("#raceTime").textContent = raceDateParts.timeLabel;

    const leader = drivers[0];
    const second = drivers[1];
    const leaderName = leader ? `${leader.Driver.givenName} ${leader.Driver.familyName}` : "No leader";
    const pointsGap = leader && second ? `${toNum(leader.points) - toNum(second.points)} pts over P2` : "Gap unavailable";
    renderQuickIntelStrip({
      countdown: raceDateIso ? formatCountdown(raceDateIso) : "TBD",
      raceName: nextRace?.raceName || "No upcoming race",
      raceDate: `${raceDateParts.weekday}, ${raceDateParts.dateLabel}`,
      raceTime: `${raceDateParts.timeLabel} UTC`,
      leader: leaderName,
      gap: pointsGap
    });

    setupCountdown(raceDateIso);

    const lat = nextRace?.Circuit?.Location?.lat;
    const lon = nextRace?.Circuit?.Location?.long;
    qs("#weatherValue").textContent = await fetchTrackWeather(lat, lon);

    const circuitName = nextRace?.Circuit?.circuitName || "Grand Prix Circuit";

    qs("#latestGridLayout").innerHTML = renderStartingGridLayout(lastQualifying, lastRaceResults);
    setupGridMapLauncher(lat, lon, circuitName);

    qs("#driverStandings").innerHTML = renderStandingsList(drivers);
    setupDriverListEvents();

    qs("#constructorBars").innerHTML = renderConstructorBars(constructors);
    qs("#lastRaceStandings").innerHTML = renderMiniStandingsRows(lastRaceResults, "race");
    qs("#lastQualifyingStandings").innerHTML = renderMiniStandingsRows(lastQualifying, "qualifying");

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
    const selectedCode = (selectedDriver?.Driver?.code || selectedDriver?.Driver?.familyName?.slice(0, 3) || "").toUpperCase();
    const selectedMedia = state.f1.driverMediaMap[selectedCode] || {};
    const selectedTeamName = selectedDriver?.Constructors?.[0]?.name || "";
    const selectedTeamLogo = state.f1.teamLogoMap[selectedTeamName] || "";
    const selectedDriverName = `${selectedDriver?.Driver?.givenName || ""} ${selectedDriver?.Driver?.familyName || ""}`.trim();
    const selectedAvatar = getAvatarUrl(selectedMedia.headshotUrl, selectedDriverName);
    const selectedAvatarFallback = getAvatarUrl("", selectedDriverName);

    profileNode.insertAdjacentHTML(
      "beforebegin",
      `
      <div class="profile-hero" id="profileHero">
        <img src="${escapeHtml(selectedAvatar)}" alt="${escapeHtml(selectedDriverName)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(selectedAvatarFallback)}'" />
        <div>
          <p class="kicker">Selected Driver</p>
          <strong>${escapeHtml(selectedDriverName || "Driver")}</strong>
          <p>${selectedTeamLogo ? `<img class="team-logo" src="${escapeHtml(selectedTeamLogo)}" alt="${escapeHtml(selectedTeamName)}" loading="lazy" onerror="this.style.display='none'" />` : ""}${escapeHtml(selectedTeamName)}</p>
        </div>
      </div>
      `
    );

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
    renderQuickIntelStrip({
      countdown: "Unavailable",
      raceName: "Data feed issue",
      raceDate: "Unavailable",
      raceTime: "Unavailable",
      leader: "Unavailable",
      gap: "Unavailable"
    });
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
      <pre class="code-callout">fetch("https://api.football-data.org/v4/competitions/PL/standings", {
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
          <circle cx="140" cy="80" r="58" fill="none" stroke="rgba(0,0,0,0.32)" stroke-width="2"></circle>
          <line x1="140" y1="80" x2="212" y2="62" stroke="#1459d9" stroke-width="3"></line>
          <line x1="140" y1="80" x2="80" y2="48" stroke="#e63926" stroke-width="3"></line>
          <line x1="140" y1="80" x2="148" y2="20" stroke="#f1c40f" stroke-width="3"></line>
        </svg>
      </div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Adapter Endpoint</h3>
      <p class="empty-state">Attach CricketData.org or Cricbuzz API via RapidAPI and normalize events into over-by-over cards.</p>
      <pre class="code-callout">fetch("https://api.cricapi.com/v1/currentMatches?apikey=YOUR_KEY&offset=0");</pre>
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
          <rect x="30" y="20" width="220" height="120" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2"></rect>
          <path d="M140 20 L140 140" stroke="rgba(0,0,0,0.3)" stroke-width="2"></path>
          <circle cx="80" cy="70" r="8" fill="#1459d9"></circle>
          <circle cx="128" cy="95" r="8" fill="#1459d9"></circle>
          <circle cx="190" cy="78" r="8" fill="#f1c40f"></circle>
          <circle cx="220" cy="102" r="8" fill="#e63926"></circle>
        </svg>
      </div>
    </article>

    <article class="glass-card card-span-4 card-entry">
      <h3 class="card-title">Adapter Endpoint</h3>
      <p class="empty-state">BallDontLie is open and clean for standings, players, and game logs.</p>
      <pre class="code-callout">fetch("https://api.balldontlie.io/v1/players", {
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
    renderQuickIntelStrip({
      countdown: "Switch to F1",
      raceName: "Quick cards are tuned for Formula 1",
      raceDate: "--",
      raceTime: "--",
      leader: "--",
      gap: "--"
    });
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
