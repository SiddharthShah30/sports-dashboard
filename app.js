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
    insightChart: null,
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
  },
  football: {
    season: new Date().getUTCMonth() >= 6 ? new Date().getUTCFullYear() : new Date().getUTCFullYear() - 1,
    featuredLeagueId: 39,
    standings: [],
    upcomingFixtures: [],
    topScorers: [],
    liveFixtures: [],
    pointsChart: null,
    lastUpdated: ""
  },
  cricket: {
    events: [],
    liveEvents: [],
    upcomingEvents: [],
    recentEvents: [],
    momentumChart: null,
    lastUpdated: ""
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
    headline: "Live match pulse, standings momentum, and elite player form"
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

const MODULE_ACCENTS = {
  f1: "#e10600",
  football: "#21c96b",
  cricket: "#27b4ff",
  nba: "#ff8a3c"
};

const FOOTBALL_API = {
  baseUrl: "https://v3.football.api-sports.io",
  key: "8fb27fd382919bba6d637deb801b0096"
};

const FOOTBALL_LEAGUES = [
  { id: 39, code: "PL", name: "Premier League", country: "England" },
  { id: 140, code: "LL", name: "La Liga", country: "Spain" },
  { id: 135, code: "SA", name: "Serie A", country: "Italy" }
];

const CRICKET_API = {
  baseUrl: "https://www.thesportsdb.com/api/v1/json/3"
};

const TRACK_PATHS = {
  bahrain: "M30 80 L90 30 L180 35 L240 55 L255 90 L230 120 L160 125 L120 110 L100 85 L70 95 L45 110",
  monza: "M45 35 L210 35 L250 55 L220 95 L140 105 L65 95 L40 70 Z",
  silverstone: "M35 95 L55 55 L105 40 L160 50 L210 35 L250 55 L245 100 L210 120 L160 110 L120 90 L75 105",
  monaco: "M70 120 L90 90 L120 80 L160 90 L180 70 L220 70 L240 95 L210 120 L170 120 L120 135 L85 130",
  spa: "M30 105 L65 65 L120 35 L180 45 L230 65 L250 95 L205 120 L145 115 L90 125"
};

const TRACK_VECTOR_BASE_URL = "https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/minimal/white-outline";

const CIRCUIT_VECTOR_LAYOUTS = {
  albert_park: "melbourne-2",
  bahrain: "bahrain-3",
  jeddah: "jeddah-1",
  suzuka: "suzuka-2",
  shanghai: "shanghai-1",
  miami: "miami-1",
  imola: "imola-3",
  monaco: "monaco-6",
  gilles_villeneuve: "montreal-6",
  catalunya: "catalunya-6",
  red_bull_ring: "spielberg-3",
  silverstone: "silverstone-8",
  hungaroring: "hungaroring-3",
  spa: "spa-francorchamps-4",
  zandvoort: "zandvoort-5",
  monza: "monza-7",
  baku: "baku-1",
  marina_bay: "marina-bay-4",
  americas: "austin-1",
  rodriguez: "mexico-city-3",
  interlagos: "interlagos-2",
  las_vegas: "las-vegas-1",
  vegas: "las-vegas-1",
  losail: "lusail-1",
  lusail: "lusail-1",
  yas_marina: "yas-marina-2"
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

async function fetchFootballJSON(path, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const url = `${FOOTBALL_API.baseUrl}${path}${search.toString() ? `?${search}` : ""}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "x-apisports-key": FOOTBALL_API.key
      }
    });

    if (!response.ok) {
      throw new Error(`Football API HTTP ${response.status}`);
    }

    const data = await response.json();
    if (String(data?.errors || "") && Object.keys(data.errors || {}).length) {
      throw new Error("Football API returned an error payload");
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function footballKickoffLabel(isoDate) {
  if (!isoDate) {
    return "Kickoff TBD";
  }
  const dt = new Date(isoDate);
  if (Number.isNaN(dt.getTime())) {
    return "Kickoff TBD";
  }
  const zone = state.timezone === "TRACK_AUTO" ? "UTC" : (state.timezone || "Asia/Kolkata");
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: zone
  }).format(dt);
  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: zone
  }).format(dt);
  return `${dateLabel} ${timeLabel} ${timezoneLabel(zone)}`;
}

function destroyFootballChart() {
  if (state.football.pointsChart) {
    state.football.pointsChart.destroy();
    state.football.pointsChart = null;
  }
}

async function fetchFootballStandingsWithFallback(leagueId, preferredSeason) {
  const candidates = [preferredSeason, preferredSeason - 1, preferredSeason - 2]
    .filter((value, idx, arr) => Number.isFinite(value) && arr.indexOf(value) === idx);

  let lastData = null;
  for (const season of candidates) {
    const data = await fetchFootballJSON("/standings", { league: leagueId, season });
    const table = data?.response?.[0]?.league?.standings?.[0] || [];
    if (table.length) {
      return { season, data, table };
    }
    lastData = data;
  }

  return {
    season: preferredSeason,
    data: lastData,
    table: []
  };
}

function bindInsightModalClose() {
  const refs = getInsightModalRefs();
  if (!refs) {
    return;
  }

  const close = () => {
    refs.modal.classList.add("hidden");
    if (state.f1.insightChart) {
      state.f1.insightChart.destroy();
      state.f1.insightChart = null;
    }
  };

  refs.closeBtn.onclick = () => {
    close();
    triggerMicroFeedback();
  };
  refs.modal.onclick = (event) => {
    if (event.target === refs.modal) {
      close();
    }
  };
}

function formLettersToPoints(formText = "") {
  return String(formText)
    .slice(-5)
    .split("")
    .filter(Boolean)
    .map((symbol) => {
      if (symbol === "W") {
        return 3;
      }
      if (symbol === "D") {
        return 1;
      }
      return 0;
    });
}

function setupFootballInsightEvents({ featuredLeague, standingsTable, upcomingFixtures, topScorers }) {
  qsa(".football-standings-row[data-football-team-id]").forEach((row) => {
    row.onclick = () => {
      const teamName = row.dataset.footballTeamName || "Team";
      const rank = row.dataset.footballRank || "-";
      const points = row.dataset.footballPoints || "0";
      const goalDiff = row.dataset.footballGd || "0";
      const form = row.dataset.footballForm || "";
      const wins = row.dataset.footballWin || "0";
      const draws = row.dataset.footballDraw || "0";
      const losses = row.dataset.footballLoss || "0";
      const goalsFor = row.dataset.footballGf || "0";
      const goalsAgainst = row.dataset.footballGa || "0";
      const formText = String(form).split("").join(" • ") || "Not available";

      const content = `
        <div class="insight-grid">
          <p><span>League</span><strong>${escapeHtml(featuredLeague.name)}</strong></p>
          <p><span>Current Rank</span><strong>P${escapeHtml(rank)}</strong></p>
          <p><span>Points</span><strong>${escapeHtml(points)}</strong></p>
          <p><span>Goal Difference</span><strong>${toNum(goalDiff) > 0 ? "+" : ""}${escapeHtml(goalDiff)}</strong></p>
          <p><span>Record</span><strong>${escapeHtml(`${wins}W • ${draws}D • ${losses}L`)}</strong></p>
          <p><span>Goals</span><strong>${escapeHtml(`${goalsFor} For / ${goalsAgainst} Against`)}</strong></p>
        </div>
        <div class="insight-chart-wrap">
          <canvas id="insightChartCanvas" aria-label="Team analytics chart"></canvas>
        </div>
        <p class="insight-note">Recent form sequence: ${escapeHtml(formText)}</p>
      `;

      openInsightModal(`${teamName} • Team Analytics`, content);

      renderInsightChart({
        type: "bar",
        data: {
          labels: ["Wins", "Draws", "Losses", "GF", "GA"],
          datasets: [
            {
              label: "Season Totals",
              data: [toNum(wins), toNum(draws), toNum(losses), toNum(goalsFor), toNum(goalsAgainst)],
              backgroundColor: [
                "rgba(33, 201, 107, 0.85)",
                "rgba(255, 201, 74, 0.82)",
                "rgba(255, 91, 91, 0.82)",
                "rgba(84, 173, 255, 0.84)",
                "rgba(186, 146, 255, 0.8)"
              ],
              borderRadius: 8,
              maxBarThickness: 32
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: "#1f2430" } } },
          scales: {
            x: { ticks: { color: "#2b3140" }, grid: { color: "rgba(0,0,0,0.08)" } },
            y: { beginAtZero: true, ticks: { color: "#2b3140" }, grid: { color: "rgba(0,0,0,0.08)" } }
          }
        }
      });
    };
  });

  qsa(".football-fixture-row[data-football-fixture-id]").forEach((button) => {
    button.onclick = () => {
      const homeName = button.dataset.footballHomeName || "Home";
      const awayName = button.dataset.footballAwayName || "Away";
      const kickoff = button.dataset.footballKickoff || "";
      const venue = button.dataset.footballVenue || "Venue TBA";
      const round = button.dataset.footballRound || "Round TBD";
      const status = button.dataset.footballStatus || "Scheduled";

      const homeStats = standingsTable.find((row) => String(row?.team?.id) === String(button.dataset.footballHomeId));
      const awayStats = standingsTable.find((row) => String(row?.team?.id) === String(button.dataset.footballAwayId));
      const homeFormSeries = formLettersToPoints(homeStats?.form || "");
      const awayFormSeries = formLettersToPoints(awayStats?.form || "");

      const content = `
        <div class="insight-grid">
          <p><span>Match</span><strong>${escapeHtml(homeName)} vs ${escapeHtml(awayName)}</strong></p>
          <p><span>Kickoff</span><strong>${escapeHtml(footballKickoffLabel(kickoff))}</strong></p>
          <p><span>Venue</span><strong>${escapeHtml(venue)}</strong></p>
          <p><span>Round</span><strong>${escapeHtml(round)}</strong></p>
          <p><span>Status</span><strong>${escapeHtml(status)}</strong></p>
          <p><span>League</span><strong>${escapeHtml(featuredLeague.name)}</strong></p>
          <p><span>Home Table</span><strong>${homeStats ? `P${homeStats.rank} • ${homeStats.points} pts` : "Unavailable"}</strong></p>
          <p><span>Away Table</span><strong>${awayStats ? `P${awayStats.rank} • ${awayStats.points} pts` : "Unavailable"}</strong></p>
        </div>
        <div class="insight-chart-wrap">
          <canvas id="insightChartCanvas" aria-label="Fixture comparison chart"></canvas>
        </div>
      `;

      openInsightModal(`${homeName} vs ${awayName} • Match Insight`, content);

      renderInsightChart({
        type: "bar",
        data: {
          labels: ["Table Points", "Goal Diff", "Form Last 5"],
          datasets: [
            {
              label: homeName,
              data: [
                toNum(homeStats?.points),
                toNum(homeStats?.goalsDiff),
                homeFormSeries.reduce((sum, value) => sum + value, 0)
              ],
              backgroundColor: "rgba(33, 201, 107, 0.78)",
              borderRadius: 8,
              maxBarThickness: 30
            },
            {
              label: awayName,
              data: [
                toNum(awayStats?.points),
                toNum(awayStats?.goalsDiff),
                awayFormSeries.reduce((sum, value) => sum + value, 0)
              ],
              backgroundColor: "rgba(84, 173, 255, 0.76)",
              borderRadius: 8,
              maxBarThickness: 30
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: "#1f2430" } } },
          scales: {
            x: { ticks: { color: "#2b3140" }, grid: { color: "rgba(0,0,0,0.08)" } },
            y: { ticks: { color: "#2b3140" }, grid: { color: "rgba(0,0,0,0.08)" } }
          }
        }
      });
    };
  });

  qsa(".football-scorer-row[data-football-player-id]").forEach((row) => {
    row.onclick = () => {
      const player = row.dataset.footballPlayerName || "Player";
      const team = row.dataset.footballTeamName || "Team";
      const goals = toNum(row.dataset.footballGoals);
      const assists = toNum(row.dataset.footballAssists);
      const shots = toNum(row.dataset.footballShots);
      const shotsOn = toNum(row.dataset.footballShotsOn);
      const penalties = toNum(row.dataset.footballPens);
      const appearances = toNum(row.dataset.footballApps);
      const minutes = toNum(row.dataset.footballMinutes);
      const contribution = goals + assists;

      const content = `
        <div class="insight-grid">
          <p><span>Player</span><strong>${escapeHtml(player)}</strong></p>
          <p><span>Club</span><strong>${escapeHtml(team)}</strong></p>
          <p><span>Goals</span><strong>${escapeHtml(String(goals))}</strong></p>
          <p><span>Assists</span><strong>${escapeHtml(String(assists))}</strong></p>
          <p><span>Goal Contributions</span><strong>${escapeHtml(String(contribution))}</strong></p>
          <p><span>Appearances</span><strong>${escapeHtml(String(appearances))}</strong></p>
          <p><span>Minutes</span><strong>${escapeHtml(String(minutes))}</strong></p>
          <p><span>Shots / On Target</span><strong>${escapeHtml(`${shots} / ${shotsOn}`)}</strong></p>
          <p><span>Penalties Scored</span><strong>${escapeHtml(String(penalties))}</strong></p>
        </div>
        <div class="insight-chart-wrap">
          <canvas id="insightChartCanvas" aria-label="Scorer profile chart"></canvas>
        </div>
      `;

      openInsightModal(`${player} • Scorer Breakdown`, content);

      renderInsightChart({
        type: "radar",
        data: {
          labels: ["Goals", "Assists", "Shots", "On Target", "Penalties"],
          datasets: [
            {
              label: player,
              data: [goals, assists, shots, shotsOn, penalties],
              borderColor: "rgba(33, 201, 107, 0.95)",
              backgroundColor: "rgba(33, 201, 107, 0.25)",
              pointBackgroundColor: "rgba(33, 201, 107, 0.95)",
              pointRadius: 2
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: "#1f2430" } } },
          scales: {
            r: {
              angleLines: { color: "rgba(0,0,0,0.12)" },
              grid: { color: "rgba(0,0,0,0.12)" },
              pointLabels: { color: "#2b3140" },
              ticks: { color: "#2b3140", backdropColor: "transparent" }
            }
          }
        }
      });
    };
  });
}

async function fetchSportsDbJSON(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const url = `${CRICKET_API.baseUrl}${path}${query.toString() ? `?${query}` : ""}`;
  return fetchJSON(url);
}

function cricketDateOffset(days = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isCricketLiveStatus(statusText = "") {
  const text = String(statusText || "").toLowerCase();
  return ["live", "in progress", "stumps", "lunch", "tea", "innings break", "delay", "no result"].some((term) => text.includes(term));
}

function parseCricketRuns(value) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  const fromText = String(value || "").match(/\d+/);
  return fromText ? Number(fromText[0]) : 0;
}

function destroyCricketChart() {
  if (state.cricket.momentumChart) {
    state.cricket.momentumChart.destroy();
    state.cricket.momentumChart = null;
  }
}

function buildCricketFormTable(events) {
  const board = new Map();
  (events || []).forEach((event) => {
    const home = event?.strHomeTeam;
    const away = event?.strAwayTeam;
    const homeRuns = parseCricketRuns(event?.intHomeScore || event?.strHomeScore);
    const awayRuns = parseCricketRuns(event?.intAwayScore || event?.strAwayScore);
    if (!home || !away || (!homeRuns && !awayRuns)) {
      return;
    }

    const apply = (team, runsFor, runsAgainst, won) => {
      if (!board.has(team)) {
        board.set(team, { team, played: 0, wins: 0, losses: 0, runsFor: 0, runsAgainst: 0, points: 0 });
      }
      const row = board.get(team);
      row.played += 1;
      row.runsFor += runsFor;
      row.runsAgainst += runsAgainst;
      if (won) {
        row.wins += 1;
        row.points += 2;
      } else {
        row.losses += 1;
      }
    };

    apply(home, homeRuns, awayRuns, homeRuns >= awayRuns);
    apply(away, awayRuns, homeRuns, awayRuns > homeRuns);
  });

  return Array.from(board.values())
    .sort((a, b) => b.points - a.points || (b.runsFor - b.runsAgainst) - (a.runsFor - a.runsAgainst))
    .slice(0, 8);
}

function renderCricketMomentumChart(events) {
  const canvas = qs("#cricketMomentumChart");
  if (!canvas || typeof Chart === "undefined") {
    return;
  }
  destroyCricketChart();

  const sample = (events || []).slice(0, 6).reverse();
  const labels = sample.map((event) => `${(event?.strHomeTeam || "Home").slice(0, 3)}-${(event?.strAwayTeam || "Away").slice(0, 3)}`);
  const runTotals = sample.map((event) => parseCricketRuns(event?.intHomeScore || event?.strHomeScore) + parseCricketRuns(event?.intAwayScore || event?.strAwayScore));

  state.cricket.momentumChart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Runs",
          data: runTotals,
          borderColor: "rgba(39, 180, 255, 0.95)",
          backgroundColor: "rgba(39, 180, 255, 0.2)",
          tension: 0.26,
          fill: true,
          pointRadius: 2,
          borderWidth: 2
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#d5ddef" } }
      },
      scales: {
        x: { ticks: { color: "#c7d0e2" }, grid: { color: "rgba(255,255,255,0.08)" } },
        y: { ticks: { color: "#c7d0e2" }, grid: { color: "rgba(255,255,255,0.08)" } }
      }
    }
  });
}

function renderFootballPointsChart(tableRows, leagueName) {
  const canvas = qs("#footballPointsChart");
  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  destroyFootballChart();

  const top = (tableRows || []).slice(0, 6);
  const labels = top.map((row) => row?.team?.name || "Team");
  const points = top.map((row) => toNum(row?.points));
  const goalDiff = top.map((row) => toNum(row?.goalsDiff));

  state.football.pointsChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Points",
          data: points,
          borderWidth: 1,
          borderColor: "rgba(33, 201, 107, 0.92)",
          backgroundColor: "rgba(33, 201, 107, 0.34)",
          borderRadius: 8,
          maxBarThickness: 28
        },
        {
          label: "Goal Diff",
          data: goalDiff,
          borderWidth: 1,
          borderColor: "rgba(84, 173, 255, 0.95)",
          backgroundColor: "rgba(84, 173, 255, 0.28)",
          borderRadius: 8,
          maxBarThickness: 28
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: "#d5ddef"
          }
        },
        title: {
          display: true,
          text: `${leagueName} Top 6 Momentum`,
          color: "#f6f8ff",
          font: {
            family: "Barlow",
            size: 14,
            weight: "600"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#c7d0e2"
          },
          grid: {
            color: "rgba(255,255,255,0.08)"
          }
        },
        y: {
          ticks: {
            color: "#c7d0e2"
          },
          grid: {
            color: "rgba(255,255,255,0.08)"
          }
        }
      }
    }
  });
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
  if (state.activeModule === "f1") {
    applyTeamAccentTheme(state.favoriteTeam);
  } else {
    applyTeamAccentTheme("");
  }
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
  const accent = TEAM_ACCENTS[teamName] || MODULE_ACCENTS[state.activeModule] || MODULE_ACCENTS.f1;
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
        <button class="prediction-row prediction-row-btn" type="button" data-prediction-driver="${escapeHtml(pick.id)}" data-prediction-confidence="${pick.probability.toFixed(1)}" aria-label="Open prediction detail for ${escapeHtml(pick.driverName)}">
          <div>
            <strong>P${idx + 1} ${escapeHtml(pick.driverName)} (${escapeHtml(pick.code)})</strong>
            <p>${escapeHtml(pick.teamName)}</p>
          </div>
          <div class="prediction-prob-wrap">
            <span>${pick.probability.toFixed(1)}%</span>
            <div class="prediction-prob-bar"><div style="width:${pct}%;"></div></div>
          </div>
        </button>
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
        <button class="data-item ${isActive ? "active" : ""}" data-driver-id="${id}" type="button" aria-label="Open driver insight for ${escapeHtml(driverName)}">
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
  return constructors
    .map((entry, index) => {
      const teamName = entry.Constructor.name;
      const logo = state.f1.teamLogoMap[teamName] || "";
      const wins = toNum(entry.wins);
      const points = toNum(entry.points);
      const standingLine = `${points} pts | ${wins} win${wins === 1 ? "" : "s"}`;
      const teamAccent = TEAM_ACCENTS[teamName] || "#8a93a8";
      const normalized = teamAccent.replace("#", "");
      const fullHex = normalized.length === 3
        ? normalized.split("").map((ch) => `${ch}${ch}`).join("")
        : normalized;
      const r = Number.parseInt(fullHex.slice(0, 2), 16);
      const g = Number.parseInt(fullHex.slice(2, 4), 16);
      const b = Number.parseInt(fullHex.slice(4, 6), 16);
      const accentRgb = Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)
        ? `${r}, ${g}, ${b}`
        : "138, 147, 168";
      const isActive = state.favoriteTeam
        ? state.favoriteTeam === teamName
        : index === 0;
      const fallbackCode = String(teamName || "TM")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "TM";

      return `
        <button class="data-item constructor-standing-item ${isActive ? "active" : ""}" style="--team-accent:${escapeHtml(teamAccent)};--team-accent-rgb:${escapeHtml(accentRgb)};" data-team-name="${escapeHtml(teamName)}" data-team-points="${escapeHtml(entry.points)}" data-team-wins="${escapeHtml(entry.wins)}" data-team-position="${escapeHtml(entry.position)}" type="button" aria-label="Open constructor insight for ${escapeHtml(teamName)}">
          <div class="constructor-standing-main">
            <span class="constructor-rank">#${escapeHtml(entry.position)}</span>
            <div class="constructor-copy">
              <strong>
                <span class="constructor-logo-chip">
                  ${logo ? `<img class="constructor-team-logo" src="${escapeHtml(logo)}" alt="${escapeHtml(teamName)}" loading="lazy" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none'" />` : ""}
                  <span class="constructor-logo-fallback">${escapeHtml(fallbackCode)}</span>
                </span>
                ${escapeHtml(teamName)}
              </strong>
              <span>${escapeHtml(standingLine)}</span>
            </div>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderTrackMap(circuitId) {
  const vectorLayoutId = CIRCUIT_VECTOR_LAYOUTS[circuitId] || "";
  if (vectorLayoutId) {
    const src = `${TRACK_VECTOR_BASE_URL}/${vectorLayoutId}.svg`;
    return `
      <div class="track-map card-entry vector-map">
        <img class="track-vector-image" src="${escapeHtml(src)}" alt="${escapeHtml(circuitId)} circuit vector" loading="lazy" />
      </div>
    `;
  }

  const path = getTrackPathByCircuit(circuitId);
  return `
    <div class="track-map card-entry">
      <svg viewBox="0 0 280 160" role="img" aria-label="Circuit mini map">
        <path class="track-line" d="${path}"></path>
      </svg>
    </div>
  `;
}

function renderPracticeStandouts(drivers) {
  const host = qs("#practiceStandouts");
  if (!host) {
    return;
  }

  if (!drivers?.length) {
    host.innerHTML = "<p class='empty-state'>Practice standouts unavailable right now.</p>";
    return;
  }

  const standouts = drivers
    .map((entry) => {
      const id = entry.Driver.driverId;
      const form = state.f1.recentFormMap[id] || [];
      const avgFinish = form.length ? form.reduce((sum, value) => sum + value, 0) / form.length : 14;
      const momentum = Math.max(0, 20 - avgFinish) + (toNum(entry.wins) * 0.4);
      const name = `${entry.Driver.givenName} ${entry.Driver.familyName}`;
      const code = entry.Driver.code || entry.Driver.familyName.slice(0, 3).toUpperCase();
      return {
        name,
        code,
        avgFinish,
        momentum,
        team: entry.Constructors?.[0]?.name || "Unknown Team"
      };
    })
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, 5);

  host.innerHTML = `
    <p class="inline-meta">Practice Watchlist (recent-form proxy): best average race pace over recent rounds.</p>
    <div class="practice-list">
      ${standouts.map((row, idx) => `
        <div class="practice-item">
          <span>P${idx + 1} ${escapeHtml(row.code)} • ${escapeHtml(row.name)}</span>
          <strong>${row.avgFinish.toFixed(1)} avg finish</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderSprintInsight(nextRace, trackTimeZone) {
  const host = qs("#sprintInsight");
  if (!host) {
    return;
  }

  const sprintDate = nextRace?.Sprint?.date;
  const sprintTime = nextRace?.Sprint?.time;
  const sprintShootoutDate = nextRace?.SprintQualifying?.date;
  const sprintShootoutTime = nextRace?.SprintQualifying?.time;
  const hasSprintWeekend = Boolean(sprintDate || sprintShootoutDate);

  if (!hasSprintWeekend) {
    host.innerHTML = `
      <p class="inline-meta">Sprint Racing Status</p>
      <p class="empty-state">No sprint race listed for this round. Standard weekend format applies.</p>
      <p class="inline-meta">Sprint weekends remain important for strategy pressure and reduced setup time.</p>
    `;
    return;
  }

  const sprintRace = formatEventTimeByMode(sprintDate, sprintTime, state.timezone, trackTimeZone);
  const shootout = formatEventTimeByMode(sprintShootoutDate, sprintShootoutTime, state.timezone, trackTimeZone);

  host.innerHTML = `
    <p class="inline-meta">Sprint Racing Status</p>
    <div class="sprint-note-box">
      <p><strong>Sprint Shootout:</strong> ${escapeHtml(shootout.dateLabel)} ${escapeHtml(shootout.timeLabel)} ${escapeHtml(shootout.zoneLabel)}</p>
      <p><strong>Sprint Race:</strong> ${escapeHtml(sprintRace.dateLabel)} ${escapeHtml(sprintRace.timeLabel)} ${escapeHtml(sprintRace.zoneLabel)}</p>
      <p class="inline-meta">Sprint format can reset race-weekend momentum and grid strategy.</p>
    </div>
  `;
}

function renderGridAfterQualifying(nextRace, qualifyingRows, resultRows) {
  const host = qs("#latestGridLayout");
  const hint = qs("#gridLaunchHint");
  if (!host) {
    return;
  }

  const qDate = nextRace?.Qualifying?.date;
  const qTime = nextRace?.Qualifying?.time;
  const qStamp = qDate ? new Date(`${qDate}T${qTime || "00:00:00Z"}`).getTime() : NaN;
  const qualifyingFinished = Number.isFinite(qStamp) && Date.now() >= qStamp;

  if (!qualifyingFinished) {
    host.innerHTML = "<p class='empty-state'>Starting grid unlocks once qualifying is complete.</p>";
    if (hint) {
      hint.textContent = "Grid locked until post-qualifying";
    }
    return;
  }

  if (!qualifyingRows?.length) {
    host.innerHTML = "<p class='empty-state'>Qualifying classification is syncing. Check back shortly.</p>";
    if (hint) {
      hint.textContent = "Awaiting official qualifying classification";
    }
    return;
  }

  host.innerHTML = renderStartingGridLayout(qualifyingRows, resultRows);
  if (hint) {
    hint.textContent = "Official qualifying grid. Click a slot to open circuit map.";
  }
}

function setupTrackViewOptions() {
  const views = {
    circuit: qs("#trackCircuitView"),
    practice: qs("#trackPracticeView"),
    sprint: qs("#trackSprintView")
  };
  const buttons = {
    circuit: qs("#viewCircuitBtn"),
    practice: qs("#viewPracticeBtn"),
    sprint: qs("#viewSprintBtn")
  };

  if (!views.circuit || !views.practice || !views.sprint || !buttons.circuit || !buttons.practice || !buttons.sprint) {
    return;
  }

  const activate = (key) => {
    Object.entries(views).forEach(([name, panel]) => {
      panel.classList.toggle("hidden", name !== key);
    });
    Object.entries(buttons).forEach(([name, button]) => {
      button.classList.toggle("active", name === key);
    });
  };

  buttons.circuit.onclick = () => {
    triggerMicroFeedback();
    activate("circuit");
  };
  buttons.practice.onclick = () => {
    triggerMicroFeedback();
    activate("practice");
  };
  buttons.sprint.onclick = () => {
    triggerMicroFeedback();
    activate("sprint");
  };

  activate("circuit");
}

function setupEventListToggle() {
  const button = qs("#toggleEventListBtn");
  const modal = qs("#eventListModal");
  const closeBtn = qs("#closeEventListModal");
  if (!button || !modal || !closeBtn) {
    return;
  }

  button.onclick = () => {
    modal.classList.remove("hidden");
    triggerMicroFeedback();
  };

  closeBtn.onclick = () => {
    modal.classList.add("hidden");
    triggerMicroFeedback();
  };

  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  };
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
      ? "Latest grid. Click any slot for circuit map."
      : "Grid available. Circuit map unavailable for this race.";
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

  const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weekStartMonday = (dateObj) => {
    const dt = new Date(dateObj);
    const day = dt.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    dt.setUTCDate(dt.getUTCDate() + diff);
    return dt;
  };

  const addDays = (dateObj, days) => {
    const dt = new Date(dateObj);
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt;
  };

  host.classList.add("weekly-calendar");
  host.innerHTML = races
    .map((race) => {
      const round = toNum(race.round);
      const isCompleted = round <= state.f1.seasonCompletedRound;
      const isActive = round === state.f1.expandedRound;
      const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
      const monday = Number.isNaN(raceDate.getTime()) ? null : weekStartMonday(raceDate);
      const weekDays = monday
        ? Array.from({ length: 7 }, (_, idx) => addDays(monday, idx))
        : [];
      const weekLabel = monday
        ? `${monday.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" })} - ${addDays(monday, 6).toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" })}`
        : "Week TBD";
      const formatted = formatEventTimeByMode(race.date, race.time, state.timezone, getTrackTimeZone(race));
      return `
        <button class="season-race-card ${isCompleted ? "completed" : "upcoming"} ${isActive ? "active" : ""}" data-race-round="${round}" type="button">
          <div class="weekly-head">
            <span class="kicker">Round ${round}</span>
            <span class="inline-meta">${escapeHtml(weekLabel)}</span>
          </div>
          <strong>${escapeHtml(race.raceName)}</strong>
          <span>${escapeHtml(race.Circuit?.Location?.locality || "Unknown")}</span>
          <div class="week-grid" aria-hidden="true">
            ${weekDays.map((day) => {
              const isRaceDay = race.date === day.toISOString().slice(0, 10);
              return `<span class="week-cell ${isRaceDay ? "race-day" : ""}"><em>${dayShort[(day.getUTCDay() + 6) % 7]}</em><strong>${day.toLocaleDateString("en-US", { day: "2-digit", timeZone: "UTC" })}</strong></span>`;
            }).join("")}
          </div>
          <span class="inline-meta">Race start: ${escapeHtml(formatted.dateLabel)} ${escapeHtml(formatted.timeLabel)} ${escapeHtml(formatted.zoneLabel)}</span>
        </button>
      `;
    })
    .join("");

  const selected = races.find((race) => toNum(race.round) === state.f1.expandedRound) || races[0];
  const trackTz = getTrackTimeZone(selected);
  const formatSession = (label, date, time, key) => {
    if (!date) {
      return null;
    }
    const formatted = formatEventTimeByMode(date, time, state.timezone, trackTz);
    const stamp = new Date(`${date}T${time || "00:00:00Z"}`).getTime();
    return {
      key,
      label,
      dateLabel: formatted.dateLabel,
      timeLabel: formatted.timeLabel,
      zoneLabel: formatted.zoneLabel,
      stamp: Number.isFinite(stamp) ? stamp : Number.MAX_SAFE_INTEGER
    };
  };

  const sessionRows = [
    formatSession("FP1", selected?.FirstPractice?.date, selected?.FirstPractice?.time, "fp1"),
    formatSession("FP2", selected?.SecondPractice?.date, selected?.SecondPractice?.time, "fp2"),
    formatSession("FP3", selected?.ThirdPractice?.date, selected?.ThirdPractice?.time, "fp3"),
    formatSession("Sprint Shootout", selected?.SprintQualifying?.date, selected?.SprintQualifying?.time, "sprint-shootout"),
    formatSession("Sprint", selected?.Sprint?.date, selected?.Sprint?.time, "sprint"),
    formatSession("Qualifying", selected?.Qualifying?.date, selected?.Qualifying?.time, "qualifying"),
    formatSession("Race", selected?.date, selected?.time, "race")
  ].filter(Boolean);

  const seenTimestamps = new Set();
  const timelineRows = sessionRows
    .sort((a, b) => a.stamp - b.stamp)
    .filter((row) => {
      const key = `${row.dateLabel}|${row.timeLabel}|${row.zoneLabel}`;
      if (row.key !== "race" && seenTimestamps.has(key)) {
        return false;
      }
      seenTimestamps.add(key);
      return true;
    });

  detail.innerHTML = `
    <div class="season-weekend">
      <strong>${escapeHtml(selected?.raceName || "Selected Race")}</strong>
      <p>${escapeHtml(selected?.Circuit?.circuitName || "Circuit TBD")} • ${escapeHtml(selected?.Circuit?.Location?.country || "")}</p>
      <div class="season-session-list">
        ${timelineRows.length
          ? timelineRows
            .map((row) => `<p><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.dateLabel)} ${escapeHtml(row.timeLabel)} ${escapeHtml(row.zoneLabel)}</strong></p>`)
            .join("")
          : "<p class='empty-state'>Weekend session schedule is not available for this round yet.</p>"}
      </div>
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
      <div class="footer-grid-head"><h4>My Sports</h4></div>
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
        new Notification("Sports Dashboard Reminder", {
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
      "PRODID:-//Sports Dashboard//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@sports-dashboard`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${new Date(startIso).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTEND:${endIso.replace(/[-:]/g, "").split(".")[0]}Z`,
      `SUMMARY:${nextRace.raceName}`,
      `DESCRIPTION:Formula 1 race reminder from Sports Dashboard`,
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
  if (!raceDateIso) {
    return;
  }

  const raceStart = new Date(raceDateIso).getTime();
  const raceEnd = raceStart + 1000 * 60 * 60 * 2;
  const countdownEl = qs("#hudCountdown");
  const noteEl = qs("#nextRaceCountdownText");
  const daysEl = qs("#countdownDays");
  const hoursEl = qs("#countdownHours");
  const minutesEl = qs("#countdownMinutes");
  const secondsEl = qs("#countdownSeconds");

  const countdownParts = () => {
    const now = Date.now();
    const diff = Math.max(0, raceStart - now);
    const dayMs = 1000 * 60 * 60 * 24;
    const hourMs = 1000 * 60 * 60;
    const minuteMs = 1000 * 60;
    const secondMs = 1000;

    const days = Math.floor(diff / dayMs);
    const hours = Math.floor((diff % dayMs) / hourMs);
    const minutes = Math.floor((diff % hourMs) / minuteMs);
    const seconds = Math.floor((diff % minuteMs) / secondMs);

    return { days, hours, minutes, seconds };
  };

  const update = () => {
    const countdownText = formatCountdown(raceDateIso);
    if (countdownEl) {
      countdownEl.textContent = countdownText;
    }
    if (noteEl) {
      noteEl.textContent = countdownText;
    }

    const parts = countdownParts();
    if (daysEl) {
      daysEl.textContent = String(parts.days);
    }
    if (hoursEl) {
      hoursEl.textContent = String(parts.hours).padStart(2, "0");
    }
    if (minutesEl) {
      minutesEl.textContent = String(parts.minutes).padStart(2, "0");
    }
    if (secondsEl) {
      secondsEl.textContent = String(parts.seconds).padStart(2, "0");
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
  const refs = getInsightModalRefs();
  if (!refs) {
    return;
  }

  refs.closeBtn.onclick = () => {
    refs.modal.classList.add("hidden");
    if (state.f1.insightChart) {
      state.f1.insightChart.destroy();
      state.f1.insightChart = null;
    }
    triggerMicroFeedback();
  };

  refs.modal.onclick = (event) => {
    if (event.target === refs.modal) {
      refs.modal.classList.add("hidden");
      if (state.f1.insightChart) {
        state.f1.insightChart.destroy();
        state.f1.insightChart = null;
      }
    }
  };

  qsa("[data-driver-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const driverId = button.dataset.driverId;
      const driver = state.f1.drivers.find((entry) => entry.Driver.driverId === driverId);
      if (!driver) {
        return;
      }

      const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
      const teamName = driver.Constructors?.[0]?.name || "Unknown Team";
      const recentForm = (state.f1.recentFormMap[driverId] || []).slice(-3);
      const recentFormText = recentForm.length ? recentForm.map((value, idx) => `R-${recentForm.length - idx}: ${toNum(value)} pts`).join(" | ") : "Recent form unavailable";
      const age = driver.Driver.dateOfBirth
        ? Math.max(0, new Date().getUTCFullYear() - new Date(driver.Driver.dateOfBirth).getUTCFullYear())
        : null;

      const content = `
        <div class="insight-grid">
          <p><span>Team</span><strong>${escapeHtml(teamName)}</strong></p>
          <p><span>Championship Rank</span><strong>P${escapeHtml(driver.position)}</strong></p>
          <p><span>Points</span><strong>${escapeHtml(driver.points)}</strong></p>
          <p><span>Wins</span><strong>${escapeHtml(driver.wins)}</strong></p>
          <p><span>Nationality</span><strong>${escapeHtml(driver.Driver.nationality || "Unknown")}</strong></p>
          <p><span>Age</span><strong>${escapeHtml(age ? String(age) : "N/A")}</strong></p>
          <p><span>Date of Birth</span><strong>${escapeHtml(driver.Driver.dateOfBirth || "N/A")}</strong></p>
          <p><span>Value Index</span><strong>${escapeHtml(computeValueIndex(driver))}</strong></p>
        </div>
        <div class="insight-chart-wrap">
          <canvas id="insightChartCanvas" aria-label="Driver performance chart"></canvas>
        </div>
        <p class="insight-note">Recent form: ${escapeHtml(recentFormText)}</p>
      `;

      openInsightModal(`${driverName} • Driver Insight`, content);

      try {
        const trajectory = await fetchDriverTrajectory(driverId);
        const labels = (trajectory?.labels || []).slice(-8);
        const values = (trajectory?.values || []).slice(-8);

        if (labels.length >= 2 && values.length >= 2) {
          renderInsightChart({
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Cumulative Points",
                  data: values,
                  borderColor: "#e10600",
                  backgroundColor: "rgba(225, 6, 0, 0.18)",
                  tension: 0.24,
                  fill: true,
                  pointRadius: 2,
                  borderWidth: 2
                }
              ]
            },
            options: {
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: "#1f2430" }
                }
              },
              scales: {
                x: {
                  ticks: { color: "#2b3140" },
                  grid: { color: "rgba(0,0,0,0.08)" }
                },
                y: {
                  ticks: { color: "#2b3140" },
                  grid: { color: "rgba(0,0,0,0.08)" }
                }
              }
            }
          });
          return;
        }
      } catch (error) {
        // Fallback chart below if trajectory fetch fails.
      }

      const fallbackForm = (state.f1.recentFormMap[driverId] || []).slice(-3);
      renderInsightChart({
        type: "bar",
        data: {
          labels: ["R-3", "R-2", "R-1"],
          datasets: [
            {
              label: "Recent Points",
              data: [
                toNum(fallbackForm[0] ?? 0),
                toNum(fallbackForm[1] ?? 0),
                toNum(fallbackForm[2] ?? 0)
              ],
              backgroundColor: ["rgba(225, 6, 0, 0.88)", "rgba(255, 126, 63, 0.82)", "rgba(255, 205, 86, 0.82)"],
              borderRadius: 8
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#1f2430" }
            }
          },
          scales: {
            x: {
              ticks: { color: "#2b3140" },
              grid: { color: "rgba(0,0,0,0.08)" }
            },
            y: {
              beginAtZero: true,
              ticks: { color: "#2b3140" },
              grid: { color: "rgba(0,0,0,0.08)" }
            }
          }
        }
      });
    });
  });

  qsa("[data-team-name]").forEach((button) => {
    button.addEventListener("click", () => {
      const teamName = button.dataset.teamName || "Unknown Team";
      const points = button.dataset.teamPoints || "0";
      const wins = button.dataset.teamWins || "0";
      const position = button.dataset.teamPosition || "-";
      const roster = state.f1.drivers
        .filter((entry) => (entry.Constructors?.[0]?.name || "") === teamName)
        .slice(0, 2)
        .map((entry) => `${entry.Driver.givenName} ${entry.Driver.familyName} (P${entry.position})`)
        .join(" • ") || "Roster details unavailable";
      const budget = TEAM_BUDGET_MILLIONS[teamName] ? `$${TEAM_BUDGET_MILLIONS[teamName]}M` : "N/A";

      const content = `
        <div class="insight-grid">
          <p><span>Constructor Rank</span><strong>P${escapeHtml(position)}</strong></p>
          <p><span>Championship Points</span><strong>${escapeHtml(points)}</strong></p>
          <p><span>Race Wins</span><strong>${escapeHtml(wins)}</strong></p>
          <p><span>Estimated Budget</span><strong>${escapeHtml(budget)}</strong></p>
        </div>
        <div class="insight-chart-wrap">
          <canvas id="insightChartCanvas" aria-label="Constructor standings chart"></canvas>
        </div>
        <p class="insight-note">Top drivers: ${escapeHtml(roster)}</p>
      `;

      openInsightModal(`${teamName} • Team Insight`, content);

      const topConstructors = (state.f1.constructors || []).slice(0, 8);
      const labels = topConstructors.map((entry) => entry.Constructor.name);
      const pointsData = topConstructors.map((entry) => toNum(entry.points));
      const colors = labels.map((label) => label === teamName ? "rgba(225, 6, 0, 0.9)" : "rgba(77, 137, 255, 0.65)");

      renderInsightChart({
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Championship Points",
              data: pointsData,
              backgroundColor: colors,
              borderRadius: 8,
              maxBarThickness: 28
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#1f2430" }
            }
          },
          scales: {
            x: {
              ticks: {
                color: "#2b3140",
                callback(value) {
                  const label = this.getLabelForValue(value);
                  return String(label).slice(0, 12);
                }
              },
              grid: { color: "rgba(0,0,0,0.08)" }
            },
            y: {
              beginAtZero: true,
              ticks: { color: "#2b3140" },
              grid: { color: "rgba(0,0,0,0.08)" }
            }
          }
        }
      });
    });
  });
}

function setupPredictionInsightEvents(prediction, drivers) {
  if (!prediction?.picks?.length) {
    return;
  }

  qsa("[data-prediction-driver]").forEach((button) => {
    button.onclick = () => {
      const driverId = button.getAttribute("data-prediction-driver") || "";
      const confidence = button.getAttribute("data-prediction-confidence") || "0";
      const row = prediction.picks.find((pick) => pick.id === driverId);
      const driver = (drivers || []).find((entry) => entry.Driver.driverId === driverId);
      if (!row || !driver) {
        return;
      }

      const detail = `
        <div class="insight-grid">
          <p><span>Driver</span><strong>${escapeHtml(row.driverName)} (${escapeHtml(row.code)})</strong></p>
          <p><span>Team</span><strong>${escapeHtml(row.teamName)}</strong></p>
          <p><span>Prediction Confidence</span><strong>${escapeHtml(confidence)}%</strong></p>
          <p><span>Current Championship</span><strong>P${escapeHtml(driver.position)} • ${escapeHtml(driver.points)} pts</strong></p>
          <p><span>Wins</span><strong>${escapeHtml(driver.wins)}</strong></p>
          <p><span>Form Signal</span><strong>${(row.formNorm * 100).toFixed(1)}%</strong></p>
          <p><span>Track History Signal</span><strong>${(row.trackNorm * 100).toFixed(1)}%</strong></p>
          <p><span>Season Strength</span><strong>${(row.currentPointsNorm * 100).toFixed(1)}%</strong></p>
        </div>
        <div class="insight-chart-wrap">
          <canvas id="insightChartCanvas" aria-label="Prediction model signal chart"></canvas>
        </div>
      `;

      openInsightModal(`${row.driverName} • Prediction Breakdown`, detail);

      renderInsightChart({
        type: "bar",
        data: {
          labels: ["Season", "Wins", "Form", "History", "Track"],
          datasets: [
            {
              label: "Signal Strength %",
              data: [
                Number((row.currentPointsNorm * 100).toFixed(1)),
                Number((row.winsNorm * 100).toFixed(1)),
                Number((row.formNorm * 100).toFixed(1)),
                Number((row.historyNorm * 100).toFixed(1)),
                Number((row.trackNorm * 100).toFixed(1))
              ],
              backgroundColor: [
                "rgba(225, 6, 0, 0.88)",
                "rgba(255, 88, 88, 0.84)",
                "rgba(255, 126, 63, 0.82)",
                "rgba(255, 179, 71, 0.82)",
                "rgba(255, 205, 86, 0.82)"
              ],
              borderRadius: 8,
              maxBarThickness: 30
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#1f2430" }
            }
          },
          scales: {
            x: {
              ticks: { color: "#2b3140" },
              grid: { color: "rgba(0,0,0,0.08)" }
            },
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: "#2b3140" },
              grid: { color: "rgba(0,0,0,0.08)" }
            }
          }
        }
      });
    };
  });
}

function setupHeadToHeadEvents() {
  const compareBtn = qs("#compareBtn");
  const swapBtn = qs("#swapCompareBtn");
  const autoToggle = qs("#autoCompareToggle");
  const aSelect = qs("#driverA");
  const bSelect = qs("#driverB");
  const highlights = qs("#comparisonHighlights");
  const output = qs("#comparisonResult");

  if (!compareBtn || !aSelect || !bSelect || !output || !highlights) {
    return;
  }

  const runCompare = async () => {
    if (!aSelect.value || !bSelect.value || aSelect.value === bSelect.value) {
      output.innerHTML = "<p class='empty-state'>Choose two different drivers for comparison.</p>";
      highlights.innerHTML = "";
      return;
    }

    triggerMicroFeedback();
    output.innerHTML = "<p class='empty-state'>Comparing pace and finish metrics...</p>";
    highlights.innerHTML = "";

    try {
      const metrics = await fetchDriverComparison(aSelect.value, bSelect.value);
      const paceWinner = toNum(metrics.a.avgFinish) < toNum(metrics.b.avgFinish) ? aSelect.value.toUpperCase() : bSelect.value.toUpperCase();
      const pointsWinner = toNum(metrics.a.avgPoints) > toNum(metrics.b.avgPoints) ? aSelect.value.toUpperCase() : bSelect.value.toUpperCase();
      const consistencyWinner = toNum(metrics.a.top10Rate) > toNum(metrics.b.top10Rate) ? aSelect.value.toUpperCase() : bSelect.value.toUpperCase();
      const aggressionA = (toNum(metrics.a.wins) * 3) + toNum(metrics.a.podiums);
      const aggressionB = (toNum(metrics.b.wins) * 3) + toNum(metrics.b.podiums);
      const attackWinner = aggressionA >= aggressionB ? aSelect.value.toUpperCase() : bSelect.value.toUpperCase();
      const aName = aSelect.options[aSelect.selectedIndex]?.textContent || aSelect.value.toUpperCase();
      const bName = bSelect.options[bSelect.selectedIndex]?.textContent || bSelect.value.toUpperCase();

      highlights.innerHTML = `
        <div class="compare-chip"><span>Pace Edge</span><strong>${escapeHtml(paceWinner)}</strong></div>
        <div class="compare-chip"><span>Points Form</span><strong>${escapeHtml(pointsWinner)}</strong></div>
        <div class="compare-chip"><span>Top-10 Consistency</span><strong>${escapeHtml(consistencyWinner)}</strong></div>
        <div class="compare-chip"><span>Racecraft Index</span><strong>${escapeHtml(attackWinner)}</strong></div>
      `;

      output.innerHTML = `
        <p class="inline-meta">${escapeHtml(aName)} vs ${escapeHtml(bName)} • season-wide metrics</p>
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
        <p class="inline-meta">Pace edge: ${paceWinner} | Points consistency: ${pointsWinner} | Top-10 consistency: ${consistencyWinner}</p>
      `;
    } catch (error) {
      highlights.innerHTML = "";
      output.innerHTML = "<p class='empty-state'>Comparison failed. Try another pair.</p>";
    }
  };

  compareBtn.onclick = runCompare;

  if (swapBtn) {
    swapBtn.onclick = () => {
      const currentA = aSelect.value;
      aSelect.value = bSelect.value;
      bSelect.value = currentA;
      triggerMicroFeedback();
      if (autoToggle?.checked) {
        runCompare();
      }
    };
  }

  const onSelectionChange = () => {
    if (autoToggle?.checked) {
      runCompare();
    }
  };
  aSelect.onchange = onSelectionChange;
  bSelect.onchange = onSelectionChange;

  runCompare();
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

function getInsightModalRefs() {
  const modal = qs("#insightModal");
  const closeBtn = qs("#closeInsightModal");
  const titleEl = qs("#insightModalTitle");
  const bodyEl = qs("#insightModalBody");
  if (!modal || !closeBtn || !titleEl || !bodyEl) {
    return null;
  }
  return { modal, closeBtn, titleEl, bodyEl };
}

function openInsightModal(title, content) {
  const refs = getInsightModalRefs();
  if (!refs) {
    return;
  }
  bindInsightModalClose();
  if (state.f1.insightChart) {
    state.f1.insightChart.destroy();
    state.f1.insightChart = null;
  }
  refs.titleEl.textContent = title;
  refs.bodyEl.innerHTML = content;
  refs.modal.classList.remove("hidden");
  triggerMicroFeedback();
}

function renderInsightChart(config) {
  const canvas = qs("#insightChartCanvas");
  if (!canvas || !config) {
    return;
  }
  if (state.f1.insightChart) {
    state.f1.insightChart.destroy();
  }
  state.f1.insightChart = new Chart(canvas, config);
}

function renderF1Skeleton() {
  const grid = qs("#dashboardGrid");
  grid.classList.add("f1-layout");
  grid.innerHTML = `
    <section class="top-duo">
      <article class="glass-card card-entry next-race-card">
        <h3 class="card-title">Next F1 Event Weekend <span class="card-title-actions"><span class="inline-meta" id="raceMeta">Syncing...</span><button id="toggleEventListBtn" class="small-btn" type="button">Open Weekly Calendar</button></span></h3>
        <div class="weekend-hero">
          <p class="kicker" id="nextRaceCircuit">Circuit loading...</p>
          <strong id="nextRaceName">Grand Prix loading...</strong>
          <p class="race-countdown-xl" id="nextRaceStart">--</p>
          <div class="countdown-rack" aria-label="Race countdown">
            <div class="countdown-box">
              <span id="countdownDays" class="countdown-value">--</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-box">
              <span id="countdownHours" class="countdown-value">--</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-box">
              <span id="countdownMinutes" class="countdown-value">--</span>
              <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-box">
              <span id="countdownSeconds" class="countdown-value">--</span>
              <span class="countdown-label">Seconds</span>
            </div>
          </div>
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
        <div class="track-view-switch" role="tablist" aria-label="Track data views">
          <button id="viewCircuitBtn" class="small-btn" type="button">Circuit & Grid</button>
          <button id="viewPracticeBtn" class="small-btn" type="button">Practice Standouts</button>
          <button id="viewSprintBtn" class="small-btn" type="button">Sprint Racing</button>
        </div>

        <div id="trackCircuitView">
          <div class="track-mockup-wrap">
            <p class="inline-meta" id="trackLayoutHint">Circuit Vector • Source: julesr0y/f1-circuits-svg (CC BY 4.0)</p>
            <div id="raceTrackLayout"></div>
          </div>
          <div class="grid-panel-wrap">
            <p class="inline-meta">Starting Grid</p>
            <div id="latestGridLayout"></div>
          </div>
        </div>

        <div id="trackPracticeView" class="hidden">
          <div id="practiceStandouts">
            <p class="empty-state">Loading practice standouts...</p>
          </div>
        </div>

        <div id="trackSprintView" class="hidden">
          <div id="sprintInsight">
            <p class="empty-state">Loading sprint racing context...</p>
          </div>
        </div>
      </article>
    </section>

    <section class="insight-strip">
      <article class="glass-card card-entry priority-card">
        <h3 class="card-title">Race Predictor <span class="inline-meta">AI Model</span></h3>
        <div id="racePredictionPanel">
          <p class="empty-state">Calculating probabilities...</p>
        </div>
      </article>

      <article class="glass-card card-entry priority-card support-driver-card">
        <h3 class="card-title">Supporting Driver and Team</h3>
        <div id="profileStats" class="stats-row"></div>
        <div id="supportingInfo" class="supporting-info-grid">
          <p class="empty-state">Loading driver and team intelligence...</p>
        </div>
      </article>
    </section>

    <section class="standings-compare-row">
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
      </article>

      <article class="glass-card card-entry headtohead-card">
        <h3 class="card-title">Head-to-Head</h3>
        <div class="split" style="margin-bottom:0.5rem;">
          <select id="driverA" class="select-input"></select>
          <select id="driverB" class="select-input"></select>
        </div>
        <div class="headtohead-tools">
          <button id="swapCompareBtn" class="small-btn" type="button">Swap Drivers</button>
          <label class="headtohead-auto"><input id="autoCompareToggle" type="checkbox" checked /> Auto compare</label>
        </div>
        <button id="compareBtn" class="small-btn" style="width:100%">Compare Pace</button>
        <div id="comparisonHighlights" class="comparison-highlights"></div>
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

    <div id="eventListModal" class="map-modal hidden" role="dialog" aria-modal="true" aria-label="Formula 1 weekly race calendar">
      <div class="map-modal-card glass-card event-list-modal-card">
        <div class="map-modal-head">
          <h3 class="card-title" style="margin:0;">F1 Weekly Race Calendar</h3>
          <button id="closeEventListModal" class="small-btn">Close</button>
        </div>
        <div class="integrated-roadmap modal-roadmap">
          <div id="seasonCalendarStrip" class="season-calendar-strip">
            <p class="empty-state">Loading season roadmap...</p>
          </div>
          <div id="seasonCalendarDetail" class="season-calendar-detail"></div>
        </div>
      </div>
    </div>

    <div id="insightModal" class="map-modal hidden" role="dialog" aria-modal="true" aria-label="Driver and team insight">
      <div class="map-modal-card glass-card insight-modal-card">
        <div class="map-modal-head">
          <h3 class="card-title" id="insightModalTitle" style="margin:0;">Insight</h3>
          <button id="closeInsightModal" class="small-btn" type="button">Close</button>
        </div>
        <div id="insightModalBody" class="knowledge-output"></div>
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
      nextRaceStartEl.textContent = `${raceTimeMode.dateLabel} ${raceTimeMode.timeLabel} ${raceTimeMode.zoneLabel}`;
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
    renderPracticeStandouts(drivers);
    renderSprintInsight(nextRace, trackTimeZone);
    setupTrackViewOptions();

    renderSeasonCalendar(seasonCalendar);
    setupSeasonCalendarEvents(seasonCalendar);
    setupEventListToggle();

    renderGridAfterQualifying(nextRace, lastQualifying, lastRaceResults);
    setupGridMapLauncher(lat, lon, circuitName);

    qs("#driverStandings").innerHTML = renderStandingsList(drivers);
    setupDriverListEvents();
    setupStandingsExpandControl();
    setupCurrentStandingToggle();
    renderCurrentStandingView();

    const seasonYear = nextRace?.season ? Number(nextRace.season) : new Date().getUTCFullYear();
    const prediction = await buildRacePrediction(drivers, nextRace, seasonYear);
    renderRacePrediction(prediction);
    setupPredictionInsightEvents(prediction, drivers);

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
    const staleProfileHero = qs("#profileHero");
    if (staleProfileHero) {
      staleProfileHero.remove();
    }
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

    const infoHost = qs("#supportingInfo");
    const selectedDriverId = selectedDriver?.Driver?.driverId || "";
    const teammate = drivers.find((entry) => {
      const isSameTeam = (entry.Constructors?.[0]?.name || "") === selectedTeamName;
      const isDifferentDriver = entry.Driver.driverId !== selectedDriverId;
      return isSameTeam && isDifferentDriver;
    });
    const constructorEntry = constructors.find((entry) => entry.Constructor.name === selectedTeamName);
    const constructorLeaderPoints = toNum(constructors?.[0]?.points) || 1;
    const constructorPoints = toNum(constructorEntry?.points);
    const teamGap = Math.max(0, constructorLeaderPoints - constructorPoints);
    const teamPointsShare = constructorPoints > 0 ? ((constructorPoints / constructorLeaderPoints) * 100).toFixed(1) : "0.0";
    const selectedDriverAge = selectedDriver?.Driver?.dateOfBirth
      ? String(Math.max(0, new Date().getUTCFullYear() - new Date(selectedDriver.Driver.dateOfBirth).getUTCFullYear()))
      : "N/A";
    const recentForm = (state.f1.recentFormMap[selectedDriverId] || []).slice(-3);
    const recentFormTotal = recentForm.reduce((sum, value) => sum + toNum(value), 0);
    const recentFormLine = recentForm.length
      ? `R-3 ${toNum(recentForm[0] ?? 0)} • R-2 ${toNum(recentForm[1] ?? 0)} • R-1 ${toNum(recentForm[2] ?? 0)}`
      : "Recent rounds pending";

    if (infoHost) {
      infoHost.innerHTML = `
        <article class="support-info-card">
          <p class="kicker">Driver Intelligence</p>
          <p><span>Code</span><strong>${escapeHtml(selectedCode || "N/A")}</strong></p>
          <p><span>Nationality</span><strong>${escapeHtml(selectedDriver?.Driver?.nationality || "N/A")}</strong></p>
          <p><span>Age</span><strong>${escapeHtml(selectedDriverAge)}</strong></p>
          <p><span>Career URL</span><strong>${selectedDriver?.Driver?.url ? `<a href="${escapeHtml(selectedDriver.Driver.url)}" target="_blank" rel="noopener noreferrer">Profile</a>` : "N/A"}</strong></p>
          <p><span>Last 3 Rounds</span><strong>${escapeHtml(recentFormLine)}</strong></p>
          <p><span>Last 3 Total</span><strong>${escapeHtml(String(recentFormTotal))} pts</strong></p>
        </article>
        <article class="support-info-card">
          <p class="kicker">Team Intelligence</p>
          <p><span>Constructor Rank</span><strong>P${escapeHtml(constructorEntry?.position || "-")}</strong></p>
          <p><span>Constructor Points</span><strong>${escapeHtml(String(constructorPoints || 0))} pts</strong></p>
          <p><span>Points Gap to Leader</span><strong>${escapeHtml(String(teamGap))} pts</strong></p>
          <p><span>Championship Share</span><strong>${escapeHtml(teamPointsShare)}%</strong></p>
          <p><span>Race Wins</span><strong>${escapeHtml(constructorEntry?.wins || "0")}</strong></p>
          <p><span>Teammate</span><strong>${escapeHtml(teammate ? `${teammate.Driver.givenName} ${teammate.Driver.familyName}` : "N/A")}</strong></p>
        </article>
      `;
    }
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

async function renderFootball() {
  const grid = qs("#dashboardGrid");
  grid.classList.remove("f1-layout");
  grid.innerHTML = "";
  destroyFootballChart();
  setLoadingState(true);
  updateLiveHUD({
    raceName: "Loading football intelligence",
    localTime: "Syncing",
    countdown: "Fetching fixtures",
    weather: "Syncing",
    seasonCompleted: 0,
    seasonTotal: 0
  });

  try {
    const featuredLeague = FOOTBALL_LEAGUES.find((league) => league.id === state.football.featuredLeagueId) || FOOTBALL_LEAGUES[0];
    const timezoneForApi = state.timezone === "TRACK_AUTO" ? "UTC" : (state.timezone || "Asia/Kolkata");
    const standingsPack = await fetchFootballStandingsWithFallback(featuredLeague.id, state.football.season);
    const resolvedSeason = standingsPack.season;
    const standingsTable = standingsPack.table;

    const [fixturesData, scorersData, liveData, leaguePulseData] = await Promise.all([
      fetchFootballJSON("/fixtures", {
        league: featuredLeague.id,
        next: 8,
        timezone: timezoneForApi
      }),
      fetchFootballJSON("/players/topscorers", {
        league: featuredLeague.id,
        season: resolvedSeason
      }),
      fetchFootballJSON("/fixtures", {
        live: "all",
        timezone: timezoneForApi
      }),
      Promise.allSettled(
        FOOTBALL_LEAGUES.map((league) => fetchFootballStandingsWithFallback(league.id, resolvedSeason))
      )
    ]);

    let upcomingFixtures = fixturesData?.response || [];
    if (!upcomingFixtures.length) {
      const fallbackFixtures = await fetchFootballJSON("/fixtures", {
        league: featuredLeague.id,
        season: resolvedSeason,
        timezone: timezoneForApi
      });
      upcomingFixtures = (fallbackFixtures?.response || []).slice(-8).reverse();
    }
    const topScorers = (scorersData?.response || []).slice(0, 6);
    const liveFixtures = liveData?.response || [];
    const leader = standingsTable[0] || null;
    const nextFixture = upcomingFixtures[0] || null;
    const topScorer = topScorers[0] || null;
    const roundsPlayed = Math.max(...standingsTable.map((row) => toNum(row?.all?.played)), 0);
    const seasonTotal = Math.max(roundsPlayed, 38);
    const nowLabel = footballKickoffLabel(new Date().toISOString());

    state.football.standings = standingsTable;
    state.football.upcomingFixtures = upcomingFixtures;
    state.football.topScorers = topScorers;
    state.football.liveFixtures = liveFixtures;
    state.football.lastUpdated = new Date().toISOString();
    state.football.season = resolvedSeason;

    const tickerItems = [
      `${featuredLeague.name} season ${resolvedSeason}/${resolvedSeason + 1}`,
      leader ? `Leader ${leader.team.name} (${leader.points} pts)` : "Leader unavailable",
      topScorer ? `Golden Boot: ${topScorer.player.name} (${topScorer.statistics?.[0]?.goals?.total || 0})` : "Top scorer unavailable",
      nextFixture
        ? `${nextFixture.teams.home.name} vs ${nextFixture.teams.away.name} • ${footballKickoffLabel(nextFixture.fixture.date)}`
        : "Next fixture unavailable",
      `${liveFixtures.length} live fixtures across monitored leagues`
    ];

    updateLiveHUD({
      raceName: `${featuredLeague.name} Command Center`,
      country: featuredLeague.country,
      localTime: nowLabel,
      countdown: nextFixture?.fixture?.date ? formatCountdown(nextFixture.fixture.date) : "Kickoff TBD",
      weather: `${liveFixtures.length} live fixtures`,
      seasonCompleted: roundsPlayed,
      seasonTotal,
      tickerItems
    });

    const cards = [
      {
        title: "Live Match Centers",
        value: String(liveFixtures.length),
        subtitle: "Matches currently in play"
      },
      {
        title: "League Leader",
        value: leader?.team?.name || "Pending",
        subtitle: leader ? `${leader.points} pts | GD ${leader.goalsDiff > 0 ? "+" : ""}${leader.goalsDiff}` : "Waiting for standings"
      },
      {
        title: "Next Kickoff",
        value: nextFixture ? `${nextFixture.teams.home.name} vs ${nextFixture.teams.away.name}` : "Fixture pending",
        subtitle: nextFixture ? footballKickoffLabel(nextFixture.fixture.date) : "No upcoming fixture"
      },
      {
        title: "Golden Boot Leader",
        value: topScorer?.player?.name || "No data",
        subtitle: topScorer ? `${topScorer.statistics?.[0]?.goals?.total || 0} goals` : "Scorer feed unavailable"
      }
    ];

    const statWrap = document.createElement("section");
    statWrap.className = "card-span-12 stats-row football-stats-row";
    cards.forEach((card) => statWrap.appendChild(createStatCard(card)));
    grid.appendChild(statWrap);

    const standingsRows = standingsTable.slice(0, 8).map((row) => {
      const form = String(row.form || "").slice(-5).split("").filter(Boolean);
      const formBadges = form.map((result) => {
        const tone = result === "W" ? "win" : result === "D" ? "draw" : "loss";
        return `<span class="football-form-pill ${tone}">${escapeHtml(result)}</span>`;
      }).join("");

      return `
        <button class="football-standings-row" type="button" data-football-team-id="${escapeHtml(String(row.team?.id || ""))}" data-football-team-name="${escapeHtml(row.team?.name || "")}" data-football-rank="${escapeHtml(String(row.rank || ""))}" data-football-points="${escapeHtml(String(row.points || ""))}" data-football-gd="${escapeHtml(String(row.goalsDiff || ""))}" data-football-form="${escapeHtml(String(row.form || ""))}" data-football-win="${escapeHtml(String(row.all?.win || "0"))}" data-football-draw="${escapeHtml(String(row.all?.draw || "0"))}" data-football-loss="${escapeHtml(String(row.all?.lose || "0"))}" data-football-gf="${escapeHtml(String(row.all?.goals?.for || "0"))}" data-football-ga="${escapeHtml(String(row.all?.goals?.against || "0"))}" aria-label="Open analytics for ${escapeHtml(row.team?.name || "team")}">
          <span class="football-rank">${escapeHtml(String(row.rank || "-"))}</span>
          <span class="football-team">
            <img src="${escapeHtml(row.team?.logo || "")}" alt="${escapeHtml(row.team?.name || "Team")}" loading="lazy" onerror="this.style.display='none'" />
            <strong>${escapeHtml(row.team?.name || "Team")}</strong>
          </span>
          <span class="football-points">${escapeHtml(String(row.points || 0))}</span>
          <span class="football-gd">${toNum(row.goalsDiff) > 0 ? "+" : ""}${escapeHtml(String(row.goalsDiff || 0))}</span>
          <span class="football-form">${formBadges || "--"}</span>
        </button>
      `;
    }).join("");

    const fixtureRows = upcomingFixtures.slice(0, 6).map((match) => {
      const statusLong = match?.fixture?.status?.long || "Scheduled";
      const venue = match?.fixture?.venue?.name || "Venue TBA";
      const round = match?.league?.round || "Round TBD";
      return `
        <button class="football-fixture-row" data-football-fixture-id="${escapeHtml(String(match?.fixture?.id || ""))}" data-football-home-id="${escapeHtml(String(match?.teams?.home?.id || ""))}" data-football-away-id="${escapeHtml(String(match?.teams?.away?.id || ""))}" data-football-home-name="${escapeHtml(match?.teams?.home?.name || "")}" data-football-away-name="${escapeHtml(match?.teams?.away?.name || "")}" data-football-kickoff="${escapeHtml(match?.fixture?.date || "")}" data-football-venue="${escapeHtml(venue)}" data-football-round="${escapeHtml(round)}" data-football-status="${escapeHtml(statusLong)}" type="button" aria-label="${escapeHtml(match.teams.home.name)} versus ${escapeHtml(match.teams.away.name)}">
          <div class="football-fixture-main">
            <div class="football-team-inline">
              <img src="${escapeHtml(match.teams.home.logo || "")}" alt="${escapeHtml(match.teams.home.name)}" loading="lazy" onerror="this.style.display='none'" />
              <span>${escapeHtml(match.teams.home.name)}</span>
            </div>
            <span class="football-vs">vs</span>
            <div class="football-team-inline away">
              <span>${escapeHtml(match.teams.away.name)}</span>
              <img src="${escapeHtml(match.teams.away.logo || "")}" alt="${escapeHtml(match.teams.away.name)}" loading="lazy" onerror="this.style.display='none'" />
            </div>
          </div>
          <p>${escapeHtml(footballKickoffLabel(match.fixture.date))}</p>
          <p class="inline-meta">${escapeHtml(statusLong)} | ${escapeHtml(venue)}</p>
        </button>
      `;
    }).join("");

    const scorerRows = topScorers.map((entry, idx) => {
      const goals = entry?.statistics?.[0]?.goals?.total || 0;
      const assists = entry?.statistics?.[0]?.goals?.assists || 0;
      const shots = entry?.statistics?.[0]?.shots?.total || 0;
      const shotsOn = entry?.statistics?.[0]?.shots?.on || 0;
      const penalties = entry?.statistics?.[0]?.penalty?.scored || 0;
      const appearances = entry?.statistics?.[0]?.games?.appearences || 0;
      const minutes = entry?.statistics?.[0]?.games?.minutes || 0;
      const team = entry?.statistics?.[0]?.team?.name || "Club";
      const playerPhoto = entry?.player?.photo || "";
      return `
        <button class="football-scorer-row" data-football-player-id="${escapeHtml(String(entry?.player?.id || ""))}" data-football-player-name="${escapeHtml(entry?.player?.name || "")}" data-football-team-name="${escapeHtml(team)}" data-football-goals="${escapeHtml(String(goals))}" data-football-assists="${escapeHtml(String(assists))}" data-football-shots="${escapeHtml(String(shots))}" data-football-shots-on="${escapeHtml(String(shotsOn))}" data-football-pens="${escapeHtml(String(penalties))}" data-football-apps="${escapeHtml(String(appearances))}" data-football-minutes="${escapeHtml(String(minutes))}" type="button" aria-label="Open scorer insight for ${escapeHtml(entry?.player?.name || "player")}">
          <span class="football-rank">${idx + 1}</span>
          <img src="${escapeHtml(playerPhoto)}" alt="${escapeHtml(entry?.player?.name || "Player")}" loading="lazy" onerror="this.style.display='none'" />
          <div>
            <strong>${escapeHtml(entry?.player?.name || "Player")}</strong>
            <p>${escapeHtml(team)} | ${goals}G / ${assists}A</p>
          </div>
        </button>
      `;
    }).join("");

    const pulseRows = leaguePulseData
      .map((result, index) => {
        if (result.status !== "fulfilled") {
          return "";
        }
        const league = FOOTBALL_LEAGUES[index];
        const snapshot = result.value?.table?.[0] || null;
        if (!league || !snapshot) {
          return "";
        }
        return `
          <article class="football-pulse-item">
            <p class="kicker">${escapeHtml(league.code)}</p>
            <strong>${escapeHtml(snapshot.team?.name || "Leader")}</strong>
            <p>${escapeHtml(String(snapshot.points || 0))} pts | GD ${toNum(snapshot.goalsDiff) > 0 ? "+" : ""}${escapeHtml(String(snapshot.goalsDiff || 0))}</p>
          </article>
        `;
      })
      .filter(Boolean)
      .join("");

    grid.insertAdjacentHTML(
      "beforeend",
      `
      <article class="glass-card card-span-8 card-entry football-card-glow">
        <h3 class="card-title">${escapeHtml(featuredLeague.name)} Top 8 Table</h3>
        <div class="football-standings-head">
          <span class="football-col-rank">#</span><span class="football-col-team">Team</span><span class="football-col-points">Pts</span><span class="football-col-gd">GD</span><span class="football-col-form">Form</span>
        </div>
        <div class="football-standings-list">${standingsRows || "<p class='empty-state'>Standings unavailable right now.</p>"}</div>
      </article>

      <article class="glass-card card-span-4 card-entry football-card-glow">
        <h3 class="card-title">League Pulse</h3>
        <div class="football-pulse-grid">${pulseRows || "<p class='empty-state'>League pulse unavailable.</p>"}</div>
      </article>

      <article class="glass-card card-span-6 card-entry football-card-glow">
        <h3 class="card-title">Upcoming Fixtures</h3>
        <div class="football-fixture-list">${fixtureRows || "<p class='empty-state'>No scheduled fixtures found.</p>"}</div>
      </article>

      <article class="glass-card card-span-6 card-entry football-card-glow">
        <h3 class="card-title">Top Scorers</h3>
        <div class="football-scorer-list">${scorerRows || "<p class='empty-state'>Scorer feed unavailable.</p>"}</div>
      </article>

      <article class="glass-card card-span-12 card-entry football-card-glow">
        <h3 class="card-title">Points and Goal Difference Trend</h3>
        <div class="football-chart-wrap">
          <canvas id="footballPointsChart" aria-label="Football points chart"></canvas>
        </div>
        <p class="inline-meta">Updated ${escapeHtml(footballKickoffLabel(state.football.lastUpdated))}. Data source: API-Football.</p>
      </article>
      `
    );

    renderFootballPointsChart(standingsTable, featuredLeague.name);
    setupFootballInsightEvents({
      featuredLeague,
      standingsTable,
      upcomingFixtures,
      topScorers
    });
  } catch (error) {
    console.error("renderFootball failed", error);
    const reason = error?.message ? escapeHtml(String(error.message)) : "Unknown football data error";
    updateLiveHUD({
      raceName: "Football feed issue",
      localTime: "Unavailable",
      countdown: "Unavailable",
      weather: "Unavailable",
      seasonCompleted: 0,
      seasonTotal: 0,
      tickerItems: ["Football services offline", "Check API key, rate limits, or CORS"]
    });
    grid.innerHTML = `
      <article class="glass-card card-span-12 card-entry">
        <h3 class="card-title">Football Data Stream Interrupted</h3>
        <p class="empty-state">Unable to load the football APIs right now. Verify API-Football key validity and browser network access, then refresh.</p>
        <p class="inline-meta">Debug: ${reason}</p>
      </article>
    `;
  } finally {
    setLoadingState(false);
  }
}

async function renderCricket() {
  const grid = qs("#dashboardGrid");
  grid.classList.remove("f1-layout");
  grid.innerHTML = "";
  destroyCricketChart();
  setLoadingState(true);
  updateLiveHUD({
    raceName: "Loading cricket intelligence",
    localTime: "Syncing",
    countdown: "Fetching fixtures",
    weather: "Syncing",
    seasonCompleted: 0,
    seasonTotal: 0
  });

  try {
    const dateOffsets = [-2, -1, 0, 1, 2, 3, 4];
    const responses = await Promise.all(
      dateOffsets.map((offset) => fetchSportsDbJSON("/eventsday.php", { d: cricketDateOffset(offset), s: "Cricket" }))
    );

    const events = responses
      .flatMap((response) => response?.events || [])
      .filter((event) => String(event?.strSport || "").toLowerCase() === "cricket");
    const deduped = Array.from(new Map(events.map((event) => [event.idEvent, event])).values());
    const now = Date.now();

    const sorted = deduped.sort((a, b) => new Date(a?.dateEvent || 0).getTime() - new Date(b?.dateEvent || 0).getTime());
    const liveEvents = sorted.filter((event) => isCricketLiveStatus(event?.strStatus));
    const upcomingEvents = sorted.filter((event) => {
      const stamp = new Date(event?.dateEvent || 0).getTime();
      const hasScore = parseCricketRuns(event?.intHomeScore || event?.strHomeScore) > 0 || parseCricketRuns(event?.intAwayScore || event?.strAwayScore) > 0;
      return stamp >= now && !hasScore && !isCricketLiveStatus(event?.strStatus);
    });
    const recentEvents = [...sorted]
      .filter((event) => {
        const stamp = new Date(event?.dateEvent || 0).getTime();
        const hasScore = parseCricketRuns(event?.intHomeScore || event?.strHomeScore) > 0 || parseCricketRuns(event?.intAwayScore || event?.strAwayScore) > 0;
        return stamp <= now && hasScore;
      })
      .reverse();

    const formBoard = buildCricketFormTable(recentEvents.slice(0, 36));
    const leadLive = liveEvents[0] || upcomingEvents[0] || recentEvents[0] || null;
    const topRunMatch = recentEvents[0]
      ? recentEvents.reduce((best, event) => {
        const total = parseCricketRuns(event?.intHomeScore || event?.strHomeScore) + parseCricketRuns(event?.intAwayScore || event?.strAwayScore);
        return total > best.total ? { total, event } : best;
      }, { total: 0, event: null })
      : { total: 0, event: null };

    state.cricket.events = sorted;
    state.cricket.liveEvents = liveEvents;
    state.cricket.upcomingEvents = upcomingEvents;
    state.cricket.recentEvents = recentEvents;
    state.cricket.lastUpdated = new Date().toISOString();

    updateLiveHUD({
      raceName: leadLive ? `${leadLive.strLeague || "Cricket"} Center` : "Cricket Center",
      country: leadLive?.strCountry || "India",
      localTime: footballKickoffLabel(new Date().toISOString()),
      countdown: leadLive?.dateEvent ? formatCountdown(`${leadLive.dateEvent}T${leadLive.strTime || "00:00:00Z"}`) : "Next toss TBD",
      weather: `${liveEvents.length} live matches`,
      seasonCompleted: recentEvents.length,
      seasonTotal: Math.max(recentEvents.length + upcomingEvents.length, 20),
      tickerItems: [
        liveEvents.length ? `${liveEvents.length} live scoreboards running` : "No live matches at this moment",
        upcomingEvents[0] ? `${upcomingEvents[0].strHomeTeam} vs ${upcomingEvents[0].strAwayTeam} next` : "Upcoming fixtures loading",
        formBoard[0] ? `Form leader: ${formBoard[0].team} (${formBoard[0].points} pts)` : "Form table building",
        topRunMatch.event ? `Highest recent run aggregate ${topRunMatch.total} in ${topRunMatch.event.strEvent}` : "Run-rate feed warming"
      ]
    });

    const cards = [
      { title: "Live Match Centers", value: String(liveEvents.length), subtitle: "Active live scorecards" },
      { title: "Upcoming Fixtures", value: String(upcomingEvents.length), subtitle: "Next 4 days window" },
      { title: "Completed Matches", value: String(recentEvents.length), subtitle: "Recent scored fixtures" },
      {
        title: "Top Aggregate",
        value: topRunMatch.event ? `${topRunMatch.total} runs` : "Pending",
        subtitle: topRunMatch.event ? `${topRunMatch.event.strHomeTeam} vs ${topRunMatch.event.strAwayTeam}` : "Awaiting scored events"
      }
    ];

    const statWrap = document.createElement("section");
    statWrap.className = "card-span-12 stats-row football-stats-row";
    cards.forEach((card) => statWrap.appendChild(createStatCard(card)));
    grid.appendChild(statWrap);

    const liveRows = liveEvents.slice(0, 6).map((event) => `
      <div class="cricket-match-row live">
        <strong>${escapeHtml(event.strHomeTeam || "Home")} vs ${escapeHtml(event.strAwayTeam || "Away")}</strong>
        <p>${escapeHtml(event.strLeague || "League")} • ${escapeHtml(event.strStatus || "Live")}</p>
        <p class="inline-meta">${escapeHtml(String(event.strHomeScore || event.intHomeScore || "-"))} / ${escapeHtml(String(event.strAwayScore || event.intAwayScore || "-"))}</p>
      </div>
    `).join("");

    const upcomingRows = upcomingEvents.slice(0, 8).map((event) => `
      <div class="cricket-match-row">
        <strong>${escapeHtml(event.strHomeTeam || "Home")} vs ${escapeHtml(event.strAwayTeam || "Away")}</strong>
        <p>${escapeHtml(event.strLeague || "League")}</p>
        <p class="inline-meta">${escapeHtml(footballKickoffLabel(`${event.dateEvent}T${event.strTime || "00:00:00Z"}`))}</p>
      </div>
    `).join("");

    const recentRows = recentEvents.slice(0, 8).map((event) => {
      const homeRuns = parseCricketRuns(event?.intHomeScore || event?.strHomeScore);
      const awayRuns = parseCricketRuns(event?.intAwayScore || event?.strAwayScore);
      return `
        <div class="cricket-match-row">
          <strong>${escapeHtml(event.strHomeTeam || "Home")} ${homeRuns} - ${awayRuns} ${escapeHtml(event.strAwayTeam || "Away")}</strong>
          <p>${escapeHtml(event.strLeague || "League")}</p>
          <p class="inline-meta">${escapeHtml(event.strStatus || "Completed")}</p>
        </div>
      `;
    }).join("");

    const formRows = formBoard.map((row, idx) => `
      <div class="cricket-form-row">
        <span>${idx + 1}</span>
        <strong>${escapeHtml(row.team)}</strong>
        <span>${row.played}P</span>
        <span>${row.wins}W</span>
        <span>${row.points}pts</span>
      </div>
    `).join("");

    grid.insertAdjacentHTML(
      "beforeend",
      `
      <article class="glass-card card-span-6 card-entry cricket-card-glow">
        <h3 class="card-title">Live Scoreboard</h3>
        <div class="cricket-match-list">${liveRows || "<p class='empty-state'>No live matches in this window.</p>"}</div>
      </article>

      <article class="glass-card card-span-6 card-entry cricket-card-glow">
        <h3 class="card-title">Upcoming Fixtures</h3>
        <div class="cricket-match-list">${upcomingRows || "<p class='empty-state'>No upcoming fixtures found.</p>"}</div>
      </article>

      <article class="glass-card card-span-8 card-entry cricket-card-glow">
        <h3 class="card-title">Recent Results</h3>
        <div class="cricket-match-list">${recentRows || "<p class='empty-state'>Recent results unavailable.</p>"}</div>
      </article>

      <article class="glass-card card-span-4 card-entry cricket-card-glow">
        <h3 class="card-title">Form Table (Window)</h3>
        <div class="cricket-form-list">${formRows || "<p class='empty-state'>Form table unavailable.</p>"}</div>
      </article>

      <article class="glass-card card-span-12 card-entry cricket-card-glow">
        <h3 class="card-title">Run Momentum Trend</h3>
        <div class="cricket-chart-wrap">
          <canvas id="cricketMomentumChart" aria-label="Cricket run momentum chart"></canvas>
        </div>
        <p class="inline-meta">Updated ${escapeHtml(footballKickoffLabel(state.cricket.lastUpdated))}. Data source: TheSportsDB cricket day feeds.</p>
      </article>
      `
    );

    renderCricketMomentumChart(recentEvents);
  } catch (error) {
    console.error("renderCricket failed", error);
    const reason = error?.message ? escapeHtml(String(error.message)) : "Unknown cricket data error";
    updateLiveHUD({
      raceName: "Cricket feed issue",
      localTime: "Unavailable",
      countdown: "Unavailable",
      weather: "Unavailable",
      seasonCompleted: 0,
      seasonTotal: 0,
      tickerItems: ["Cricket services offline", "Check endpoint availability or CORS"]
    });
    grid.innerHTML = `
      <article class="glass-card card-span-12 card-entry">
        <h3 class="card-title">Cricket Data Stream Interrupted</h3>
        <p class="empty-state">Unable to load cricket data now. Retry shortly; the module is wired and ready.</p>
        <p class="inline-meta">Debug: ${reason}</p>
      </article>
    `;
  } finally {
    setLoadingState(false);
  }
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
  if (state.activeModule !== "football") {
    destroyFootballChart();
  }
  if (state.activeModule !== "cricket") {
    destroyCricketChart();
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
