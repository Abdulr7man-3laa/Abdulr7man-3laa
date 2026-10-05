const fs = require('fs');
const path = require('path');

const darkSvg = fs.readFileSync(path.join(__dirname, '../dark.svg'), 'utf8');

// 1. Extract photo href
const photoMatch = darkSvg.match(/<image\s+href="([^"]+)"/);
if (!photoMatch) {
  console.error('Could not extract photo from dark.svg');
  process.exit(1);
}
const photoHref = photoMatch[1];

// 2. Load the 13 standalone icons
const icons = require('./extracted-icons.json');

// Common profile data
const data = {
  name: "Abdulrhman Alaa",
  handle: "@Abdulr7man-3laa",
  status: "Open to SWE / .NET Backend roles",
  focus: ".NET Core, Clean Architecture",
  learning: "Distributed Systems, Docker",
  education: "Computer Science (Zagazig Univ)",
  location: "Zagazig, Egypt",
  uptime: "5 years, 4 months, 5 days",
  email: "abdulr7manx9@gmail.com",
  stats: {
    repos: "11",
    stars: "10",
    commits: "726",
    followers: "12"
  },
  languages: [
    { name: "C#", percent: "40.59%", color: "#239120" },
    { name: "C++", percent: "30.70%", color: "#f34b7d" },
    { name: "Python", percent: "9.79%", color: "#3572A5" },
    { name: "CSS", percent: "9.32%", color: "#563d7c" },
    { name: "JavaScript", percent: "3.13%", color: "#f1e05a" }
  ],
  iconNames: [
    "C#", ".NET Core", "EF Core", "SQL Server", "PostgreSQL",
    "Clean Arch", "SignalR", "Docker", "Postman", "Git",
    "GitHub", "ngrok", "LaTeX"
  ]
};

// ==============================================================
// VARIANT 1: LINEAR / VERCEL BENTO GRID DASHBOARD
// Design System:
// - Deep slate/obsidian canvas (#090D16 -> #0D111A)
// - Glassmorphic cards with gradient borders & glowing highlights
// - Balanced 2-row panoramic tech stack (7 + 6 layout) with glossy chips
// - Modern sans typography (Plus Jakarta Sans + JetBrains Mono)
// ==============================================================
function generateBentoSvg() {
  // Render 13 icons across 2 rows (7 on top, 6 on bottom)
  const row1Icons = icons.slice(0, 7);
  const row2Icons = icons.slice(7, 13);

  const tileW = 48;
  const tileH = 48;
  const gap = 56;
  const pitch = tileW + gap; // 104

  // Card inner width = 760. 7 icons span 7*48 + 6*56 = 336 + 336 = 672. Left offset = (760 - 672) / 2 = 44.
  const r1OffsetX = 44;
  // 6 icons span 6*48 + 5*56 = 288 + 280 = 568. Left offset = (760 - 568) / 2 = 96.
  const r2OffsetX = 96;

  const renderTile = (iconSvg, name, x, y) => `
    <g transform="translate(${x}, ${y})">
      <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.04)"/>
      <rect width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <g transform="translate(8, 8)">
        <svg width="32" height="32" viewBox="0 0 128 128">
          ${iconSvg}
        </svg>
      </g>
      <text x="24" y="62" class="mono" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle">${name}</text>
    </g>
  `;

  const renderedRow1 = row1Icons.map((ic, i) => renderTile(ic, data.iconNames[i], r1OffsetX + i * pitch, 42)).join('\n');
  const renderedRow2 = row2Icons.map((ic, i) => renderTile(ic, data.iconNames[7 + i], r2OffsetX + i * pitch, 114)).join('\n');

  return `<svg width="840" height="760" viewBox="0 0 840 760" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="b1-bg" x1="0" y1="0" x2="840" y2="760" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#0D1322"/>
      <stop offset="100%" stop-color="#06090F"/>
    </linearGradient>
    <linearGradient id="b1-card-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="b1-card-border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#818CF8" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#C084FC" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="b1-avatar-glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <clipPath id="avatar-clip-b1">
      <rect x="0" y="0" width="160" height="160" rx="20"/>
    </clipPath>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap');
    text { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; user-select: none; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>

  <rect width="840" height="760" rx="24" fill="url(#b1-bg)"/>
  <rect width="840" height="760" rx="24" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- HERO CARD (Pos: 20, 20) -->
  <g transform="translate(20, 20)">
    <rect width="800" height="200" rx="20" fill="url(#b1-card-grad)"/>
    <rect width="800" height="200" rx="20" fill="none" stroke="url(#b1-card-border)" stroke-width="1.5"/>

    <g transform="translate(20, 20)">
      <rect x="-3" y="-3" width="166" height="166" rx="23" fill="none" stroke="url(#b1-avatar-glow)" stroke-width="2"/>
      <g clip-path="url(#avatar-clip-b1)">
        <image href="${photoHref}" x="-25" y="-15" width="210" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
    </g>

    <g transform="translate(205, 30)">
      <g>
        <rect x="0" y="0" width="310" height="26" rx="13" fill="rgba(16, 185, 129, 0.12)" stroke="#10B981" stroke-width="1"/>
        <circle cx="14" cy="13" r="4.5" fill="#10B981"/>
        <text x="26" y="17" font-size="11" font-weight="600" fill="#34D399" letter-spacing="0.5">ACTIVE • Open to SWE / .NET Backend</text>
      </g>

      <text x="0" y="65" font-size="28" font-weight="800" fill="#F8FAFC" letter-spacing="-0.5">${data.name}</text>
      <text x="0" y="90" class="mono" font-size="14" font-weight="500" fill="#38BDF8">${data.handle}</text>

      <!-- Meta Badges with comfortable padding & zero clipping -->
      <g transform="translate(0, 108)">
        <g>
          <rect x="0" y="0" width="128" height="26" rx="8" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
          <text x="10" y="17" class="mono" font-size="11" font-weight="500" fill="#7DD3FC">📍 ${data.location}</text>
        </g>
        <g transform="translate(136, 0)">
          <rect x="0" y="0" width="148" height="26" rx="8" fill="rgba(129, 140, 248, 0.1)" stroke="rgba(129, 140, 248, 0.25)" stroke-width="1"/>
          <text x="10" y="17" class="mono" font-size="11" font-weight="500" fill="#A5B4FC">⏱️ 5y 4m uptime</text>
        </g>
        <g transform="translate(292, 0)">
          <rect x="0" y="0" width="220" height="26" rx="8" fill="rgba(244, 63, 94, 0.1)" stroke="rgba(244, 63, 94, 0.25)" stroke-width="1"/>
          <text x="10" y="17" class="mono" font-size="11" font-weight="500" fill="#FDA4AF">✉️ ${data.email}</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 4 STATS ROW (Pos: 20, 236) -->
  <g transform="translate(20, 236)">
    <!-- Commits -->
    <rect width="190" height="84" rx="16" fill="url(#b1-card-grad)"/>
    <rect width="190" height="84" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="20" y="32" class="mono" font-size="11" font-weight="600" fill="#94A3B8" letter-spacing="1">TOTAL COMMITS</text>
    <text x="20" y="66" class="mono" font-size="28" font-weight="800" fill="#38BDF8">${data.stats.commits}</text>
    <circle cx="160" cy="42" r="16" fill="rgba(56, 189, 248, 0.1)"/>
    <path d="M155 42 L165 42 M160 37 L160 47" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
  </g>

  <g transform="translate(224, 236)">
    <!-- Repos -->
    <rect width="190" height="84" rx="16" fill="url(#b1-card-grad)"/>
    <rect width="190" height="84" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="20" y="32" class="mono" font-size="11" font-weight="600" fill="#94A3B8" letter-spacing="1">REPOSITORIES</text>
    <text x="20" y="66" class="mono" font-size="28" font-weight="800" fill="#A855F7">${data.stats.repos}</text>
    <circle cx="160" cy="42" r="16" fill="rgba(168, 85, 247, 0.1)"/>
    <rect x="154" y="36" width="12" height="12" rx="3" fill="none" stroke="#A855F7" stroke-width="2"/>
  </g>

  <g transform="translate(428, 236)">
    <!-- Stars -->
    <rect width="190" height="84" rx="16" fill="url(#b1-card-grad)"/>
    <rect width="190" height="84" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="20" y="32" class="mono" font-size="11" font-weight="600" fill="#94A3B8" letter-spacing="1">STARS EARNED</text>
    <text x="20" y="66" class="mono" font-size="28" font-weight="800" fill="#FBBF24">${data.stats.stars}</text>
    <circle cx="160" cy="42" r="16" fill="rgba(251, 191, 36, 0.1)"/>
    <polygon points="160,35 162.5,40 168,41 164,45 165,50 160,47.5 155,50 156,45 152,41 157.5,40" fill="#FBBF24"/>
  </g>

  <g transform="translate(630, 236)">
    <!-- Followers -->
    <rect width="190" height="84" rx="16" fill="url(#b1-card-grad)"/>
    <rect width="190" height="84" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="20" y="32" class="mono" font-size="11" font-weight="600" fill="#94A3B8" letter-spacing="1">FOLLOWERS</text>
    <text x="20" y="66" class="mono" font-size="28" font-weight="800" fill="#34D399">${data.stats.followers}</text>
    <circle cx="160" cy="42" r="16" fill="rgba(52, 211, 153, 0.1)"/>
    <circle cx="160" cy="40" r="5" fill="none" stroke="#34D399" stroke-width="2"/>
    <path d="M153 50 C153 46, 167 46, 167 50" stroke="#34D399" stroke-width="2" fill="none"/>
  </g>

  <!-- MIDDLE ROW: PROFILE SPECS & LANGUAGES (Pos: 20, 336) -->
  <g transform="translate(20, 336)">
    <rect width="420" height="195" rx="18" fill="url(#b1-card-grad)"/>
    <rect width="420" height="195" rx="18" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="22" y="32" font-size="13" font-weight="700" fill="#F1F5F9" letter-spacing="0.5">ENGINEERING PROFILE</text>

    <g transform="translate(22, 54)">
      <rect x="0" y="0" width="376" height="38" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="14" y="24" class="mono" font-size="11" font-weight="600" fill="#38BDF8">FOCUS</text>
      <text x="90" y="24" font-size="12" font-weight="500" fill="#E2E8F0">${data.focus}</text>
    </g>

    <g transform="translate(22, 98)">
      <rect x="0" y="0" width="376" height="38" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="14" y="24" class="mono" font-size="11" font-weight="600" fill="#A855F7">LEARNING</text>
      <text x="90" y="24" font-size="12" font-weight="500" fill="#E2E8F0">${data.learning}</text>
    </g>

    <g transform="translate(22, 142)">
      <rect x="0" y="0" width="376" height="38" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="14" y="24" class="mono" font-size="11" font-weight="600" fill="#10B981">DEGREE</text>
      <text x="90" y="24" font-size="12" font-weight="500" fill="#E2E8F0">${data.education}</text>
    </g>
  </g>

  <!-- Top Languages -->
  <g transform="translate(456, 336)">
    <rect width="364" height="195" rx="18" fill="url(#b1-card-grad)"/>
    <rect width="364" height="195" rx="18" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="22" y="32" font-size="13" font-weight="700" fill="#F1F5F9" letter-spacing="0.5">MOST USED LANGUAGES</text>

    ${data.languages.map((l, i) => `
    <g transform="translate(22, ${48 + i * 28})">
      <text x="0" y="14" class="mono" font-size="12" font-weight="600" fill="#E2E8F0">${l.name}</text>
      <text x="320" y="14" class="mono" font-size="11" font-weight="600" fill="#94A3B8" text-anchor="end">${l.percent}</text>
      <rect x="0" y="20" width="320" height="5" rx="2.5" fill="rgba(255,255,255,0.08)"/>
      <rect x="0" y="20" width="${Math.round(parseFloat(l.percent) * 3.2)}" height="5" rx="2.5" fill="${l.color}"/>
    </g>`).join('')}
  </g>

  <!-- BOTTOM ROW: TECH STACK (Pos: 20, 547) -->
  <g transform="translate(20, 547)">
    <rect width="800" height="193" rx="20" fill="url(#b1-card-grad)"/>
    <rect width="800" height="193" rx="20" fill="none" stroke="url(#b1-card-border)" stroke-width="1.5"/>
    <text x="24" y="28" font-size="13" font-weight="700" fill="#F1F5F9" letter-spacing="0.5">TECH STACK &amp; CORE SKILLS</text>
    <text x="776" y="28" class="mono" font-size="11" font-weight="600" fill="#38BDF8" text-anchor="end">13 TECHNOLOGIES</text>

    <!-- Balanced 2 Rows -->
    ${renderedRow1}
    ${renderedRow2}
  </g>
</svg>`;
}

// ==============================================================
// VARIANT 2: CYBERPUNK HUD COMMAND DECK
// Design System:
// - Cyberpunk Sci-Fi Hacker HUD (#050811 deep dark background)
// - Chamfered borders, scanline telemetry, target crosshair
// - Laser Cyan (#00F0FF), Neon Violet (#BD00FF), Radar Green (#10B981)
// - Tactical Monospace font (Fira Code) + Space Grotesk
// - 13 Tech Arsenal Modules in a military-grade 5x3 HUD matrix
// ==============================================================
function generateCyberdeckSvg() {
  // 13 icons inside a 320x320 panel
  // 5 cols: pitch 56px, tile 42x42. Margin X = (320 - (5*42 + 4*14)) / 2 = (320 - 266) / 2 = 27.
  const renderCyberTile = (iconSvg, index) => {
    let col, row;
    if (index < 5) {
      col = index;
      row = 0;
    } else if (index < 10) {
      col = index - 5;
      row = 1;
    } else {
      // center the last 3 icons (cols 1, 2, 3)
      col = (index - 10) + 1;
      row = 2;
    }

    const x = 27 + col * 56;
    const y = 48 + row * 64;

    return `
    <g transform="translate(${x}, ${y})">
      <rect width="42" height="42" fill="#0B132B" stroke="#00F0FF" stroke-opacity="0.35" stroke-width="1"/>
      <!-- HUD corner notches -->
      <line x1="0" y1="4" x2="4" y2="0" stroke="#00F0FF" stroke-width="1.5"/>
      <line x1="38" y1="42" x2="42" y2="38" stroke="#00F0FF" stroke-width="1.5"/>
      <g transform="translate(5, 5)">
        <svg width="32" height="32" viewBox="0 0 128 128">
          ${iconSvg}
        </svg>
      </g>
      <text x="21" y="54" font-size="8.5" font-weight="600" fill="#94A3B8" text-anchor="middle">${data.iconNames[index]}</text>
    </g>`;
  };

  const renderedCyberIcons = icons.map((ic, i) => renderCyberTile(ic, i)).join('\n');

  return `<svg width="840" height="740" viewBox="0 0 840 740" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="c2-bg" x1="0" y1="0" x2="840" y2="740" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="50%" stop-color="#070D1A"/>
      <stop offset="100%" stop-color="#04060C"/>
    </linearGradient>
    <clipPath id="avatar-clip-c2">
      <polygon points="20,0 200,0 200,180 180,200 0,200 0,20"/>
    </clipPath>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&amp;family=Space+Grotesk:wght@600;700;800&amp;display=swap');
    text { font-family: 'Fira Code', monospace; user-select: none; }
    .title { font-family: 'Space Grotesk', sans-serif; }
    .cyan { fill: #00F0FF; }
    .dim { fill: #475569; }
    .label { fill: #94A3B8; }
    .val { fill: #E2E8F0; }
  </style>

  <!-- Canvas Background -->
  <rect width="840" height="740" fill="url(#c2-bg)"/>
  <rect width="840" height="740" fill="none" stroke="#00F0FF" stroke-opacity="0.3" stroke-width="1.5"/>

  <!-- Top Tech Banner -->
  <g transform="translate(20, 20)">
    <text x="0" y="16" font-size="11" font-weight="700" fill="#00F0FF" letter-spacing="3">// SYSTEM BOOT: ABDULRHMAN_ALAA_V3.0</text>
    <text x="800" y="16" font-size="11" font-weight="600" fill="#10B981" letter-spacing="2" text-anchor="end">STATUS: [ONLINE / ACTIVE]</text>
    <line x1="0" y1="26" x2="800" y2="26" stroke="#00F0FF" stroke-opacity="0.4" stroke-width="1"/>
  </g>

  <!-- Left: Cyber Avatar Panel (Width: 240, Height: 240, Pos: 20, 56) -->
  <g transform="translate(20, 56)">
    <path d="M0,30 L0,0 L30,0" stroke="#00F0FF" stroke-width="3" fill="none"/>
    <path d="M210,0 L240,0 L240,30" stroke="#00F0FF" stroke-width="3" fill="none"/>
    <path d="M240,210 L240,240 L210,240" stroke="#00F0FF" stroke-width="3" fill="none"/>
    <path d="M30,240 L0,240 L0,210" stroke="#00F0FF" stroke-width="3" fill="none"/>
    
    <rect x="8" y="8" width="224" height="224" fill="#0B132B" stroke="#1E293B" stroke-width="1"/>
    
    <!-- Photo with chamfered clip -->
    <g transform="translate(20, 20)">
      <g clip-path="url(#avatar-clip-c2)">
        <image href="${photoHref}" x="-30" y="-20" width="260" height="260" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <!-- Target Overlay -->
      <polygon points="20,0 200,0 200,180 180,200 0,200 0,20" fill="none" stroke="#00F0FF" stroke-width="1.5" stroke-opacity="0.8"/>
      <circle cx="100" cy="100" r="10" fill="none" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.4"/>
      <line x1="90" y1="100" x2="110" y2="100" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.6"/>
      <line x1="100" y1="90" x2="100" y2="110" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.6"/>
    </g>
  </g>

  <!-- Right: Command Terminal Readout (Width: 540, Height: 240, Pos: 280, 56) -->
  <g transform="translate(280, 56)">
    <rect width="540" height="240" fill="#080F1E" stroke="#1E293B" stroke-width="1"/>
    <rect width="540" height="30" fill="#0F172A"/>
    <circle cx="16" cy="15" r="4" fill="#EF4444"/>
    <circle cx="30" cy="15" r="4" fill="#F59E0B"/>
    <circle cx="44" cy="15" r="4" fill="#10B981"/>
    <text x="64" y="19" font-size="11" font-weight="600" fill="#94A3B8">abdulrhman@core-terminal:~$ sys_diagnostics --all</text>

    <!-- Diagnostics Content -->
    <g transform="translate(18, 52)" font-size="12" xml:space="preserve">
      <text y="0"><tspan class="cyan">┌──[ SYSTEM TELEMETRY ]</tspan></text>
      <text y="20"><tspan class="dim">│  ├─ </tspan><tspan class="label">IDENTITY....: </tspan><tspan class="val" font-weight="600">${data.name}</tspan> <tspan class="cyan">(${data.handle})</tspan></text>
      <text y="38"><tspan class="dim">│  ├─ </tspan><tspan class="label">STATUS......: </tspan><tspan fill="#34D399" font-weight="600">[OPEN TO SWE / .NET BACKEND]</tspan></text>
      <text y="56"><tspan class="dim">│  ├─ </tspan><tspan class="label">FOCUS.......: </tspan><tspan class="val">${data.focus}</tspan></text>
      <text y="74"><tspan class="dim">│  ├─ </tspan><tspan class="label">LEARNING....: </tspan><tspan class="val">${data.learning}</tspan></text>
      <text y="92"><tspan class="dim">│  ├─ </tspan><tspan class="label">EDUCATION...: </tspan><tspan class="val">${data.education}</tspan></text>
      <text y="110"><tspan class="dim">│  ├─ </tspan><tspan class="label">LOCATION....: </tspan><tspan class="val">${data.location}</tspan></text>
      <text y="128"><tspan class="dim">│  └─ </tspan><tspan class="label">UPTIME......: </tspan><tspan class="val">${data.uptime}</tspan></text>
      <text y="150"><tspan class="cyan">└──[ SECURE COMMS ]</tspan></text>
      <text y="168"><tspan class="dim">   └─ </tspan><tspan class="label">EMAIL.......: </tspan><tspan fill="#38BDF8">${data.email}</tspan></text>
    </g>
  </g>

  <!-- 4 STATS HUD METERS (Y: 312, Height: 70) -->
  <g transform="translate(20, 312)">
    <g transform="translate(0, 0)">
      <rect width="190" height="70" fill="#0B132B" stroke="#00F0FF" stroke-opacity="0.3" stroke-width="1"/>
      <text x="14" y="24" font-size="10" font-weight="700" fill="#00F0FF" letter-spacing="1">[ COMMITS ]</text>
      <text x="14" y="54" font-size="24" font-weight="800" fill="#F8FAFC">${data.stats.commits}</text>
      <text x="176" y="54" font-size="10" fill="#475569" text-anchor="end">COUNT</text>
    </g>
    <g transform="translate(203, 0)">
      <rect width="190" height="70" fill="#0B132B" stroke="#BD00FF" stroke-opacity="0.3" stroke-width="1"/>
      <text x="14" y="24" font-size="10" font-weight="700" fill="#BD00FF" letter-spacing="1">[ REPOSITORIES ]</text>
      <text x="14" y="54" font-size="24" font-weight="800" fill="#F8FAFC">${data.stats.repos}</text>
      <text x="176" y="54" font-size="10" fill="#475569" text-anchor="end">PUBLIC</text>
    </g>
    <g transform="translate(406, 0)">
      <rect width="190" height="70" fill="#0B132B" stroke="#FBBF24" stroke-opacity="0.3" stroke-width="1"/>
      <text x="14" y="24" font-size="10" font-weight="700" fill="#FBBF24" letter-spacing="1">[ STARS ]</text>
      <text x="14" y="54" font-size="24" font-weight="800" fill="#F8FAFC">${data.stats.stars}</text>
      <text x="176" y="54" font-size="10" fill="#475569" text-anchor="end">TOTAL</text>
    </g>
    <g transform="translate(610, 0)">
      <rect width="190" height="70" fill="#0B132B" stroke="#10B981" stroke-opacity="0.3" stroke-width="1"/>
      <text x="14" y="24" font-size="10" font-weight="700" fill="#10B981" letter-spacing="1">[ NETWORK ]</text>
      <text x="14" y="54" font-size="24" font-weight="800" fill="#F8FAFC">${data.stats.followers}</text>
      <text x="176" y="54" font-size="10" fill="#475569" text-anchor="end">USERS</text>
    </g>
  </g>

  <!-- LOWER SECTION: LANGUAGES & SKILLS -->
  <!-- Top Languages (Pos: 20, 398, Width: 460, Height: 320) -->
  <g transform="translate(20, 398)">
    <rect width="460" height="320" fill="#080F1E" stroke="#1E293B" stroke-width="1"/>
    <rect width="460" height="28" fill="#0F172A"/>
    <text x="16" y="19" font-size="11" font-weight="700" fill="#00F0FF" letter-spacing="1">// BYTECODE ANALYSIS (TOP LANGUAGES)</text>

    ${data.languages.map((l, i) => `
    <g transform="translate(20, ${48 + i * 52})">
      <text x="0" y="14" font-size="13" font-weight="600" fill="#E2E8F0">${l.name}</text>
      <text x="420" y="14" font-size="12" font-weight="600" fill="#00F0FF" text-anchor="end">${l.percent}</text>
      <rect x="0" y="22" width="420" height="8" fill="#0B132B" stroke="#1E293B" stroke-width="1"/>
      <rect x="1" y="23" width="${Math.round(parseFloat(l.percent) * 4.18)}" height="6" fill="${l.color}"/>
    </g>`).join('')}
  </g>

  <!-- Tech Arsenal (Pos: 500, 398, Width: 320, Height: 320) -->
  <g transform="translate(500, 398)">
    <rect width="320" height="320" fill="#080F1E" stroke="#1E293B" stroke-width="1"/>
    <rect width="320" height="28" fill="#0F172A"/>
    <text x="16" y="19" font-size="11" font-weight="700" fill="#BD00FF" letter-spacing="1">// TECH WEAPONRY &amp; FRAMEWORKS</text>

    <!-- 13 Tactical Modules in 5x3 Grid -->
    ${renderedCyberIcons}
  </g>
</svg>`;
}

// ==============================================================
// VARIANT 3: NEO-MINIMALIST SWISS MONO
// Design System:
// - Dieter Rams / Swiss International Typographic Style
// - Graphite black (#0D0D11), crisp contrast, hairline rules (rgba 0.08)
// - Pure Cobalt Blue (#2563EB) & Zinc (#A1A1AA)
// - Precision grid: Space Grotesk + JetBrains Mono
// - 13 Tech Stack chips organized in a sharp, balanced matrix
// ==============================================================
function generateMinimalSvg() {
  // 13 icons inside right box (Width 360, Pos 444, 480)
  // 5 cols: pitch 62px, tile 42x42.
  const renderMinimalTile = (iconSvg, index) => {
    let col, row;
    if (index < 5) {
      col = index;
      row = 0;
    } else if (index < 10) {
      col = index - 5;
      row = 1;
    } else {
      col = (index - 10) + 1; // centered in 3rd row
      row = 2;
    }

    const x = 20 + col * 64;
    const y = 46 + row * 66;

    return `
    <g transform="translate(${x}, ${y})">
      <rect width="44" height="44" rx="8" fill="#14141A" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <g transform="translate(6, 6)">
        <svg width="32" height="32" viewBox="0 0 128 128">
          ${iconSvg}
        </svg>
      </g>
      <text x="22" y="56" class="mono" font-size="8.5" font-weight="500" fill="#71717A" text-anchor="middle">${data.iconNames[index]}</text>
    </g>`;
  };

  const renderedMinimalIcons = icons.map((ic, i) => renderMinimalTile(ic, i)).join('\n');

  return `<svg width="840" height="740" viewBox="0 0 840 740" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="avatar-clip-m3">
      <circle cx="75" cy="75" r="75"/>
    </clipPath>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap');
    text { font-family: 'Space Grotesk', -apple-system, sans-serif; user-select: none; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>

  <!-- Clean Canvas -->
  <rect width="840" height="740" rx="16" fill="#0D0D11"/>
  <rect width="840" height="740" rx="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- HERO SECTION -->
  <g transform="translate(36, 36)">
    <!-- Avatar Circular Minimalist -->
    <g transform="translate(0, 0)">
      <circle cx="75" cy="75" r="78" fill="none" stroke="#2563EB" stroke-width="2"/>
      <g clip-path="url(#avatar-clip-m3)">
        <image href="${photoHref}" x="-20" y="-10" width="190" height="190" preserveAspectRatio="xMidYMid slice"/>
      </g>
    </g>

    <!-- Info Block -->
    <g transform="translate(180, 10)">
      <text x="0" y="24" font-size="12" font-weight="700" fill="#2563EB" letter-spacing="3">SOFTWARE ENGINEER / .NET BACKEND</text>
      <text x="0" y="60" font-size="34" font-weight="700" fill="#FFFFFF" letter-spacing="-1">${data.name}</text>
      <text x="0" y="86" class="mono" font-size="14" fill="#71717A">${data.handle} • ${data.location}</text>

      <!-- Status Pill -->
      <g transform="translate(0, 106)">
        <rect x="0" y="0" width="290" height="30" rx="6" fill="rgba(37, 99, 235, 0.08)" stroke="#2563EB" stroke-width="1"/>
        <circle cx="15" cy="15" r="4" fill="#2563EB"/>
        <text x="28" y="19" class="mono" font-size="11" font-weight="600" fill="#60A5FA">${data.status}</text>
      </g>
    </g>
  </g>

  <!-- DIVIDER -->
  <line x1="36" y1="210" x2="804" y2="210" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- STATS ROW (Minimalist Large Numbers) -->
  <g transform="translate(36, 236)">
    <!-- Commits -->
    <g transform="translate(0, 0)">
      <text x="0" y="38" class="mono" font-size="38" font-weight="800" fill="#FFFFFF">${data.stats.commits}</text>
      <text x="0" y="60" font-size="11" font-weight="600" fill="#71717A" letter-spacing="1.5">COMMITS</text>
    </g>
    <!-- Repos -->
    <g transform="translate(200, 0)">
      <text x="0" y="38" class="mono" font-size="38" font-weight="800" fill="#FFFFFF">${data.stats.repos}</text>
      <text x="0" y="60" font-size="11" font-weight="600" fill="#71717A" letter-spacing="1.5">REPOSITORIES</text>
    </g>
    <!-- Stars -->
    <g transform="translate(400, 0)">
      <text x="0" y="38" class="mono" font-size="38" font-weight="800" fill="#FFFFFF">${data.stats.stars}</text>
      <text x="0" y="60" font-size="11" font-weight="600" fill="#71717A" letter-spacing="1.5">STARS</text>
    </g>
    <!-- Followers -->
    <g transform="translate(600, 0)">
      <text x="0" y="38" class="mono" font-size="38" font-weight="800" fill="#FFFFFF">${data.stats.followers}</text>
      <text x="0" y="60" font-size="11" font-weight="600" fill="#71717A" letter-spacing="1.5">FOLLOWERS</text>
    </g>
  </g>

  <!-- DIVIDER -->
  <line x1="36" y1="290" x2="804" y2="290" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- MIDDLE SECTION: 2 COLUMNS (Pos: 36, 310) -->
  <!-- Left Column: Technical Specifications (Width: 360) -->
  <g transform="translate(36, 310)">
    <text x="0" y="16" font-size="11" font-weight="700" fill="#71717A" letter-spacing="2">TECHNICAL SPECIFICATIONS</text>

    <g transform="translate(0, 36)" font-size="12">
      <!-- Row 1 -->
      <text x="0" y="8" class="mono" font-weight="600" fill="#71717A">FOCUS</text>
      <text x="95" y="8" font-weight="500" fill="#FFFFFF">${data.focus}</text>
      <line x1="0" y1="20" x2="350" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

      <!-- Row 2 -->
      <text x="0" y="44" class="mono" font-weight="600" fill="#71717A">LEARNING</text>
      <text x="95" y="44" font-weight="500" fill="#FFFFFF">${data.learning}</text>
      <line x1="0" y1="56" x2="350" y2="56" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

      <!-- Row 3 -->
      <text x="0" y="80" class="mono" font-weight="600" fill="#71717A">EDUCATION</text>
      <text x="95" y="80" font-weight="500" fill="#FFFFFF">${data.education}</text>
      <line x1="0" y1="92" x2="350" y2="92" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

      <!-- Row 4 -->
      <text x="0" y="116" class="mono" font-weight="600" fill="#71717A">CONTACT</text>
      <text x="95" y="116" class="mono" font-weight="500" fill="#60A5FA">${data.email}</text>
    </g>
  </g>

  <!-- Right Column: Top Languages (Pos: 430, 310, Width: 374) -->
  <g transform="translate(430, 310)">
    <text x="0" y="16" font-size="11" font-weight="700" fill="#71717A" letter-spacing="2">TOP LANGUAGES</text>

    ${data.languages.map((l, i) => `
    <g transform="translate(0, ${36 + i * 28})">
      <text x="0" y="10" class="mono" font-size="11" font-weight="500" fill="#E4E4E7">${l.name}</text>
      <text x="374" y="10" class="mono" font-size="11" font-weight="600" fill="#A1A1AA" text-anchor="end">${l.percent}</text>
      <rect x="0" y="16" width="374" height="3" fill="#27272A" rx="1.5"/>
      <rect x="0" y="16" width="${Math.round(parseFloat(l.percent) * 3.74)}" height="3" fill="${l.color}" rx="1.5"/>
    </g>`).join('')}
  </g>

  <!-- DIVIDER -->
  <line x1="36" y1="500" x2="804" y2="500" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- BOTTOM SECTION: SKILLS & TECHNOLOGIES (Pos: 36, 520) -->
  <g transform="translate(36, 520)">
    <text x="0" y="16" font-size="11" font-weight="700" fill="#71717A" letter-spacing="2">TECH STACK &amp; CORE SKILLS</text>
    <text x="768" y="16" class="mono" font-size="11" font-weight="600" fill="#2563EB" text-anchor="end">13 TECHNOLOGIES</text>

    <!-- 2 Rows of Minimal Matte Chips -->
    <g transform="translate(0, 34)">
      ${icons.slice(0, 7).map((ic, i) => `
      <g transform="translate(${24 + i * 105}, 0)">
        <rect width="44" height="44" rx="8" fill="#14141A" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <g transform="translate(6, 6)">
          <svg width="32" height="32" viewBox="0 0 128 128">
            ${ic}
          </svg>
        </g>
        <text x="22" y="56" class="mono" font-size="8.5" font-weight="500" fill="#71717A" text-anchor="middle">${data.iconNames[i]}</text>
      </g>`).join('\n')}

      ${icons.slice(7, 13).map((ic, i) => `
      <g transform="translate(${76 + i * 105}, 76)">
        <rect width="44" height="44" rx="8" fill="#14141A" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <g transform="translate(6, 6)">
          <svg width="32" height="32" viewBox="0 0 128 128">
            ${ic}
          </svg>
        </g>
        <text x="22" y="56" class="mono" font-size="8.5" font-weight="500" fill="#71717A" text-anchor="middle">${data.iconNames[7 + i]}</text>
      </g>`).join('\n')}
    </g>
  </g>
</svg>`;
}

// Generate all 3 variants
fs.writeFileSync(path.join(__dirname, '../variant-1-bento.svg'), generateBentoSvg(), 'utf8');
console.log('Saved variant-1-bento.svg');

fs.writeFileSync(path.join(__dirname, '../variant-2-cyberdeck.svg'), generateCyberdeckSvg(), 'utf8');
console.log('Saved variant-2-cyberdeck.svg');

fs.writeFileSync(path.join(__dirname, '../variant-3-minimal.svg'), generateMinimalSvg(), 'utf8');
console.log('Saved variant-3-minimal.svg');

// Update preview gallery HTML
const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GitHub Profile README - Design System Variants</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #06080D;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 50px;
    }
    .header h1 {
      font-size: 34px;
      font-weight: 800;
      background: linear-gradient(135deg, #38BDF8, #818CF8, #C084FC);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    .header p {
      color: #94A3B8;
      font-size: 16px;
    }
    .variants-container {
      display: flex;
      flex-direction: column;
      gap: 70px;
      max-width: 900px;
      margin: 0 auto;
    }
    .variant-card {
      background: #0B0F19;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
    }
    .variant-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .variant-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 20px;
    }
    .badge-bento { background: rgba(56, 189, 248, 0.15); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-cyber { background: rgba(0, 240, 255, 0.15); color: #00F0FF; border: 1px solid rgba(0, 240, 255, 0.3); }
    .badge-minimal { background: rgba(37, 99, 235, 0.15); color: #60A5FA; border: 1px solid rgba(37, 99, 235, 0.3); }
    .variant-title {
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .variant-desc {
      color: #94A3B8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .preview-box {
      background: #000;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.04);
    }
    .preview-box img {
      width: 100%;
      max-width: 840px;
      height: auto;
      display: block;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>GitHub Profile Design Systems</h1>
    <p>3 distinct architectural styles tailored for Abdulrhman Alaa</p>
  </div>

  <div class="variants-container">
    <!-- VARIANT 1 -->
    <div class="variant-card" id="bento">
      <div class="variant-title-bar">
        <div class="variant-title">Style 1: Modern Bento Grid Dashboard</div>
        <span class="variant-badge badge-bento">Vercel &amp; Linear Aesthetic</span>
      </div>
      <p class="variant-desc">
        <strong>Structure &amp; Philosophy:</strong> Modular Bento Grid layout popular among world-class developer tools. Glassmorphism cards with glowing border gradients, emerald activity badge, balanced 4-gauge stat telemetry, and a dedicated 2-row panoramic tech stack (7 + 6 layout) with rounded frosted tiles.
      </p>
      <div class="preview-box">
        <img src="variant-1-bento.svg?v=${Date.now()}" alt="Variant 1 Bento">
      </div>
    </div>

    <!-- VARIANT 2 -->
    <div class="variant-card" id="cyber">
      <div class="variant-title-bar">
        <div class="variant-title">Style 2: Cyberdeck Sci-Fi HUD Command Deck</div>
        <span class="variant-badge badge-cyber">Cyberpunk 2077 HUD</span>
      </div>
      <p class="variant-desc">
        <strong>Structure &amp; Philosophy:</strong> Tactical holographic terminal command deck. Features targeting reticles over the chamfered avatar, ASCII diagnostic telemetry tree, neon cyan and hot magenta borders, HUD gauge meters, and a 13-module tactical arsenal grid.
      </p>
      <div class="preview-box">
        <img src="variant-2-cyberdeck.svg?v=${Date.now()}" alt="Variant 2 Cyberdeck">
      </div>
    </div>

    <!-- VARIANT 3 -->
    <div class="variant-card" id="minimal">
      <div class="variant-title-bar">
        <div class="variant-title">Style 3: Neo-Minimalist Swiss Mono</div>
        <span class="variant-badge badge-minimal">Senior Architect / Editorial</span>
      </div>
      <p class="variant-desc">
        <strong>Structure &amp; Philosophy:</strong> Dieter Rams / Swiss International Typographic Style. Pure graphite black with ultra-crisp hairline dividers, massive typographic statistics, a clean technical specification matrix table, and a disciplined matrix chip layout for skills.
      </p>
      <div class="preview-box">
        <img src="variant-3-minimal.svg?v=${Date.now()}" alt="Variant 3 Swiss Mono">
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../preview-gallery.html'), galleryHtml, 'utf8');
console.log('Saved preview-gallery.html');
