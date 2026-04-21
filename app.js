const STORAGE_KEYS = {
  module: "paddock:module",
  favoriteDriver: "paddock:favoriteDriver",
  favoriteTeam: "paddock:favoriteTeam",
  timeMode: "paddock:timeMode",
  fxEnabled: "paddock:fxEnabled"
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
  favoriteTeam: localStorage.getItem(STORAGE_KEYS.favoriteTeam) || "",
  timeMode: localStorage.getItem(STORAGE_KEYS.timeMode) || "local",
  fxEnabled: localStorage.getItem(STORAGE_KEYS.fxEnabled) !== "off",
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
    chart: null,
    infoView: "teams",
    searchQuery: "",
    historyData: [],
    historyYear: 0,
    seasonCalendar: [],
    seasonCompletedRound: 0,
    expandedRound: 0,
    lastNewsItems: []
  }
};

const TEAM_ACCENTS = {
  Ferrari: "#ed1131",
  Mercedes: "#00d2be",
  McLaren: "#ff8000",
  "Red Bull Racing": "#3671c6",
  "Aston Martin": "#229971",
  Alpine: "#00a1e8",
  Williams: "#1868db",
  Audi: "#f50537",
  Cadillac: "#909090",
  "Racing Bulls": "#6c98ff",
  "Haas F1 Team": "#9c9fa2",
  Sauber: "#52e252"
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

const CIRCUIT_TIMEZONES = {
  albert_park: "Australia/Melbourne",
  bahrain: "Asia/Bahrain",
  jeddah: "Asia/Riyadh",
  imola: "Europe/Rome",
  miami: "America/New_York",
  monaco: "Europe/Monaco",
  catalunya: "Europe/Madrid",
  gilles_villeneuve: "America/Toronto",
  red_bull_ring: "Europe/Vienna",
  silverstone: "Europe/London",
  hungaroring: "Europe/Budapest",
  spa: "Europe/Brussels",
  zandvoort: "Europe/Amsterdam",
  monza: "Europe/Rome",
  baku: "Asia/Baku",
  marina_bay: "Asia/Singapore",
  suzuka: "Asia/Tokyo",
  lusail: "Asia/Qatar",
  americas: "America/Chicago",
  rodriguez: "America/Mexico_City",
  interlagos: "America/Sao_Paulo",
  vegas: "America/Los_Angeles",
  losail: "Asia/Qatar",
  yas_marina: "Asia/Dubai",
  shanghai: "Asia/Shanghai"
};

const COUNTRY_TIMEZONES = {
  Australia: "Australia/Melbourne",
  Bahrain: "Asia/Bahrain",
  Saudi_Arabia: "Asia/Riyadh",
  Italy: "Europe/Rome",
  "United States": "America/New_York",
  Monaco: "Europe/Monaco",
  Spain: "Europe/Madrid",
  Canada: "America/Toronto",
  Austria: "Europe/Vienna",
  "United Kingdom": "Europe/London",
  Hungary: "Europe/Budapest",
  Belgium: "Europe/Brussels",
  Netherlands: "Europe/Amsterdam",
  Azerbaijan: "Asia/Baku",
  Singapore: "Asia/Singapore",
  Japan: "Asia/Tokyo",
  Qatar: "Asia/Qatar",
  Mexico: "America/Mexico_City",
  Brazil: "America/Sao_Paulo",
  UAE: "Asia/Dubai",
  China: "Asia/Shanghai"
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

function triggerMicroFeedback() {
  if (!state.fxEnabled) {
    return;
  }
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(12);
  }
}

function getTrackTimeZone(race) {
  const circuitId = race?.Circuit?.circuitId || "";
  const byCircuit = CIRCUIT_TIMEZONES[circuitId];
  if (byCircuit) {
    return byCircuit;
  }

  const countryRaw = race?.Circuit?.Location?.country || "";
  const countryKey = countryRaw.replaceAll(" ", "_");
  return COUNTRY_TIMEZONES[countryKey] || "UTC";
}

function formatEventTimeByMode(date, time, mode = state.timeMode, trackTimeZone = "UTC") {
  if (!date) {
    return { dateLabel: "TBD", timeLabel: "TBD", zoneLabel: "UTC" };
  }

  const iso = `${date}T${time || "00:00:00Z"}`;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) {
    return { dateLabel: date, timeLabel: time || "TBD", zoneLabel: "UTC" };
  }

  const useTrackZone = mode === "track";
  const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
  const zoneLabel = useTrackZone ? `${trackTimeZone} (Track)` : userZone;
  const optionsDate = useTrackZone
    ? { year: "numeric", month: "short", day: "2-digit", timeZone: trackTimeZone }
    : { year: "numeric", month: "short", day: "2-digit" };
  const optionsTime = useTrackZone
    ? { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: trackTimeZone }
    : { hour: "2-digit", minute: "2-digit", hour12: false };

  return {
    dateLabel: new Intl.DateTimeFormat("en-US", optionsDate).format(dt),
    timeLabel: new Intl.DateTimeFormat("en-US", optionsTime).format(dt),
    zoneLabel
  };
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

function renderQuickIntelStrip({
  countdown = "--",
  raceName = "No race loaded",
  raceDate = "--",
  raceTime = "--",
  leader = "--",
  gap = "--",
  seasonCompleted = 0,
  seasonTotal = 0
}) {
  const quickCountdown = qs("#quickCountdown");
  const quickRaceName = qs("#quickRaceName");
  const quickRaceDate = qs("#quickRaceDate");
  const quickRaceTime = qs("#quickRaceTime");
  const quickLeader = qs("#quickLeader");
  const quickGap = qs("#quickGap");
  const seasonBar = qs("#quickSeasonProgress");
  if (!quickCountdown || !quickRaceName || !quickRaceDate || !quickRaceTime || !quickLeader || !quickGap || !seasonBar) {
    return;
  }

  quickCountdown.textContent = countdown;
  quickRaceName.textContent = raceName;
  quickRaceDate.textContent = raceDate;
  quickRaceTime.textContent = raceTime;
  quickLeader.textContent = leader;
  quickGap.textContent = gap;
  const pct = seasonTotal > 0 ? Math.min(100, Math.max(0, (seasonCompleted / seasonTotal) * 100)) : 0;
  seasonBar.style.width = `${pct}%`;
}

function setHeaderMeta() {
  const meta = SPORT_META[state.activeModule];
  qs("#moduleTag").textContent = meta.tag;
  qs("#moduleHeadline").textContent = meta.headline;
  const favoriteDriverEntry = state.f1.drivers.find((entry) => entry.Driver.driverId === state.favoriteDriver);
  const favoriteDriverLabel = favoriteDriverEntry
    ? `${favoriteDriverEntry.Driver.givenName} ${favoriteDriverEntry.Driver.familyName}`
    : (state.favoriteDriver ? state.favoriteDriver.toUpperCase() : "");
  const favoriteBits = [];
  if (state.favoriteTeam) {
    favoriteBits.push(`Team: ${state.favoriteTeam}`);
  }
  if (favoriteDriverLabel) {
    favoriteBits.push(`Driver: ${favoriteDriverLabel}`);
  }
  qs("#favoriteLabel").textContent = favoriteBits.length ? favoriteBits.join(" | ") : "No favorites selected";
  applyTeamAccentTheme(state.favoriteTeam);
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

function getCountdownParts(targetIso) {
  const now = Date.now();
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);

  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;

  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);
  const seconds = Math.floor((diff % minuteMs) / 1000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  };
}

function getRacePhase(nextRace) {
  const start = new Date(`${nextRace?.date || ""}T${nextRace?.time || "00:00:00Z"}`).getTime();
  const end = start + 1000 * 60 * 60 * 2;
  const now = Date.now();
  if (!Number.isFinite(start)) {
    return { label: "SCHEDULE", detail: "Waiting for official race time" };
  }
  if (now < start) {
    return { label: "PRE-RACE", detail: "Countdown active" };
  }
  if (now >= start && now <= end) {
    const elapsedMin = Math.max(0, Math.floor((now - start) / 60000));
    return { label: "LIVE", detail: `Race in progress • T+${elapsedMin} min` };
  }
  return { label: "FINISHED", detail: "Awaiting post-race updates" };
}

function applyTeamAccentTheme(teamName) {
  const accent = TEAM_ACCENTS[teamName] || "#E10600";
  const normalized = accent.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  document.documentElement.style.setProperty("--accent", accent);
  if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
    document.documentElement.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
  }
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
  const [driverData, constructorData, nextRaceData, lastResultsData, lastQualifyingData, seasonData] = await Promise.all([
    fetchErgast("/current/driverStandings.json"),
    fetchErgast("/current/constructorStandings.json"),
    fetchErgast("/current/next.json"),
    fetchErgast("/current/last/results.json"),
    fetchErgast("/current/last/qualifying.json"),
    fetchErgast("/current.json?limit=100")
  ]);

  const drivers = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  const constructors = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  const nextRace = nextRaceData?.MRData?.RaceTable?.Races?.[0] || null;
  const seasonCalendar = seasonData?.MRData?.RaceTable?.Races || [];
  const lastRaceResults = lastResultsData?.MRData?.RaceTable?.Races?.[0]?.Results || [];
  const lastQualifying = lastQualifyingData?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [];
  const completedRound = toNum(lastResultsData?.MRData?.RaceTable?.Races?.[0]?.round);

  return {
    drivers,
    constructors,
    nextRace,
    seasonCalendar,
    completedRound,
    lastRaceResults,
    lastQualifying
  };
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

    const leftMedia = state.f1.driverMediaMap[(leftCode || "").toUpperCase()] || {};
    const rightMedia = state.f1.driverMediaMap[(rightCode || "").toUpperCase()] || {};
    const leftColor = leftMedia.teamColor || "#6a748b";
    const rightColor = rightMedia.teamColor || "#6a748b";

    const laneIndex = (pos - 1) / 2 + 1;

    rows.push(`
      <div class="grid-row ${laneIndex % 2 === 0 ? "lane-even" : "lane-odd"}">
        <button class="grid-slot lane-left" style="--team-color:${escapeHtml(leftColor)}" data-open-map="true" aria-label="Open circuit map from grid row ${pos}">
          <span class="grid-pos">P${pos}</span>
          <span class="grid-code">${escapeHtml(leftCode)}</span>
          <span class="grid-name">${escapeHtml(leftName)}</span>
        </button>
        <button class="grid-slot lane-right" style="--team-color:${escapeHtml(rightColor)}" data-open-map="true" aria-label="Open circuit map from grid row ${pos + 1}">
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

function renderBreakingNews(newsItems) {
  const ticker = qs("#breakingTicker");
  const rail = qs("#headlineRail");
  if (!ticker || !rail) {
    return;
  }

  if (!newsItems.length) {
    ticker.textContent = "No live headlines available right now.";
    rail.innerHTML = "<p class='empty-state'>Headlines unavailable.</p>";
    return;
  }

  ticker.textContent = newsItems.map((item) => item.title).join("  |  ");
  rail.innerHTML = newsItems
    .slice(0, 3)
    .map(
      (item) => `
      <a class="headline-card" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener">
        <p class="kicker">${escapeHtml(item.source)}</p>
        <strong>${escapeHtml(item.title)}</strong>
      </a>
    `
    )
    .join("");
}

function renderSeasonCalendar(races) {
  const host = qs("#seasonCalendarStrip");
  const detail = qs("#seasonCalendarDetail");
  if (!host || !detail) {
    return;
  }

  if (!races.length) {
    host.innerHTML = "<p class='empty-state'>Season calendar unavailable.</p>";
    detail.innerHTML = "";
    return;
  }

  if (!state.f1.expandedRound) {
    state.f1.expandedRound = state.f1.seasonCompletedRound + 1;
  }

  host.innerHTML = races
    .map((race) => {
      const round = toNum(race.round);
      const isCompleted = round <= state.f1.seasonCompletedRound;
      const isActive = round === state.f1.expandedRound;
      const formatted = formatEventTimeByMode(race.date, race.time, state.timeMode, getTrackTimeZone(race));
      return `
        <button class="season-race-card ${isCompleted ? "completed" : "upcoming"} ${isActive ? "active" : ""}" data-race-round="${round}" type="button">
          <span class="kicker">Round ${round}</span>
          <strong>${escapeHtml(race.raceName)}</strong>
          <span>${escapeHtml(race.Circuit?.Location?.locality || "Unknown")}</span>
          <span>${escapeHtml(formatted.dateLabel)}</span>
        </button>
      `;
    })
    .join("");

  const selected = races.find((race) => toNum(race.round) === state.f1.expandedRound) || races[0];
  const selectedTime = formatEventTimeByMode(selected?.date, selected?.time, state.timeMode, getTrackTimeZone(selected));
  detail.innerHTML = `
    <div class="season-weekend">
      <strong>${escapeHtml(selected?.raceName || "Selected Race")}</strong>
      <p>${escapeHtml(selected?.Circuit?.circuitName || "Circuit TBD")} • ${escapeHtml(selected?.Circuit?.Location?.country || "")}</p>
      <p>FP1/FP2: ${escapeHtml(selectedTime.dateLabel)} ${escapeHtml(selectedTime.timeLabel)} ${escapeHtml(selectedTime.zoneLabel)}</p>
      <p>Qualifying: ${escapeHtml(selectedTime.dateLabel)} ${escapeHtml(selectedTime.timeLabel)} ${escapeHtml(selectedTime.zoneLabel)}</p>
      <p>Race: ${escapeHtml(selectedTime.dateLabel)} ${escapeHtml(selectedTime.timeLabel)} ${escapeHtml(selectedTime.zoneLabel)}</p>
    </div>
  `;
}

function setupSeasonCalendarEvents(races) {
  qsa("[data-race-round]").forEach((button) => {
    button.onclick = () => {
      state.f1.expandedRound = toNum(button.dataset.raceRound);
      triggerMicroFeedback();
      renderSeasonCalendar(races);
    };
  });
}

function renderFooterGrid(drivers, constructors, selectedDriver, nextRace) {
  const host = qs("#stickyDataGrid");
  if (!host) {
    return;
  }

  const topDrivers = drivers.slice(0, 5);
  const topTeams = constructors.slice(0, 5);
  const trackTz = getTrackTimeZone(nextRace);

  host.innerHTML = `
    <section class="footer-grid-col">
      <div class="footer-grid-head">
        <h4>Drivers Standing</h4>
        <button id="viewAllDriversBtn" class="small-btn" type="button">View All</button>
      </div>
      ${topDrivers
        .map(
          (row) => `<div class="footer-row"><span>P${row.position} ${escapeHtml(row.Driver.familyName)}</span><strong>${escapeHtml(row.points)} pts</strong></div>`
        )
        .join("")}
    </section>
    <section class="footer-grid-col">
      <div class="footer-grid-head"><h4>Constructors</h4></div>
      ${topTeams
        .map((row) => {
          const teamName = row.Constructor.name;
          const logo = state.f1.teamLogoMap[teamName] || "";
          return `<div class="footer-row">${logo ? `<img class="team-logo" src="${escapeHtml(logo)}" alt="${escapeHtml(teamName)}" loading="lazy" onerror="this.style.display='none'" />` : ""}<span>${escapeHtml(teamName)}</span><strong>${escapeHtml(row.points)} pts</strong></div>`;
        })
        .join("")}
    </section>
    <section class="footer-grid-col">
      <div class="footer-grid-head"><h4>My Paddock</h4></div>
      <div class="footer-row"><span>Favorite Team</span><strong>${escapeHtml(state.favoriteTeam || "Not set")}</strong></div>
      <div class="footer-row"><span>Favorite Driver</span><strong>${escapeHtml(selectedDriver ? `${selectedDriver.Driver.givenName} ${selectedDriver.Driver.familyName}` : "Not set")}</strong></div>
      <div class="footer-row"><span>Time Mode</span><strong>${state.timeMode === "track" ? `Track Time (${escapeHtml(trackTz)})` : "Your Time"}</strong></div>
      <p class="inline-meta">Quick-access grid for burst sessions.</p>
    </section>
  `;

  const viewAllBtn = qs("#viewAllDriversBtn");
  if (viewAllBtn) {
    viewAllBtn.onclick = () => {
      const list = qs("#driverStandings");
      if (list) {
        list.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      triggerMicroFeedback();
    };
  }
}

function setupTimeModeToggle() {
  const wrap = qs("#timeModeToggle");
  if (!wrap) {
    return;
  }

  qsa("#timeModeToggle [data-time-mode]").forEach((button) => {
    const active = button.dataset.timeMode === state.timeMode;
    button.classList.toggle("active", active);
    button.onclick = () => {
      state.timeMode = button.dataset.timeMode || "local";
      localStorage.setItem(STORAGE_KEYS.timeMode, state.timeMode);
      triggerMicroFeedback();
      renderModule();
    };
  });

  const fxBtn = qs("#fxToggleBtn");
  if (fxBtn) {
    fxBtn.textContent = state.fxEnabled ? "FX ON" : "FX OFF";
    fxBtn.onclick = () => {
      state.fxEnabled = !state.fxEnabled;
      localStorage.setItem(STORAGE_KEYS.fxEnabled, state.fxEnabled ? "on" : "off");
      fxBtn.textContent = state.fxEnabled ? "FX ON" : "FX OFF";
      triggerMicroFeedback();
    };
  }
}

function setupUpcomingRaceActions(nextRace) {
  const reminderBtn = qs("#setReminderBtn");
  const calendarBtn = qs("#addCalendarBtn");
  if (!reminderBtn || !calendarBtn || !nextRace?.date) {
    return;
  }

  const startIso = `${nextRace.date}T${nextRace.time || "00:00:00Z"}`;
  const endIso = new Date(new Date(startIso).getTime() + 2 * 60 * 60 * 1000).toISOString();

  reminderBtn.onclick = async () => {
    triggerMicroFeedback();
    if (typeof Notification !== "undefined") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        new Notification("Paddock Reminder", {
          body: `${nextRace.raceName} starts soon (${state.timeMode === "track" ? "Track Time" : "Your Time"}).`
        });
        return;
      }
    }
    alert("Reminder created in-session. Use Add to Calendar for persistent alerts.");
  };

  calendarBtn.onclick = () => {
    triggerMicroFeedback();
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Paddock Dashboard//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@paddock-dashboard`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${new Date(startIso).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTEND:${endIso.replace(/[-:]/g, "").split(".")[0]}Z`,
      `SUMMARY:${nextRace.raceName}`,
      `DESCRIPTION:Formula 1 race reminder from The Paddock Dashboard`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${(nextRace.raceName || "f1-race").replace(/\s+/g, "-").toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
}

function setupCountdown(raceDateIso) {
  const countdownEl = qs("#countdownValue");
  if (!countdownEl || !raceDateIso) {
    return;
  }

  const raceStart = new Date(raceDateIso).getTime();
  const raceEnd = raceStart + 1000 * 60 * 60 * 2;

  const update = () => {
    const countdownText = formatCountdown(raceDateIso);
    const parts = getCountdownParts(raceDateIso);
    countdownEl.textContent = countdownText;
    const quickCountdown = qs("#quickCountdown");
    if (quickCountdown) {
      quickCountdown.textContent = countdownText;
    }
    const upcomingCountdown = qs("#upcomingCountdownXL");
    if (upcomingCountdown) {
      upcomingCountdown.textContent = countdownText;
    }
    const dayCell = qs("#timerDays");
    const hourCell = qs("#timerHours");
    const minuteCell = qs("#timerMinutes");
    const secondCell = qs("#timerSeconds");
    if (dayCell) {
      dayCell.textContent = parts.days;
    }
    if (hourCell) {
      hourCell.textContent = parts.hours;
    }
    if (minuteCell) {
      minuteCell.textContent = parts.minutes;
    }
    if (secondCell) {
      secondCell.textContent = parts.seconds;
    }

    const pulse = qs("#livePulse");
    if (pulse) {
      const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);
      pulse.textContent = `Auto-refresh pulse • ${stamp} UTC`;
    }

    const badge = qs("#raceStateBadge");
    const detail = qs("#raceStateDetail");
    const now = Date.now();
    if (badge && detail && Number.isFinite(raceStart)) {
      if (now < raceStart) {
        badge.textContent = "PRE-RACE";
        badge.className = "race-state-badge pre-race";
        detail.textContent = "Countdown active";
      } else if (now >= raceStart && now <= raceEnd) {
        const elapsedMin = Math.max(0, Math.floor((now - raceStart) / 60000));
        badge.textContent = "LIVE";
        badge.className = "race-state-badge live";
        detail.textContent = `Race in progress • T+${elapsedMin} min`;
      } else {
        badge.textContent = "FINISHED";
        badge.className = "race-state-badge finished";
        detail.textContent = "Awaiting post-race updates";
      }
    }
  };

  update();
  state.f1.countdownTicker = setInterval(update, 1000);
}

function setupDriverListEvents() {
  qsa("[data-driver-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      triggerMicroFeedback();
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
    triggerMicroFeedback();
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

function setupPreferenceControls(drivers, constructors) {
  const teamSelect = qs("#favoriteTeamSelect");
  const driverSelect = qs("#favoriteDriverSelect");
  if (!teamSelect || !driverSelect) {
    return;
  }

  const teamOptions = constructors
    .map((entry) => `<option value="${escapeHtml(entry.Constructor.name)}">${escapeHtml(entry.Constructor.name)}</option>`)
    .join("");
  teamSelect.innerHTML = `<option value="">Select team</option>${teamOptions}`;
  teamSelect.value = state.favoriteTeam || "";

  const driverOptions = drivers
    .map((entry) => {
      const id = entry.Driver.driverId;
      const name = `${entry.Driver.givenName} ${entry.Driver.familyName}`;
      return `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`;
    })
    .join("");
  driverSelect.innerHTML = `<option value="">Select driver</option>${driverOptions}`;
  driverSelect.value = state.favoriteDriver || "";

  teamSelect.onchange = () => {
    triggerMicroFeedback();
    state.favoriteTeam = teamSelect.value;
    localStorage.setItem(STORAGE_KEYS.favoriteTeam, state.favoriteTeam);
    setHeaderMeta();
  };

  driverSelect.onchange = async () => {
    triggerMicroFeedback();
    state.favoriteDriver = driverSelect.value;
    state.f1.selectedDriverId = driverSelect.value;
    localStorage.setItem(STORAGE_KEYS.favoriteDriver, state.favoriteDriver);
    setHeaderMeta();
    if (state.activeModule === "f1") {
      await renderF1();
    }
  };
}

async function fetchSeasonSummary(roundsCompleted) {
  const currentSchedule = await fetchErgast("/current.json?limit=100");
  const races = currentSchedule?.MRData?.RaceTable?.Races || [];
  const totalRounds = races.length;
  const completed = roundsCompleted;
  return {
    totalRounds,
    completed,
    remaining: Math.max(0, totalRounds - completed)
  };
}

async function fetchKnowledgeSummary(topic) {
  const safeTopic = encodeURIComponent(topic || "Formula One");
  const summary = await fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${safeTopic}`);
  return {
    title: summary?.title || topic,
    extract: summary?.extract || "No summary available for this query.",
    url: summary?.content_urls?.desktop?.page || ""
  };
}

async function fetchLatestNews() {
  try {
    const payload = await fetchJSON("https://www.reddit.com/r/formula1/new.json?limit=6");
    const posts = payload?.data?.children?.map((entry) => entry?.data).filter(Boolean) || [];
    return posts.slice(0, 6).map((post) => ({
      title: post.title,
      url: `https://www.reddit.com${post.permalink}`,
      source: "r/formula1"
    }));
  } catch (error) {
    return [];
  }
}

async function fetchPreviousYearsChampions(startYear, count = 8) {
  const years = [];
  for (let year = startYear - 1; year >= Math.max(1950, startYear - count); year -= 1) {
    years.push(year);
  }

  const champions = await Promise.all(
    years.map(async (year) => {
      try {
        const data = await fetchErgast(`/${year}/driverStandings.json`);
        const top = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];
        if (!top) {
          return null;
        }
        return {
          year,
          champion: `${top.Driver.givenName} ${top.Driver.familyName}`,
          team: top.Constructors?.[0]?.name || "Unknown",
          points: top.points || "0",
          wins: top.wins || "0"
        };
      } catch (error) {
        return null;
      }
    })
  );

  return champions.filter(Boolean);
}

function getFilteredExplorerRows(rows, query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return rows;
  }
  return rows.filter((row) => row.searchText.toLowerCase().includes(q));
}

function renderInfoExplorer(drivers, constructors) {
  const panel = qs("#infoPanel");
  if (!panel) {
    return;
  }

  const tabs = qsa("#infoTabs [data-view]");
  tabs.forEach((tab) => {
    const active = tab.dataset.view === state.f1.infoView;
    tab.classList.toggle("active", active);
  });

  let rows = [];
  if (state.f1.infoView === "teams") {
    rows = constructors.map((entry) => ({
      title: entry.Constructor.name,
      metaLeft: `${entry.points} pts`,
      metaRight: `${entry.wins} wins`,
      searchText: `${entry.Constructor.name} ${entry.points} ${entry.wins}`
    }));
  } else if (state.f1.infoView === "drivers") {
    rows = drivers.map((entry) => ({
      title: `${entry.Driver.givenName} ${entry.Driver.familyName}`,
      metaLeft: `${entry.points} pts | ${entry.wins} wins`,
      metaRight: entry.Constructors?.[0]?.name || "Unknown team",
      searchText: `${entry.Driver.givenName} ${entry.Driver.familyName} ${entry.Constructors?.[0]?.name || ""}`
    }));
  } else {
    rows = state.f1.historyData.map((item) => ({
      title: `${item.year} Champion: ${item.champion}`,
      metaLeft: `${item.team}`,
      metaRight: `${item.points} pts | ${item.wins} wins`,
      searchText: `${item.year} ${item.champion} ${item.team}`
    }));
  }

  const filtered = getFilteredExplorerRows(rows, state.f1.searchQuery);
  if (!filtered.length) {
    panel.innerHTML = "<p class='empty-state'>No matching results.</p>";
    return;
  }

  panel.innerHTML = filtered
    .map(
      (row) => `
      <div class="info-item">
        <strong>${escapeHtml(row.title)}</strong>
        <div class="info-meta">
          <span>${escapeHtml(row.metaLeft)}</span>
          <span>${escapeHtml(row.metaRight)}</span>
        </div>
      </div>
    `
    )
    .join("");
}

function setupInfoExplorerControls(drivers, constructors) {
  const topSearch = qs("#globalSearchInput");
  const localSearch = qs("#infoSearchInput");
  const tabs = qsa("#infoTabs [data-view]");

  if (topSearch) {
    topSearch.value = state.f1.searchQuery;
    topSearch.oninput = () => {
      state.f1.searchQuery = topSearch.value;
      if (localSearch) {
        localSearch.value = topSearch.value;
      }
      renderInfoExplorer(drivers, constructors);
    };
  }

  if (localSearch) {
    localSearch.value = state.f1.searchQuery;
    localSearch.oninput = () => {
      state.f1.searchQuery = localSearch.value;
      if (topSearch) {
        topSearch.value = localSearch.value;
      }
      renderInfoExplorer(drivers, constructors);
    };
  }

  tabs.forEach((tab) => {
    tab.onclick = () => {
      triggerMicroFeedback();
      state.f1.infoView = tab.dataset.view;
      renderInfoExplorer(drivers, constructors);
    };
  });
}

function renderNewsList(newsItems) {
  const container = qs("#newsList");
  if (!container) {
    return;
  }
  if (!newsItems.length) {
    container.innerHTML = "<p class='empty-state'>News feed unavailable right now.</p>";
    return;
  }
  container.innerHTML = newsItems
    .map(
      (item) => `
      <a class="news-item" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.source)}</span>
      </a>
    `
    )
    .join("");
}

function setupKnowledgeHub() {
  const input = qs("#knowledgeInput");
  const button = qs("#knowledgeSearchBtn");
  const button2 = qs("#knowledgeSearchBtn2");
  const output = qs("#knowledgeOutput");
  const pills = qsa("#knowledgePills [data-topic]");
  if (!input || !button || !output) {
    return;
  }

  const runSearch = async () => {
    const query = input.value.trim() || "Formula One";
    output.innerHTML = "<p class='empty-state'>Searching knowledge base...</p>";
    try {
      const result = await fetchKnowledgeSummary(query);
      output.innerHTML = `
        <h4>${escapeHtml(result.title)}</h4>
        <p>${escapeHtml(result.extract)}</p>
        ${result.url ? `<a href="${escapeHtml(result.url)}" target="_blank" rel="noreferrer noopener">Read more</a>` : ""}
      `;
    } catch (error) {
      output.innerHTML = "<p class='empty-state'>No knowledge result for this search.</p>";
    }
  };

  button.onclick = runSearch;
  if (button2) {
    button2.onclick = runSearch;
  }
  pills.forEach((pill) => {
    pill.onclick = async () => {
      input.value = pill.dataset.topic || "Formula One";
      await runSearch();
    };
  });
}

function setupResetButton() {
  const resetBtn = qs("#resetPrefsBtn");
  if (!resetBtn) {
    return;
  }
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.favoriteDriver);
    localStorage.removeItem(STORAGE_KEYS.favoriteTeam);
    state.favoriteDriver = "";
    state.favoriteTeam = "";
    state.f1.selectedDriverId = "";
    const teamSelect = qs("#favoriteTeamSelect");
    const driverSelect = qs("#favoriteDriverSelect");
    if (teamSelect) {
      teamSelect.value = "";
    }
    if (driverSelect) {
      driverSelect.value = "";
    }
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
    <article class="glass-card card-span-12 card-entry">
      <h3 class="card-title">Formula 1 Live Center <span class="inline-meta">Breaking updates</span></h3>
      <div class="breaking-ticker-wrap">
        <span class="live-dot"></span>
        <div id="breakingTicker" class="breaking-ticker">Loading headlines...</div>
      </div>
      <div id="headlineRail" class="headline-rail">
        <p class="empty-state">Loading feature cards...</p>
      </div>
    </article>

    <article class="glass-card card-span-12 card-entry">
      <h3 class="card-title">Upcoming Race <span class="inline-meta" id="upcomingRaceMeta">Engagement driver</span></h3>
      <div class="upcoming-race-grid">
        <div>
          <p class="inline-meta">Circuit layout</p>
          <div id="upcomingRaceTrack"></div>
        </div>
        <div class="upcoming-race-countdown">
          <p class="kicker">Countdown to Lights Out</p>
          <p class="race-countdown-xl" id="upcomingCountdownXL">--</p>
          <p class="inline-meta" id="upcomingRaceTimeMeta">Syncing race schedule...</p>
          <div class="upcoming-race-actions">
            <button id="setReminderBtn" class="small-btn" type="button">Set Reminder</button>
            <button id="addCalendarBtn" class="small-btn" type="button">Add to Calendar</button>
          </div>
        </div>
      </div>
    </article>

    <article class="glass-card card-span-12 card-entry">
      <h3 class="card-title">Season Calendar <span class="inline-meta">Tap race card for weekend schedule</span></h3>
      <div id="seasonCalendarStrip" class="season-calendar-strip">
        <p class="empty-state">Loading season roadmap...</p>
      </div>
      <div id="seasonCalendarDetail" class="season-calendar-detail"></div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Live Race Center <span class="inline-meta" id="raceMeta">Syncing...</span></h3>
      <div class="live-state-wrap">
        <span id="raceStateBadge" class="race-state-badge">SCHEDULE</span>
        <span id="raceStateDetail" class="inline-meta">Waiting for race timing</span>
      </div>
      <p><strong>Day:</strong> <span id="raceDay">Loading...</span></p>
      <p><strong>Date:</strong> <span id="raceDate">Loading...</span></p>
      <p><strong>Time (UTC):</strong> <span id="raceTime">Loading...</span></p>
      <p><strong>Countdown:</strong> <span id="countdownValue">Loading...</span></p>
      <p><strong>Weather:</strong> <span id="weatherValue">Loading...</span></p>
      <p class="inline-meta" id="livePulse">Live pulse initializing...</p>
      <div class="race-center-stack">
        <div>
          <p class="inline-meta" id="trackLayoutHint">Track layout for next Grand Prix</p>
          <div id="raceTrackLayout"></div>
        </div>
        <div>
          <p class="inline-meta" id="gridLaunchHint">Loading latest starting grid...</p>
          <div id="latestGridLayout"></div>
        </div>
      </div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">Driver Standings <span class="inline-meta">Tap to expand</span></h3>
      <div id="driverStandings" class="data-list"></div>
    </article>

    <article class="glass-card card-span-6 card-entry">
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
      <button id="compareBtn" class="small-btn">Compare Qualifying Pace and Race Finishes</button>
      <div id="comparisonResult" style="margin-top:0.75rem;"></div>
    </article>

    <article class="glass-card card-span-6 card-entry">
      <h3 class="card-title">F1 Information Explorer</h3>
      <div id="infoTabs" class="tab-strip">
        <button class="small-btn active" data-view="teams">Teams</button>
        <button class="small-btn" data-view="drivers">Drivers</button>
        <button class="small-btn" data-view="years">Previous Years</button>
      </div>
      <div class="split" style="margin-bottom:0.6rem;">
        <input id="infoSearchInput" class="select-input" placeholder="Filter teams, drivers, champions" />
        <button id="knowledgeSearchBtn" class="small-btn">Search Wiki</button>
      </div>
      <div class="topic-pills" id="knowledgePills">
        <button class="small-btn" data-topic="Scuderia Ferrari">Ferrari</button>
        <button class="small-btn" data-topic="Toto Wolff">Team Principal</button>
        <button class="small-btn" data-topic="Ayrton Senna">Legend</button>
        <button class="small-btn" data-topic="Formula One World Drivers' Championship">Championship History</button>
      </div>
      <div id="infoPanel" class="info-panel">
        <p class="empty-state">Loading information...</p>
      </div>
      <div class="split" style="margin:0.7rem 0 0.6rem;">
        <input id="knowledgeInput" class="select-input" placeholder="Read about any F1 subject" />
        <button id="knowledgeSearchBtn2" class="small-btn">Open Article</button>
      </div>
      <div id="knowledgeOutput" class="knowledge-output">
        <p class="empty-state">Search any F1 topic to read current and historical context.</p>
      </div>
    </article>

    <article class="glass-card card-span-12 card-entry">
      <h3 class="card-title">Latest News</h3>
      <div id="newsList" class="news-list">
        <p class="empty-state">Loading latest updates...</p>
      </div>
    </article>

    <article class="glass-card card-span-12 card-entry sticky-data-grid-card">
      <h3 class="card-title">Data Grid Footer <span class="inline-meta">Fast, sticky access</span></h3>
      <div id="stickyDataGrid" class="sticky-data-grid">
        <p class="empty-state">Loading standings snapshot...</p>
      </div>
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
    const {
      drivers,
      constructors,
      nextRace,
      seasonCalendar,
      completedRound,
      lastRaceResults,
      lastQualifying
    } = await fetchF1CoreData();
    state.f1.drivers = drivers;
    state.f1.constructors = constructors;
    state.f1.nextRace = nextRace;
    state.f1.seasonCalendar = seasonCalendar;
    state.f1.seasonCompletedRound = completedRound;
    state.f1.lastRaceResults = lastRaceResults;
    state.f1.lastQualifying = lastQualifying;

    const [driverMediaMap, teamLogoMap] = await Promise.all([
      fetchOpenF1DriverMedia(),
      fetchTeamLogoMap(constructors)
    ]);
    state.f1.driverMediaMap = driverMediaMap;
    state.f1.teamLogoMap = teamLogoMap;

    setupPreferenceControls(drivers, constructors);

    if (!state.f1.selectedDriverId) {
      state.f1.selectedDriverId = state.favoriteDriver || drivers[0]?.Driver?.driverId || "";
    }

    const raceDateIso = nextRace ? `${nextRace.date}T${nextRace.time || "00:00:00Z"}` : null;
    const trackTimeZone = getTrackTimeZone(nextRace);
    const raceDateParts = formatRaceDateTime(nextRace?.date, nextRace?.time);
    const raceTimeMode = formatEventTimeByMode(nextRace?.date, nextRace?.time, state.timeMode, trackTimeZone);
    setupTimeModeToggle();
    qs("#raceMeta").textContent = nextRace
      ? `${nextRace.raceName} | ${nextRace.Circuit.Location.locality}`
      : "No race scheduled";
    qs("#raceDay").textContent = raceDateParts.weekday;
    qs("#raceDate").textContent = raceTimeMode.dateLabel;
    qs("#raceTime").textContent = `${raceTimeMode.timeLabel} ${raceTimeMode.zoneLabel}`;

    const racePhase = getRacePhase(nextRace);
    const raceStateBadge = qs("#raceStateBadge");
    const raceStateDetail = qs("#raceStateDetail");
    if (raceStateBadge) {
      raceStateBadge.textContent = racePhase.label;
      raceStateBadge.className = `race-state-badge ${racePhase.label.toLowerCase().replace(/\s+/g, "-")}`;
    }
    if (raceStateDetail) {
      raceStateDetail.textContent = racePhase.detail;
    }

    const leader = drivers[0];
    const second = drivers[1];
    const leaderName = leader ? `${leader.Driver.givenName} ${leader.Driver.familyName}` : "No leader";
    const pointsGap = leader && second ? `${toNum(leader.points) - toNum(second.points)} pts over P2` : "Gap unavailable";

    const selectedDriver = drivers.find((entry) => entry.Driver.driverId === state.f1.selectedDriverId) || drivers[0];
    const trajectory = await fetchDriverTrajectory(selectedDriver.Driver.driverId);
    const seasonSummary = await fetchSeasonSummary(trajectory.labels.length);

    renderQuickIntelStrip({
      countdown: raceDateIso ? formatCountdown(raceDateIso) : "TBD",
      raceName: nextRace?.raceName || "No upcoming race",
      raceDate: `${raceDateParts.weekday}, ${raceTimeMode.dateLabel}`,
      raceTime: `${raceTimeMode.timeLabel} ${raceTimeMode.zoneLabel}`,
      leader: leaderName,
      gap: `${pointsGap} • ${seasonSummary.completed}/${seasonSummary.totalRounds} rounds`,
      seasonCompleted: seasonSummary.completed,
      seasonTotal: seasonSummary.totalRounds
    });

    setupCountdown(raceDateIso);

    const lat = nextRace?.Circuit?.Location?.lat;
    const lon = nextRace?.Circuit?.Location?.long;
    qs("#weatherValue").textContent = await fetchTrackWeather(lat, lon);

    const circuitName = nextRace?.Circuit?.circuitName || "Grand Prix Circuit";
    const circuitId = nextRace?.Circuit?.circuitId || "silverstone";

    qs("#raceTrackLayout").innerHTML = renderTrackMap(circuitId);
    qs("#upcomingRaceTrack").innerHTML = renderTrackMap(circuitId);
    const upcomingMeta = qs("#upcomingRaceMeta");
    if (upcomingMeta) {
      upcomingMeta.textContent = nextRace
        ? `${nextRace.raceName} • ${nextRace.Circuit.Location.country}`
        : "Upcoming race unavailable";
    }
    const upcomingTimeMeta = qs("#upcomingRaceTimeMeta");
    if (upcomingTimeMeta) {
      upcomingTimeMeta.textContent = `${raceTimeMode.dateLabel} ${raceTimeMode.timeLabel} ${raceTimeMode.zoneLabel}`;
    }
    setupUpcomingRaceActions(nextRace);

    renderSeasonCalendar(seasonCalendar);
    setupSeasonCalendarEvents(seasonCalendar);

    qs("#latestGridLayout").innerHTML = renderStartingGridLayout(lastQualifying, lastRaceResults);
    setupGridMapLauncher(lat, lon, circuitName);

    qs("#driverStandings").innerHTML = renderStandingsList(drivers);
    setupDriverListEvents();

    qs("#constructorBars").innerHTML = renderConstructorBars(constructors);

    const seasonYear = nextRace?.season ? Number(nextRace.season) : new Date().getUTCFullYear();
    if (state.f1.historyYear !== seasonYear || !state.f1.historyData.length) {
      state.f1.historyData = await fetchPreviousYearsChampions(seasonYear, 8);
      state.f1.historyYear = seasonYear;
    }
    setupInfoExplorerControls(drivers, constructors);
    renderInfoExplorer(drivers, constructors);

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

    if (!state.favoriteTeam) {
      state.favoriteTeam = selectedDriver?.Constructors?.[0]?.name || "";
      localStorage.setItem(STORAGE_KEYS.favoriteTeam, state.favoriteTeam);
    }
    applyTeamAccentTheme(state.favoriteTeam);
    setHeaderMeta();

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

    upsertTrajectoryChart(trajectory.labels, trajectory.values);

    setupKnowledgeHub();
    const newsItems = await fetchLatestNews();
    state.f1.lastNewsItems = newsItems;
    renderBreakingNews(newsItems);
    renderNewsList(newsItems);
    renderFooterGrid(drivers, constructors, selectedDriver, nextRace);
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
  setupTimeModeToggle();

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
      triggerMicroFeedback();
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
