const STORAGE_KEYS = {
  module: "paddock:module",
  favoriteDriver: "paddock:favoriteDriver",
  favoriteTeam: "paddock:favoriteTeam",
  timezone: "paddock:timezone",
  fxEnabled: "paddock:fxEnabled",
  f1CoreCache: "paddock:f1CoreCache"
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
  timezone: localStorage.getItem(STORAGE_KEYS.timezone) || "Asia/Kolkata",
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
    seasonCalendar: [],
    seasonCompletedRound: 0,
    expandedRound: 0,
    seasonStandingTab: "overview",
    lastNewsItems: [],
    recentFormMap: {},
    recentFormRound: 0,
    standingView: "drivers",
    quizIndex: 0,
    quizScore: 0
  }
};

const TEAM_BUDGET_MILLIONS = {
  Ferrari: 450,
  Mercedes: 440,
  McLaren: 360,
  "Red Bull Racing": 455,
  "Aston Martin": 325,
  Alpine: 300,
  Williams: 220,
  Audi: 280,
  Cadillac: 260,
  "Racing Bulls": 230,
  "Haas F1 Team": 210,
  Sauber: 240
};

const PADDOCK_QUIZ = [
  {
    question: "Which driver has the most F1 World Championships?",
    options: ["Ayrton Senna", "Lewis Hamilton", "Sebastian Vettel"],
    correct: 1
  },
  {
    question: "Monaco Grand Prix is usually held on which day?",
    options: ["Saturday", "Sunday", "Friday"],
    correct: 1
  },
  {
    question: "What does DRS stand for?",
    options: ["Drag Reduction System", "Downforce Recovery Setup", "Dynamic Racing Strategy"],
    correct: 0
  }
];

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

const COUNTRY_FLAGS = {
  Australia: "🇦🇺",
  Bahrain: "🇧🇭",
  Saudi_Arabia: "🇸🇦",
  Italy: "🇮🇹",
  "United States": "🇺🇸",
  Monaco: "🇲🇨",
  Spain: "🇪🇸",
  Canada: "🇨🇦",
  Austria: "🇦🇹",
  "United Kingdom": "🇬🇧",
  Hungary: "🇭🇺",
  Belgium: "🇧🇪",
  Netherlands: "🇳🇱",
  Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬",
  Japan: "🇯🇵",
  Qatar: "🇶🇦",
  Mexico: "🇲🇽",
  Brazil: "🇧🇷",
  UAE: "🇦🇪",
  China: "🇨🇳"
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

function debounce(fn, delay = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function triggerMicroFeedback() {
  if (!state.fxEnabled) {
    return;
  }
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(12);
  }
}

function runThemeShift() {
  document.body.classList.remove("theme-shift");
  void document.body.offsetWidth;
  document.body.classList.add("theme-shift");
  setTimeout(() => document.body.classList.remove("theme-shift"), 360);
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

function timezoneLabel(timezone) {
  if (timezone === "Asia/Kolkata") {
    return "IST (Mumbai)";
  }
  if (timezone === "TRACK_AUTO") {
    return "Track Local";
  }
  return timezone;
}

function formatEventTimeByMode(date, time, selectedTimezone = state.timezone, trackTimeZone = "UTC") {
  if (!date) {
    return { dateLabel: "TBD", timeLabel: "TBD", zoneLabel: "UTC" };
  }

  const iso = `${date}T${time || "00:00:00Z"}`;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) {
    return { dateLabel: date, timeLabel: time || "TBD", zoneLabel: "UTC" };
  }

  const resolvedZone = selectedTimezone === "TRACK_AUTO"
    ? trackTimeZone
    : (selectedTimezone || "Asia/Kolkata");
  const optionsDate = { year: "numeric", month: "short", day: "2-digit", timeZone: resolvedZone };
  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: resolvedZone };

  return {
    dateLabel: new Intl.DateTimeFormat("en-US", optionsDate).format(dt),
    timeLabel: new Intl.DateTimeFormat("en-US", optionsTime).format(dt),
    zoneLabel: selectedTimezone === "TRACK_AUTO" ? `${trackTimeZone} (Track)` : timezoneLabel(resolvedZone)
  };
}

function buildWeekendSessions(nextRace) {
  const practiceSlot = nextRace?.ThirdPractice || nextRace?.SecondPractice || nextRace?.FirstPractice || null;
  return [
    {
      key: "practice",
      label: "Practice",
      date: practiceSlot?.date,
      time: practiceSlot?.time,
      durationHours: 1
    },
    {
      key: "qualifying",
      label: "Qualifying",
      date: nextRace?.Qualifying?.date,
      time: nextRace?.Qualifying?.time,
      durationHours: 1
    },
    {
      key: "race",
      label: "Race",
      date: nextRace?.date,
      time: nextRace?.time,
      durationHours: 2
    }
  ].map((item) => {
    const stamp = item.date ? new Date(`${item.date}T${item.time || "00:00:00Z"}`).getTime() : NaN;
    return {
      ...item,
      stamp: Number.isFinite(stamp) ? stamp : null
    };
  });
}

function renderWeekendEventBoard(nextRace, trackTimeZone, weatherSummary) {
  const board = qs("#weekendEventBoard");
  if (!board) {
    return;
  }

  const sessions = buildWeekendSessions(nextRace);
  const now = Date.now();
  const nextSession = sessions.find((session) => session.stamp && session.stamp > now)
    || sessions.find((session) => session.stamp && session.stamp + (session.durationHours * 60 * 60 * 1000) > now)
    || sessions[sessions.length - 1];

  const leadText = nextSession?.stamp
    ? `${nextSession.label} starts ${formatCountdown(new Date(nextSession.stamp).toISOString())}`
    : "Weekend session times pending";

  board.innerHTML = `
    <div class="weekend-lead">
      <p class="kicker">Next Major Event</p>
      <p class="weekend-lead-text">${escapeHtml(leadText)}</p>
      <p class="inline-meta">Track weather: ${escapeHtml(weatherSummary || "Unavailable")}</p>
    </div>
    <div class="weekend-session-grid">
      ${sessions.map((session) => {
        const formatted = formatEventTimeByMode(session.date, session.time, state.timezone, trackTimeZone);
        let status = "upcoming";
        if (session.stamp) {
          const end = session.stamp + (session.durationHours * 60 * 60 * 1000);
          if (now >= session.stamp && now <= end) {
            status = "live";
          } else if (now > end) {
            status = "done";
          }
        }
        const featured = session.key === nextSession?.key ? " featured" : "";

        return `
          <article class="session-tile ${status}${featured}">
            <p class="kicker">${escapeHtml(session.label)}</p>
            <strong>${escapeHtml(formatted.dateLabel)}</strong>
            <p>${escapeHtml(formatted.timeLabel)} ${escapeHtml(formatted.zoneLabel)}</p>
            <span class="session-status">${escapeHtml(status.toUpperCase())}</span>
          </article>
        `;
      }).join("")}
    </div>
  `;
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

function weatherIconFromSummary(summary) {
  const text = String(summary || "").toLowerCase();
  if (text.includes("rain") || text.includes("storm") || text.includes("code 6") || text.includes("code 8") || text.includes("code 9")) {
    return "🌧️";
  }
  if (text.includes("wind")) {
    return "💨";
  }
  if (text.includes("cloud") || text.includes("code 2") || text.includes("code 3")) {
    return "☁️";
  }
  if (text.includes("fog")) {
    return "🌫️";
  }
  return "☀️";
}

function updateHudTicker(items = []) {
  const ticker = qs("#hudTicker");
  if (!ticker) {
    return;
  }
  const rows = (items || []).map((item) => String(item || "").trim()).filter(Boolean);
  ticker.textContent = rows.length ? rows.join("  •  ") : "Syncing race intelligence...";
}

function updateLiveHUD({
  raceName = "No race loaded",
  country = "",
  localTime = "--",
  countdown = "--",
  weather = "Loading...",
  seasonCompleted = 0,
  seasonTotal = 0,
  tickerItems = null
}) {
  const hudRaceName = qs("#hudRaceName");
  const hudRaceFlag = qs("#hudRaceFlag");
  const hudLocalTime = qs("#hudLocalTime");
  const hudCountdown = qs("#hudCountdown");
  const hudWeatherIcon = qs("#hudWeatherIcon");
  const hudWeatherLabel = qs("#hudWeatherLabel");
  const hudSeasonProgress = qs("#hudSeasonProgress");
  const hudSeasonText = qs("#hudSeasonText");

  if (!hudRaceName || !hudLocalTime || !hudCountdown || !hudWeatherLabel || !hudSeasonProgress || !hudSeasonText) {
    return;
  }

  hudRaceName.textContent = raceName;
  if (hudRaceFlag) {
    const countryRaw = String(country || "");
    const countryKey = countryRaw.replaceAll(" ", "_");
    hudRaceFlag.textContent = COUNTRY_FLAGS[countryRaw] || COUNTRY_FLAGS[countryKey] || "🏁";
  }
  hudLocalTime.textContent = localTime;
  hudCountdown.textContent = countdown;
  hudWeatherLabel.textContent = weather;
  if (hudWeatherIcon) {
    hudWeatherIcon.textContent = weatherIconFromSummary(weather);
  }

  const pct = seasonTotal > 0 ? Math.min(100, Math.max(0, (seasonCompleted / seasonTotal) * 100)) : 0;
  hudSeasonProgress.style.width = `${pct}%`;
  hudSeasonText.textContent = `${seasonCompleted} / ${seasonTotal} rounds`;

  const fallbackTicker = [
    raceName,
    `Local ${localTime}`,
    `Countdown ${countdown}`,
    `Weather ${weather}`,
    `Season ${seasonCompleted}/${seasonTotal}`
  ];
  updateHudTicker(Array.isArray(tickerItems) ? tickerItems : fallbackTicker);
}

function setHeaderMeta() {
  const meta = SPORT_META[state.activeModule];
  const moduleTag = qs("#moduleTag");
  const moduleHeadline = qs("#moduleHeadline");
  if (moduleTag) {
    moduleTag.textContent = meta.tag;
  }
  if (moduleHeadline) {
    moduleHeadline.textContent = meta.headline;
  }
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
  const favoriteLabel = qs("#favoriteLabel");
  if (favoriteLabel) {
    favoriteLabel.textContent = favoriteBits.length ? favoriteBits.join(" | ") : "No favorites selected";
  }
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

function setLoadingState(active) {
  document.body.classList.toggle("is-loading", Boolean(active));
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
  const currentAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().toLowerCase();
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
  if (currentAccent !== accent.toLowerCase()) {
    runThemeShift();
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
  const parseCore = (driverData, constructorData, nextRaceData, lastResultsData, lastQualifyingData, seasonData) => {
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
  };

  try {
    const [driverData, constructorData, nextRaceData, lastResultsData, lastQualifyingData, seasonData] = await Promise.all([
      fetchErgast("/current/driverStandings.json"),
      fetchErgast("/current/constructorStandings.json"),
      fetchErgast("/current/next.json"),
      fetchErgast("/current/last/results.json"),
      fetchErgast("/current/last/qualifying.json"),
      fetchErgast("/current.json?limit=100")
    ]);

    const core = parseCore(driverData, constructorData, nextRaceData, lastResultsData, lastQualifyingData, seasonData);
    if (!core.drivers.length || !core.constructors.length) {
      throw new Error("Core standings response is empty");
    }

    localStorage.setItem(STORAGE_KEYS.f1CoreCache, JSON.stringify(core));
    return core;
  } catch (error) {
    const cachedRaw = localStorage.getItem(STORAGE_KEYS.f1CoreCache);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (Array.isArray(cached?.drivers) && cached.drivers.length) {
          return { ...cached, fromCache: true };
        }
      } catch (cacheError) {
        // Ignore bad cache and fall through to original error.
      }
    }
    throw error;
  }
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

async function fetchRecentDriverForm() {
  try {
    const data = await fetchErgast("/current/results.json?limit=100");
    const races = data?.MRData?.RaceTable?.Races || [];
    const sorted = [...races].sort((a, b) => toNum(b.round) - toNum(a.round)).slice(0, 3);
    const byDriver = {};

    sorted.reverse().forEach((race) => {
      (race.Results || []).forEach((result) => {
        const driverId = result?.Driver?.driverId;
        if (!driverId) {
          return;
        }
        if (!byDriver[driverId]) {
          byDriver[driverId] = [];
        }
        byDriver[driverId].push(toNum(result.points));
      });
    });

    return byDriver;
  } catch (error) {
    return {};
  }
}

function renderSparkline(values) {
  const points = (values || []).slice(-3);
  if (points.length < 2) {
    return "";
  }
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = Math.max(max - min, 1);
  const coords = points.map((val, idx) => {
    const x = 4 + idx * 18;
    const y = 20 - ((val - min) / range) * 16;
    return `${x},${y.toFixed(1)}`;
  }).join(" ");

  return `
    <svg class="sparkline" viewBox="0 0 44 24" aria-label="Recent form sparkline">
      <polyline points="${coords}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>
  `;
}

function computeValueIndex(driver) {
  const teamName = driver?.Constructors?.[0]?.name || "";
  const budget = TEAM_BUDGET_MILLIONS[teamName] || 300;
  const points = toNum(driver?.points);
  const per10M = (points / budget) * 10;
  return per10M.toFixed(2);
}

async function fetchSeasonDriverStandings(year) {
  try {
    const data = await fetchErgast(`/${year}/driverStandings.json`);
    return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  } catch (error) {
    return [];
  }
}

async function fetchCircuitResultsByYear(year, circuitId) {
  if (!circuitId) {
    return [];
  }
  try {
    const data = await fetchErgast(`/${year}/circuits/${circuitId}/results.json?limit=100`);
    return data?.MRData?.RaceTable?.Races?.[0]?.Results || [];
  } catch (error) {
    return [];
  }
}

function buildWeightedMap(lists, rowToScore) {
  const map = new Map();
  let maxScore = 0;

  lists.forEach(({ rows, weight }) => {
    if (!rows.length || !weight) {
      return;
    }
    rows.forEach((row) => {
      const driverId = row?.Driver?.driverId;
      if (!driverId) {
        return;
      }
      const delta = rowToScore(row) * weight;
      const next = (map.get(driverId) || 0) + delta;
      map.set(driverId, next);
      maxScore = Math.max(maxScore, next);
    });
  });

  return { map, maxScore: Math.max(maxScore, 1) };
}

async function buildRacePrediction(drivers, nextRace, seasonYear) {
  if (!drivers.length) {
    return null;
  }

  const priorYears = [seasonYear - 1, seasonYear - 2, seasonYear - 3];
  const weightedYears = [1, 0.85, 0.7];

  const [historicalStandings, circuitResults] = await Promise.all([
    Promise.all(priorYears.map((year) => fetchSeasonDriverStandings(year))),
    Promise.all(priorYears.map((year) => fetchCircuitResultsByYear(year, nextRace?.Circuit?.circuitId || "")))
  ]);

  const historyScored = buildWeightedMap(
    historicalStandings.map((rows, idx) => ({ rows, weight: weightedYears[idx] || 0.6 })),
    (row) => {
      const position = toNum(row.position);
      return Math.max(0, (22 - position) / 21);
    }
  );

  const trackScored = buildWeightedMap(
    circuitResults.map((rows, idx) => ({ rows, weight: weightedYears[idx] || 0.6 })),
    (row) => {
      const position = toNum(row.position);
      return position > 0 ? Math.max(0, (11 - position) / 10) : 0;
    }
  );

  const maxCurrentPoints = Math.max(...drivers.map((driver) => toNum(driver.points)), 1);
  const maxCurrentWins = Math.max(...drivers.map((driver) => toNum(driver.wins)), 1);
  const formTotals = drivers.map((driver) => {
    const form = state.f1.recentFormMap[driver.Driver.driverId] || [];
    return form.slice(-3).reduce((sum, item) => sum + toNum(item), 0);
  });
  const maxFormTotal = Math.max(...formTotals, 1);

  const ranked = drivers
    .map((driver, idx) => {
      const id = driver.Driver.driverId;
      const currentPointsNorm = toNum(driver.points) / maxCurrentPoints;
      const winsNorm = toNum(driver.wins) / maxCurrentWins;
      const formNorm = formTotals[idx] / maxFormTotal;
      const historyNorm = (historyScored.map.get(id) || 0) / historyScored.maxScore;
      const trackNorm = (trackScored.map.get(id) || 0) / trackScored.maxScore;

      const score =
        currentPointsNorm * 0.42 +
        winsNorm * 0.16 +
        formNorm * 0.12 +
        historyNorm * 0.2 +
        trackNorm * 0.1;

      return {
        id,
        driverName: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
        code: driver.Driver.code || driver.Driver.familyName.slice(0, 3).toUpperCase(),
        teamName: driver.Constructors?.[0]?.name || "Unknown Team",
        score,
        currentPointsNorm,
        winsNorm,
        formNorm,
        historyNorm,
        trackNorm
      };
    })
    .sort((a, b) => b.score - a.score);

  const pool = ranked.slice(0, 8);
  const totalScore = Math.max(pool.reduce((sum, row) => sum + row.score, 0), 0.0001);
  const withProb = pool.map((row) => ({
    ...row,
    probability: (row.score / totalScore) * 100
  }));

  const favorite = withProb[0] || null;
  const runnerUp = withProb[1] || null;

  return {
    yearsUsed: priorYears,
    circuit: nextRace?.Circuit?.circuitName || "Next circuit",
    generatedAt: new Date().toISOString(),
    confidenceGap: favorite && runnerUp ? favorite.probability - runnerUp.probability : 0,
    picks: withProb.slice(0, 3)
  };
}

function renderRacePrediction(prediction) {
  const host = qs("#racePredictionPanel");
  if (!host) {
    return;
  }

  if (!prediction || !prediction.picks.length) {
    host.innerHTML = "<p class='empty-state'>Prediction engine is waiting for enough race data.</p>";
    return;
  }

  const leader = prediction.picks[0];
  const rows = prediction.picks
    .map((pick, idx) => {
      const pct = Math.max(4, Math.round(pick.probability));
      return `
        <div class="prediction-row">
          <div>
            <strong>P${idx + 1} ${escapeHtml(pick.driverName)} (${escapeHtml(pick.code)})</strong>
            <p>${escapeHtml(pick.teamName)}</p>
          </div>
          <div class="prediction-prob-wrap">
            <span>${pick.probability.toFixed(1)}%</span>
            <div class="prediction-prob-bar"><div style="width:${pct}%;"></div></div>
          </div>
        </div>
      `;
    })
    .join("");

  host.innerHTML = `
    <div class="prediction-lead">
      <p class="prediction-kicker">Projected Winner</p>
      <h4>${escapeHtml(leader.driverName)} (${escapeHtml(leader.code)})</h4>
      <p class="prediction-sub">${escapeHtml(prediction.circuit)} | Confidence gap ${prediction.confidenceGap.toFixed(1)}%</p>
    </div>
    <div class="prediction-list">${rows}</div>
    <p class="inline-meta">Model blend: current-season points and wins, last-3-race form, prior 3 season standings, and prior 3 years of circuit results.</p>
    <p class="prediction-disclaimer">Machine-oriented prediction only. This forecast is probabilistic and not a guarantee of the race outcome.</p>
  `;
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
    const points = [];
    let wins = 0;
    let podiums = 0;
    let bestFinish = 99;

    races.forEach((race) => {
      const result = race.Results?.[0];
      if (!result) {
        return;
      }
      const gridPos = toNum(result.grid);
      const finishPos = toNum(result.position);
      const pts = toNum(result.points);
      grids.push(gridPos);
      finishes.push(finishPos);
      points.push(pts);
      if (finishPos === 1) {
        wins += 1;
      }
      if (finishPos > 0 && finishPos <= 3) {
        podiums += 1;
      }
      if (finishPos > 0) {
        bestFinish = Math.min(bestFinish, finishPos);
      }
    });

    const avgGrid = grids.length ? grids.reduce((a, b) => a + b, 0) / grids.length : 0;
    const avgFinish = finishes.length ? finishes.reduce((a, b) => a + b, 0) / finishes.length : 0;
    const avgPoints = points.length ? points.reduce((a, b) => a + b, 0) / points.length : 0;
    const top10Rate = finishes.length
      ? (finishes.filter((value) => value > 0 && value <= 10).length / finishes.length) * 100
      : 0;

    return {
      rounds: races.length,
      avgGrid: avgGrid.toFixed(2),
      avgFinish: avgFinish.toFixed(2),
      avgPoints: avgPoints.toFixed(2),
      wins,
      podiums,
      bestFinish: Number.isFinite(bestFinish) && bestFinish !== 99 ? `P${bestFinish}` : "-",
      top10Rate: `${top10Rate.toFixed(1)}%`
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
      const form = state.f1.recentFormMap[id] || [];
      const valueIndex = computeValueIndex(driver);
      const secondaryMeta = isActive
        ? `${team} | ${points} pts | VI ${valueIndex}`
        : `${team} | ${points} pts`;

      return `
        <button class="data-item ${isActive ? "active" : ""}" data-driver-id="${id}">
          <div class="driver-item-main">
            <img class="driver-avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(driverName)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(fallbackAvatar)}'" />
            <div class="driver-copy">
              <strong>#${driver.position} ${driverName} (${code})</strong>
              <span>${secondaryMeta}</span>
              ${isActive ? renderSparkline(form) : ""}
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
  const dots = Array.from({ length: 20 }, (_, idx) => {
    const angle = (idx / 20) * Math.PI * 2;
    const cx = 140 + Math.cos(angle) * 92;
    const cy = 80 + Math.sin(angle) * 48;
    return `<circle class="grid-dot" data-grid-dot="${idx + 1}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3"></circle>`;
  }).join("");
  return `
    <div class="track-map card-entry">
      <svg viewBox="0 0 280 160" role="img" aria-label="Circuit mini map">
        <path class="track-line" d="${path}"></path>
        ${dots}
      </svg>
    </div>
  `;
}

function highlightGridPosition(position) {
  const pos = toNum(position);
  if (!pos) {
    return;
  }
  qsa("[data-grid-dot]").forEach((dot) => {
    dot.classList.toggle("active", toNum(dot.getAttribute("data-grid-dot")) === pos);
  });
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

    const leftDelay = ((pos - 1) * 35).toFixed(0);
    const rightDelay = (pos * 35).toFixed(0);

    rows.push(`
      <div class="grid-row ${laneIndex % 2 === 0 ? "lane-even" : "lane-odd"}">
        <button class="grid-slot lane-left" style="--team-color:${escapeHtml(leftColor)};--grid-delay:${leftDelay}ms" data-open-map="true" data-grid-pos="${pos}" aria-label="Open circuit map from grid row ${pos}">
          <span class="grid-pos">P${pos}</span>
          <span class="grid-code">${escapeHtml(leftCode)}</span>
          <span class="grid-name">${escapeHtml(leftName)}</span>
        </button>
        <button class="grid-slot lane-right" style="--team-color:${escapeHtml(rightColor)};--grid-delay:${rightDelay}ms" data-open-map="true" data-grid-pos="${pos + 1}" aria-label="Open circuit map from grid row ${pos + 1}">
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
    slot.addEventListener("click", () => {
      highlightGridPosition(slot.getAttribute("data-grid-pos"));
      openModal();
    });
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

function renderTelemetryFeed(nextRace, racePhaseLabel) {
  const feed = qs("#telemetryFeed");
  if (!feed) {
    return;
  }

  const vegasStatus = `Las Vegas GP Watch: ${nextRace?.raceName?.toLowerCase().includes("vegas") ? "Race weekend active in schedule" : "Monitoring schedule and paddock updates"}`;
  const nowStamp = new Date().toISOString().replace("T", " ").slice(0, 16);
  const telemetryRows = [
    {
      tag: "Race State",
      message: `${racePhaseLabel || "SCHEDULE"} • ${nextRace?.raceName || "Awaiting race allocation"}`
    },
    {
      tag: "Circuit",
      message: `${nextRace?.Circuit?.circuitName || "Circuit pending"} • ${nextRace?.Circuit?.Location?.locality || "Location pending"}`
    },
    {
      tag: "Intel",
      message: vegasStatus
    }
  ];

  const rowHtml = telemetryRows.map((item) => `
    <div class="telemetry-item">
      <span>${escapeHtml(item.tag)}</span>
      <strong>${escapeHtml(item.message)}</strong>
    </div>
  `).join("");

  feed.innerHTML = `
    <div class="telemetry-item priority">
      <span>Telemetry ${nowStamp} UTC</span>
      <strong>${escapeHtml(vegasStatus)}</strong>
    </div>
    ${rowHtml}
  `;
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
      const formatted = formatEventTimeByMode(race.date, race.time, state.timezone, getTrackTimeZone(race));
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
  const selectedTime = formatEventTimeByMode(selected?.date, selected?.time, state.timezone, getTrackTimeZone(selected));
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
    <section class="footer-grid-col" data-standing-section="drivers">
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
    <section class="footer-grid-col" data-standing-section="constructors">
      <div class="footer-grid-head"><h4>Constructors</h4></div>
      ${topTeams
        .map((row) => {
          const teamName = row.Constructor.name;
          const logo = state.f1.teamLogoMap[teamName] || "";
          return `<div class="footer-row">${logo ? `<img class="team-logo" src="${escapeHtml(logo)}" alt="${escapeHtml(teamName)}" loading="lazy" onerror="this.style.display='none'" />` : ""}<span>${escapeHtml(teamName)}</span><strong>${escapeHtml(row.points)} pts</strong></div>`;
        })
        .join("")}
    </section>
    <section class="footer-grid-col" data-standing-section="paddock">
      <div class="footer-grid-head"><h4>My Paddock</h4></div>
      <div class="footer-row"><span>Favorite Team</span><strong>${escapeHtml(state.favoriteTeam || "Not set")}</strong></div>
      <div class="footer-row"><span>Favorite Driver</span><strong>${escapeHtml(selectedDriver ? `${selectedDriver.Driver.givenName} ${selectedDriver.Driver.familyName}` : "Not set")}</strong></div>
      <div class="footer-row"><span>Timezone</span><strong>${escapeHtml(timezoneLabel(state.timezone === "TRACK_AUTO" ? trackTz : state.timezone))}</strong></div>
      <p class="inline-meta">Quick-access grid for burst sessions.</p>
    </section>
  `;

  setupSeasonStandingTabs();

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

function setupTimezoneAndFxControls() {
  const timezoneSelect = qs("#timezoneSelect");
  if (timezoneSelect) {
    timezoneSelect.value = state.timezone;
    timezoneSelect.onchange = () => {
      state.timezone = timezoneSelect.value || "Asia/Kolkata";
      localStorage.setItem(STORAGE_KEYS.timezone, state.timezone);
      triggerMicroFeedback();
      renderModule();
    };
  }

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

function setupSettingsDrawer() {
  const drawer = qs("#settingsDrawer");
  const openBtn = qs("#openSettingsBtn");
  const closeBtn = qs("#closeSettingsBtn");
  if (!drawer || !openBtn || !closeBtn) {
    return;
  }

  const closeDrawer = () => drawer.classList.add("hidden");

  openBtn.onclick = () => {
    triggerMicroFeedback();
    drawer.classList.remove("hidden");
  };

  closeBtn.onclick = () => {
    triggerMicroFeedback();
    closeDrawer();
  };

  drawer.onclick = (event) => {
    if (event.target === drawer) {
      closeDrawer();
    }
  };
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
          body: `${nextRace.raceName} starts soon (${timezoneLabel(state.timezone)}).`
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

function setupStandingsExpandControl() {
  const standings = qs("#driverStandings");
  const button = qs("#standingsExpandBtn");
  if (!standings || !button) {
    return;
  }

  button.onclick = () => {
    const expanded = standings.classList.toggle("expanded");
    button.textContent = expanded ? "Show Less" : "Show More";
    triggerMicroFeedback();
  };
}

function renderCurrentStandingView() {
  const driverPane = qs("#driverStandingsPanel");
  const constructorPane = qs("#constructorStandingsPanel");
  const driverBtn = qs("#showDriverStandingsBtn");
  const constructorBtn = qs("#showConstructorStandingsBtn");
  if (!driverPane || !constructorPane || !driverBtn || !constructorBtn) {
    return;
  }

  const showDrivers = state.f1.standingView !== "constructors";
  driverPane.classList.toggle("hidden", !showDrivers);
  constructorPane.classList.toggle("hidden", showDrivers);
  driverBtn.classList.toggle("active", showDrivers);
  constructorBtn.classList.toggle("active", !showDrivers);
}

function setupCurrentStandingToggle() {
  const driverBtn = qs("#showDriverStandingsBtn");
  const constructorBtn = qs("#showConstructorStandingsBtn");
  if (!driverBtn || !constructorBtn) {
    return;
  }

  driverBtn.onclick = () => {
    state.f1.standingView = "drivers";
    triggerMicroFeedback();
    renderCurrentStandingView();
  };

  constructorBtn.onclick = () => {
    state.f1.standingView = "constructors";
    triggerMicroFeedback();
    renderCurrentStandingView();
  };
}

function applySeasonStandingTab() {
  const host = qs("#stickyDataGrid");
  if (!host) {
    return;
  }

  const activeTab = state.f1.seasonStandingTab || "overview";
  qsa("#stickyDataGrid .footer-grid-col").forEach((col) => {
    const section = col.dataset.standingSection || "overview";
    const visible = activeTab === "overview" ? true : section === activeTab;
    col.classList.toggle("hidden", !visible);
  });

  const tabMap = {
    overview: qs("#seasonStandingOverviewTab"),
    drivers: qs("#seasonStandingDriversTab"),
    constructors: qs("#seasonStandingConstructorsTab")
  };
  Object.entries(tabMap).forEach(([key, btn]) => {
    if (btn) {
      btn.classList.toggle("active", key === activeTab);
    }
  });
}

function setupSeasonStandingTabs() {
  const tabs = [
    { id: "#seasonStandingOverviewTab", tab: "overview" },
    { id: "#seasonStandingDriversTab", tab: "drivers" },
    { id: "#seasonStandingConstructorsTab", tab: "constructors" }
  ];

  tabs.forEach(({ id, tab }) => {
    const btn = qs(id);
    if (!btn) {
      return;
    }
    btn.onclick = () => {
      state.f1.seasonStandingTab = tab;
      triggerMicroFeedback();
      applySeasonStandingTab();
    };
  });

  applySeasonStandingTab();
}

function renderPaddockQuiz(phaseLabel) {
  const wrap = qs("#paddockQuiz");
  const questionEl = qs("#quizQuestion");
  const optionsEl = qs("#quizOptions");
  const scoreEl = qs("#quizScore");
  if (!wrap || !questionEl || !optionsEl || !scoreEl) {
    return;
  }

  if (phaseLabel !== "PRE-RACE") {
    wrap.classList.add("hidden");
    return;
  }

  wrap.classList.remove("hidden");
  const current = PADDOCK_QUIZ[state.f1.quizIndex % PADDOCK_QUIZ.length];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = current.options
    .map((option, idx) => `<button class="small-btn" data-quiz-option="${idx}" type="button">${escapeHtml(option)}</button>`)
    .join("");

  optionsEl.querySelectorAll("[data-quiz-option]").forEach((button) => {
    button.onclick = () => {
      const selected = toNum(button.getAttribute("data-quiz-option"));
      const correct = selected === current.correct;
      if (correct) {
        state.f1.quizScore += 1;
      }
      state.f1.quizIndex += 1;
      scoreEl.textContent = `Score: ${state.f1.quizScore}/${state.f1.quizIndex}`;
      triggerMicroFeedback();
      renderPaddockQuiz("PRE-RACE");
    };
  });

  scoreEl.textContent = `Score: ${state.f1.quizScore}/${state.f1.quizIndex}`;
}

function setupCountdown(raceDateIso) {
  const countdownEl = qs("#hudCountdown");
  if (!countdownEl || !raceDateIso) {
    return;
  }

  const raceStart = new Date(raceDateIso).getTime();
  const raceEnd = raceStart + 1000 * 60 * 60 * 2;

  const update = () => {
    const countdownText = formatCountdown(raceDateIso);
    countdownEl.textContent = countdownText;

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
        renderPaddockQuiz("PRE-RACE");
      } else if (now >= raceStart && now <= raceEnd) {
        const elapsedMin = Math.max(0, Math.floor((now - raceStart) / 60000));
        badge.textContent = "LIVE";
        badge.className = "race-state-badge live";
        detail.textContent = `Race in progress • T+${elapsedMin} min`;
        renderPaddockQuiz("LIVE");
      } else {
        badge.textContent = "FINISHED";
        badge.className = "race-state-badge finished";
        detail.textContent = "Awaiting post-race updates";
        renderPaddockQuiz("FINISHED");
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
      const paceWinner = toNum(metrics.a.avgFinish) < toNum(metrics.b.avgFinish) ? aSelect.value.toUpperCase() : bSelect.value.toUpperCase();
      const pointsWinner = toNum(metrics.a.avgPoints) > toNum(metrics.b.avgPoints) ? aSelect.value.toUpperCase() : bSelect.value.toUpperCase();
      output.innerHTML = `
        <div class="compare-grid card-entry">
          <div class="compare-cell">
            <strong>${aSelect.value.toUpperCase()}</strong>
            <p>Rounds: ${metrics.a.rounds}</p>
            <p>Avg Grid: ${metrics.a.avgGrid}</p>
            <p>Avg Finish: ${metrics.a.avgFinish}</p>
            <p>Avg Points: ${metrics.a.avgPoints}</p>
            <p>Wins/Podiums: ${metrics.a.wins}/${metrics.a.podiums}</p>
            <p>Best Finish: ${metrics.a.bestFinish}</p>
            <p>Top-10 Rate: ${metrics.a.top10Rate}</p>
          </div>
          <div class="compare-cell">
            <strong>${bSelect.value.toUpperCase()}</strong>
            <p>Rounds: ${metrics.b.rounds}</p>
            <p>Avg Grid: ${metrics.b.avgGrid}</p>
            <p>Avg Finish: ${metrics.b.avgFinish}</p>
            <p>Avg Points: ${metrics.b.avgPoints}</p>
            <p>Wins/Podiums: ${metrics.b.wins}/${metrics.b.podiums}</p>
            <p>Best Finish: ${metrics.b.bestFinish}</p>
            <p>Top-10 Rate: ${metrics.b.top10Rate}</p>
          </div>
        </div>
        <p class="inline-meta">Pace edge: ${paceWinner} | Points consistency: ${pointsWinner}</p>
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

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#E10600";
  const accentRgb = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || "225, 6, 0";

  state.f1.chart = new Chart(chartEl, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Cumulative Points",
          data: values,
          borderColor: accent,
          backgroundColor: `rgba(${accentRgb}, 0.18)`,
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
  grid.classList.add("f1-layout");
  grid.innerHTML = `
    <section class="top-duo">
      <article class="glass-card card-entry next-race-card">
        <h3 class="card-title">Next F1 Event Weekend <span class="inline-meta" id="raceMeta">Syncing...</span></h3>
        <div class="weekend-hero">
          <p class="kicker" id="nextRaceCircuit">Circuit loading...</p>
          <strong id="nextRaceName">Grand Prix loading...</strong>
          <p class="race-countdown-xl" id="nextRaceStart">--</p>
        </div>
        <div id="weekendEventBoard" class="weekend-event-board">
          <p class="empty-state">Loading weekend sessions...</p>
        </div>
        <div class="upcoming-race-actions quick-actions">
          <button id="setReminderBtn" class="small-btn" type="button">Set Reminder</button>
          <button id="addCalendarBtn" class="small-btn" type="button">Add to Calendar</button>
        </div>
      </article>

      <article class="glass-card card-entry track-grid-card">
        <h3 class="card-title">Track & Starting Grid <span class="inline-meta" id="gridLaunchHint">Grid animation preparing...</span></h3>
        <div class="live-state-wrap">
          <span id="raceStateBadge" class="race-state-badge">SCHEDULE</span>
          <span id="raceStateDetail" class="inline-meta">Waiting for race timing</span>
        </div>
        <p class="inline-meta" id="livePulse">Live pulse initializing...</p>
        <div id="telemetryFeed" class="telemetry-feed">
          <p class="empty-state">Loading telemetry feed...</p>
        </div>
        <div id="paddockQuiz" class="paddock-quiz hidden">
          <h4>Pre-Race Quiz</h4>
          <p id="quizQuestion">Loading question...</p>
          <div id="quizOptions" class="quiz-options"></div>
          <p id="quizScore" class="inline-meta">Score: 0/0</p>
        </div>
        <div class="start-lights" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="race-center-stack two-up">
          <div>
            <p class="inline-meta" id="trackLayoutHint">Circuit Geometry</p>
            <div id="raceTrackLayout"></div>
          </div>
          <div>
            <p class="inline-meta">Starting Positions</p>
            <div id="latestGridLayout"></div>
          </div>
        </div>
      </article>
    </section>

    <section class="priority-strip">
      <article class="glass-card card-entry priority-card">
        <h3 class="card-title">Race Predictor <span class="inline-meta">AI Model</span></h3>
        <div id="racePredictionPanel">
          <p class="empty-state">Calculating probabilities...</p>
        </div>
      </article>

      <article class="glass-card card-entry priority-card current-standing-card">
        <h3 class="card-title">Current Standing</h3>
        <div class="standings-switch" role="tablist" aria-label="Standings views">
          <button id="showDriverStandingsBtn" class="small-btn" type="button">Driver Standing</button>
          <button id="showConstructorStandingsBtn" class="small-btn" type="button">Constructor Standing</button>
        </div>
        <div id="driverStandingsPanel" class="standings-pane">
          <div id="driverStandings" class="data-list"></div>
          <button id="standingsExpandBtn" class="small-btn standings-expand-btn" type="button">Show More</button>
        </div>
        <div id="constructorStandingsPanel" class="standings-pane hidden">
          <div id="constructorBars"></div>
        </div>
        <div class="season-standing-mini">
          <p class="kicker">Season Standing</p>
          <div class="season-standing-tabs" role="tablist" aria-label="Season standing views">
            <button id="seasonStandingOverviewTab" class="small-btn" type="button">Overview</button>
            <button id="seasonStandingDriversTab" class="small-btn" type="button">Drivers</button>
            <button id="seasonStandingConstructorsTab" class="small-btn" type="button">Constructors</button>
          </div>
          <div id="stickyDataGrid" class="sticky-data-grid">
            <p class="empty-state">Loading standings snapshot...</p>
          </div>
        </div>
      </article>

      <article class="glass-card card-entry priority-card">
        <h3 class="card-title">Supporting Driver and Team</h3>
        <div id="profileStats" class="stats-row"></div>
        <div style="height: 180px; margin-top: 1rem;">
          <canvas id="trajectoryChart"></canvas>
        </div>
      </article>
    </section>

    <section class="layout-main">
      <article class="glass-card card-entry season-roadmap-card">
        <h3 class="card-title">Season Roadmap</h3>
        <div id="seasonCalendarStrip" class="season-calendar-strip">
          <p class="empty-state">Loading season roadmap...</p>
        </div>
        <div id="seasonCalendarDetail" class="season-calendar-detail"></div>
      </article>

      <article class="glass-card card-entry">
        <h3 class="card-title">Head-to-Head</h3>
        <div class="split" style="margin-bottom:0.5rem;">
          <select id="driverA" class="select-input"></select>
          <select id="driverB" class="select-input"></select>
        </div>
        <button id="compareBtn" class="small-btn" style="width:100%">Compare Pace</button>
        <div id="comparisonResult" style="margin-top:0.65rem;"></div>
      </article>
    </section>

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
  setLoadingState(true);
  updateLiveHUD({
    raceName: "Fetching next Grand Prix",
    localTime: "Loading...",
    countdown: "Loading...",
    weather: "Loading...",
    seasonCompleted: 0,
    seasonTotal: 0,
    tickerItems: ["Connecting race data", "Loading standings", "Preparing cockpit"]
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
    if (state.f1.recentFormRound !== completedRound || !Object.keys(state.f1.recentFormMap).length) {
      state.f1.recentFormMap = await fetchRecentDriverForm();
      state.f1.recentFormRound = completedRound;
    }
    state.f1.driverMediaMap = driverMediaMap;
    state.f1.teamLogoMap = teamLogoMap;

    setupPreferenceControls(drivers, constructors);

    if (!state.f1.selectedDriverId) {
      state.f1.selectedDriverId = state.favoriteDriver || drivers[0]?.Driver?.driverId || "";
    }

    const raceDateIso = nextRace ? `${nextRace.date}T${nextRace.time || "00:00:00Z"}` : null;
    const trackTimeZone = getTrackTimeZone(nextRace);
    const raceTimeMode = formatEventTimeByMode(nextRace?.date, nextRace?.time, state.timezone, trackTimeZone);
    setupTimezoneAndFxControls();
    const raceMetaEl = qs("#raceMeta");
    if (raceMetaEl) {
      raceMetaEl.textContent = nextRace
        ? `${nextRace.raceName} | ${nextRace.Circuit.Location.locality}`
        : "No race scheduled";
    }
    const nextRaceNameEl = qs("#nextRaceName");
    if (nextRaceNameEl) {
      nextRaceNameEl.textContent = nextRace?.raceName || "No race scheduled";
    }
    const nextRaceCircuitEl = qs("#nextRaceCircuit");
    if (nextRaceCircuitEl) {
      nextRaceCircuitEl.textContent = nextRace?.Circuit?.circuitName || "Circuit TBD";
    }
    const nextRaceStartEl = qs("#nextRaceStart");
    if (nextRaceStartEl) {
      nextRaceStartEl.textContent = `${raceTimeMode.dateLabel} ${raceTimeMode.timeLabel}`;
    }

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
    renderPaddockQuiz(racePhase.label);
    renderTelemetryFeed(nextRace, racePhase.label);

    const leader = drivers[0];
    const second = drivers[1];
    const leaderName = leader ? `${leader.Driver.givenName} ${leader.Driver.familyName}` : "No leader";
    const pointsGap = leader && second ? `${toNum(leader.points) - toNum(second.points)} pts` : "Gap unavailable";

    const selectedDriver = drivers.find((entry) => entry.Driver.driverId === state.f1.selectedDriverId) || drivers[0];
    const trajectory = await fetchDriverTrajectory(selectedDriver.Driver.driverId);
    const seasonSummary = await fetchSeasonSummary(trajectory.labels.length);

    setupCountdown(raceDateIso);

    const lat = nextRace?.Circuit?.Location?.lat;
    const lon = nextRace?.Circuit?.Location?.long;
    const weatherSummary = await fetchTrackWeather(lat, lon);
    renderWeekendEventBoard(nextRace, trackTimeZone, weatherSummary);
    updateLiveHUD({
      raceName: nextRace?.raceName || "No upcoming race",
      country: nextRace?.Circuit?.Location?.country || "",
      localTime: `${raceTimeMode.timeLabel} ${raceTimeMode.zoneLabel}`,
      countdown: raceDateIso ? formatCountdown(raceDateIso) : "TBD",
      weather: weatherSummary,
      seasonCompleted: seasonSummary.completed,
      seasonTotal: seasonSummary.totalRounds,
      tickerItems: [
        `${nextRace?.raceName || "Next race TBD"} • ${nextRace?.Circuit?.circuitName || "Circuit pending"}`,
        `Leader ${leaderName}`,
        `Championship gap ${pointsGap}`,
        `${racePhase.label} • ${racePhase.detail}`,
        `Local start ${raceTimeMode.timeLabel} ${raceTimeMode.zoneLabel}`
      ]
    });

    const circuitName = nextRace?.Circuit?.circuitName || "Grand Prix Circuit";
    const circuitId = nextRace?.Circuit?.circuitId || "silverstone";

    qs("#raceTrackLayout").innerHTML = renderTrackMap(circuitId);
    setupUpcomingRaceActions(nextRace);

    renderSeasonCalendar(seasonCalendar);
    setupSeasonCalendarEvents(seasonCalendar);

    qs("#latestGridLayout").innerHTML = renderStartingGridLayout(lastQualifying, lastRaceResults);
    setupGridMapLauncher(lat, lon, circuitName);

    qs("#driverStandings").innerHTML = renderStandingsList(drivers);
    setupDriverListEvents();
    setupStandingsExpandControl();
    setupCurrentStandingToggle();
    renderCurrentStandingView();

    const seasonYear = nextRace?.season ? Number(nextRace.season) : new Date().getUTCFullYear();
    const prediction = await buildRacePrediction(drivers, nextRace, seasonYear);
    renderRacePrediction(prediction);

    const constructorBars = qs("#constructorBars");
    if (constructorBars) {
      constructorBars.innerHTML = renderConstructorBars(constructors);
    }
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

    renderFooterGrid(drivers, constructors, selectedDriver, nextRace);
  } catch (error) {
    console.error("renderF1 failed", error);
    const reason = error?.message ? escapeHtml(String(error.message)) : "Unknown error";
    updateLiveHUD({
      raceName: "Data feed issue",
      localTime: "Unavailable",
      countdown: "Unavailable",
      weather: "Unavailable",
      seasonCompleted: 0,
      seasonTotal: 0,
      tickerItems: ["Race intelligence offline", "Retrying live services"]
    });
    qs("#dashboardGrid").innerHTML = `
      <article class="glass-card card-span-12">
        <h3 class="card-title">Data Stream Interrupted</h3>
        <p class="empty-state">
          Live APIs could not be reached right now. The architecture is ready; verify internet access or endpoint availability and refresh.
        </p>
        <p class="inline-meta">Debug: ${reason}</p>
      </article>
    `;
  } finally {
    setLoadingState(false);
  }
}

function renderFootball() {
  const grid = qs("#dashboardGrid");
  grid.classList.remove("f1-layout");
  grid.innerHTML = "";
  updateLiveHUD({
    raceName: "Formula 1 module inactive",
    localTime: "--",
    countdown: "Switch to F1",
    weather: "--",
    seasonCompleted: 0,
    seasonTotal: 0
  });

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
  grid.classList.remove("f1-layout");
  grid.innerHTML = "";
  updateLiveHUD({
    raceName: "Formula 1 module inactive",
    localTime: "--",
    countdown: "Switch to F1",
    weather: "--",
    seasonCompleted: 0,
    seasonTotal: 0
  });

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
  grid.classList.remove("f1-layout");
  grid.innerHTML = "";
  updateLiveHUD({
    raceName: "Formula 1 module inactive",
    localTime: "--",
    countdown: "Switch to F1",
    weather: "--",
    seasonCompleted: 0,
    seasonTotal: 0
  });

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
  setupTimezoneAndFxControls();

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
      triggerMicroFeedback();
      state.activeModule = button.dataset.module;
      localStorage.setItem(STORAGE_KEYS.module, state.activeModule);
      renderModule();
    });
  });

  setupResetButton();
  setupSettingsDrawer();
}

function init() {
  bindGlobalEvents();
  renderModule();
}

window.addEventListener("DOMContentLoaded", init);
