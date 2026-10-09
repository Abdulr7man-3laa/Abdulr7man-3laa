const fs = require('fs');
const path = require('path');

const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || 'Abdulr7man-3laa';
const TOKEN = process.env.GITHUB_TOKEN || '';

const HEADERS = {
  'User-Agent': 'Profile-Stats-Updater',
  'Accept': 'application/vnd.github.v3+json'
};

if (TOKEN) {
  HEADERS['Authorization'] = `Bearer ${TOKEN}`;
}

const LANG_COLORS = {
  'C#': '#239120',
  'C++': '#f34b7d',
  'Python': '#3572A5',
  'CSS': '#563d7c',
  'HTML': '#e34c26',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Java': '#b07219',
  'Shell': '#89e051',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'SQL': '#e38c00',
  'PHP': '#4F5D95',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB'
};

// Optionally exclude languages from Top Languages display
const EXCLUDE_FROM_DISPLAY = ['Java', 'JavaScript'];

// Exclude specific languages from specific repositories
const REPO_EXCLUDED_LANGUAGES = {
  'Portfolio': ['CSS', 'JavaScript'],
  'Abdulr7man-3laa': ['JavaScript'],
  'Abdulrhman': ['JavaScript']
};

function isLanguageExcludedForRepo(repoName, lang) {
  for (const [rName, excludedLangs] of Object.entries(REPO_EXCLUDED_LANGUAGES)) {
    if (rName.toLowerCase() === repoName.toLowerCase()) {
      if (excludedLangs.some(l => l.toLowerCase() === lang.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

async function fetchJSON(url, timeoutMs = 10000) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function getUptime(createdAtStr) {
  const created = new Date(createdAtStr);
  const now = new Date();
  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();
  let days = now.getDate() - created.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const yStr = `${years} year${years !== 1 ? 's' : ''}`;
  const mStr = `${months} month${months !== 1 ? 's' : ''}`;
  const dStr = `${days} day${days !== 1 ? 's' : ''}`;
  return `${yStr}, ${mStr}, ${dStr}`;
}

async function fetchExternalStats(username) {
  const stats = {
    stars: null,
    commits: null,
    prs: null,
    issues: null,
    contribs: null,
    rank: null,
    totalContributions: null,
    currentStreak: null,
    currentStreakRange: null,
    longestStreak: null,
    longestStreakRange: null
  };

  // 1. Fetch github-readme-stats for official stats card
  try {
    console.log('Fetching live github-readme-stats...');
    const res = await fetch(`https://github-readme-stats.vercel.app/api?username=${username}`, {
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      const svg = await res.text();
      const starsMatch = svg.match(/data-testid="stars"[\s\S]*?>\s*(\d+)\s*<\/text>/);
      const commitsMatch = svg.match(/data-testid="commits"[\s\S]*?>\s*(\d+)\s*<\/text>/);
      const prsMatch = svg.match(/data-testid="prs"[\s\S]*?>\s*(\d+)\s*<\/text>/);
      const issuesMatch = svg.match(/data-testid="issues"[\s\S]*?>\s*(\d+)\s*<\/text>/);
      const contribsMatch = svg.match(/data-testid="contribs"[\s\S]*?>\s*(\d+)\s*<\/text>/);
      const rankMatch = svg.match(/data-testid="level-rank-icon"[\s\S]*?>\s*([A-Za-z\+\-]+)\s*<\/text>/);

      if (starsMatch) stats.stars = parseInt(starsMatch[1], 10);
      if (commitsMatch) stats.commits = parseInt(commitsMatch[1], 10);
      if (prsMatch) stats.prs = parseInt(prsMatch[1], 10);
      if (issuesMatch) stats.issues = parseInt(issuesMatch[1], 10);
      if (contribsMatch) stats.contribs = parseInt(contribsMatch[1], 10);
      if (rankMatch) stats.rank = rankMatch[1].trim();

      console.log('Fetched Readme Stats:', {
        stars: stats.stars,
        commits: stats.commits,
        prs: stats.prs,
        issues: stats.issues,
        contribs: stats.contribs,
        rank: stats.rank
      });
    }
  } catch (err) {
    console.warn('Could not fetch github-readme-stats:', err.message);
  }

  // 2. Fetch github-readme-streak-stats
  try {
    console.log('Fetching live github-readme-streak-stats...');
    const res = await fetch(`https://github-readme-streak-stats.herokuapp.com/?user=${username}`, {
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      const svg = await res.text();
      const totalContribMatch = svg.match(/Total Contributions[\s\S]*?<text[^>]*>\s*([\d,]+)\s*<\/text>/i)
        || svg.match(/<text[^>]*>\s*([\d,]+)\s*<\/text>[\s\S]*?Total Contributions/i);
      const currStreakMatch = svg.match(/Current Streak[\s\S]*?<text[^>]*>\s*([\d,]+)\s*<\/text>/i)
        || svg.match(/<text[^>]*>\s*([\d,]+)\s*<\/text>[\s\S]*?Current Streak/i);
      const currRangeMatch = svg.match(/<!-- Current Streak range -->[\s\S]*?<text[^>]*>\s*([^<\n]+)\s*<\/text>/i);
      const longestStreakMatch = svg.match(/Longest Streak[\s\S]*?<text[^>]*>\s*([\d,]+)\s*<\/text>/i)
        || svg.match(/<text[^>]*>\s*([\d,]+)\s*<\/text>[\s\S]*?Longest Streak/i);
      const longestRangeMatch = svg.match(/<!-- Longest Streak range -->[\s\S]*?<text[^>]*>\s*([^<\n]+)\s*<\/text>/i);

      if (totalContribMatch) stats.totalContributions = totalContribMatch[1].replace(/,/g, '').trim();
      if (currStreakMatch) stats.currentStreak = currStreakMatch[1].replace(/,/g, '').trim();
      if (currRangeMatch) stats.currentStreakRange = currRangeMatch[1].trim();
      if (longestStreakMatch) stats.longestStreak = longestStreakMatch[1].replace(/,/g, '').trim();
      if (longestRangeMatch) stats.longestStreakRange = longestRangeMatch[1].trim();

      console.log('Fetched Streak Stats:', {
        totalContributions: stats.totalContributions,
        currentStreak: stats.currentStreak,
        currentStreakRange: stats.currentStreakRange,
        longestStreak: stats.longestStreak,
        longestStreakRange: stats.longestStreakRange
      });
    }
  } catch (err) {
    console.warn('Could not fetch streak stats:', err.message);
  }

  return stats;
}

function injectSnake(svgContent, isDark) {
  const snakeFileName = isDark ? 'github-contribution-grid-snake-dark.svg' : 'github-contribution-grid-snake.svg';
  const snakePath = path.join(__dirname, '..', 'dist', snakeFileName);

  if (!fs.existsSync(snakePath)) {
    console.log(`Snake file not found at ${snakePath}, skipping snake injection for now.`);
    return svgContent;
  }

  try {
    const snakeSvg = fs.readFileSync(snakePath, 'utf8');
    const viewBoxMatch = snakeSvg.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '-16 -32 880 192';

    const innerMatch = snakeSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    if (!innerMatch) {
      console.warn(`Could not parse inner SVG from ${snakeFileName}`);
      return svgContent;
    }

    const innerContent = innerMatch[1];
    const replacement = `<svg width="740" height="152" x="16" y="16" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">\n      ${innerContent}\n    </svg>`;

    const snakeWidgetRegex = /(<g transform="translate\(12, 616\)" id="widget-widget_1791144914293">[\s\S]*?<rect class="" x="0" y="0" width="772" height="184" fill="transparent" stroke="(?:#252525|#d0d7de)" stroke-width="1" rx="0" \/>\s*\n\s*\n\s*)(<svg[\s\S]*?<\/svg>)(\s*\n\s*\n\s*<\/g>)/;

    if (snakeWidgetRegex.test(svgContent)) {
      console.log(`Successfully injected live snake animation into ${isDark ? 'dark.svg' : 'light.svg'}`);
      return svgContent.replace(snakeWidgetRegex, `$1${replacement}$3`);
    } else {
      console.warn(`Could not find snake container in ${isDark ? 'dark.svg' : 'light.svg'}`);
    }
  } catch (err) {
    console.error(`Error injecting snake into SVG:`, err);
  }

  return svgContent;
}

function updateSvgFile(fileName, data) {
  const {
    topLanguages,
    totalStars,
    publicRepos,
    followers,
    uptime,
    externalStats
  } = data;

  const svgPath = path.join(__dirname, '..', fileName);
  if (!fs.existsSync(svgPath)) {
    console.log(`Skipping ${fileName}: file does not exist.`);
    return;
  }

  let svgContent = fs.readFileSync(svgPath, 'utf8');
  const isDark = fileName.includes('dark');

  // 1. Build and Update Top Languages widget
  const yPositions = [48, 74, 100, 126, 152];
  const titleColor = isDark ? '#7a7a7a' : '#57606a';
  const textColor = isDark ? '#e5e5e5' : '#1f2328';
  const trackColor = isDark ? '#252525' : '#eaeef2';

  let langsXml = `    <text x="24" y="32" font-family="'Inter Tight', sans-serif" font-size="11" font-weight="500" fill="${titleColor}" letter-spacing="2">[ TOP LANGUAGES ]</text>\n    \n`;

  topLanguages.forEach((item, index) => {
    const y = yPositions[index] || (48 + index * 26);
    langsXml += `      <g transform="translate(24, ${y})">
        <circle cx="6" cy="8" r="4" fill="${item.color}" />
        <text x="18" y="14" font-family="'Inter Tight', sans-serif" font-size="12" fill="${textColor}">${item.lang}</text>
        <text x="442" y="14" text-anchor="end" font-family="'Inter Tight', sans-serif" font-size="11" fill="${titleColor}">${item.formattedPct}</text>
        <rect x="0" y="20" width="442" height="3" fill="${trackColor}" rx="1" />
        <rect x="0" y="20" width="${item.barWidth}" height="3" fill="${item.color}" rx="1" />
      </g>\n`;
    if (index < topLanguages.length - 1) {
      langsXml += `    \n`;
    }
  });

  const widgetRegex = /(<g transform="translate\(12, 402\)" id="widget-widget_1791141275992_3">[\s\S]*?<rect class="" x="0" y="0" width="526" height="202" fill="[^"]*" stroke="[^"]*" stroke-width="1" rx="0" \/>\s*)([\s\S]*?)(<\/g>\s*<g transform="translate\(544, 402\)")/;
  if (widgetRegex.test(svgContent)) {
    svgContent = svgContent.replace(widgetRegex, `$1\n${langsXml}  $3`);
    console.log(`Successfully updated Top Languages in ${fileName}`);
  } else {
    console.warn(`Could not match Top Languages widget in ${fileName}`);
  }

  // 2. Terminal Bio: Uptime
  svgContent = svgContent.replace(
    /(<tspan fill="#7a7a7a">\. Uptime: <\/tspan><tspan fill="(?:#4d3a66|#d0d7de)">\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="(?:#e6fbfb|#1f2328)">)\s*[^<]+(<\/tspan>)/,
    `$1 ${uptime}$2`
  );

  // 2. Terminal Bio: Repos & Stars
  svgContent = svgContent.replace(
    /(<tspan fill="#7a7a7a">\. Repos: <\/tspan><tspan fill="(?:#4d3a66|#d0d7de)">\.\.\.\.\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="(?:#55ffff|#0969da)">)\s*\d+(\s*<\/tspan><tspan fill="(?:#2d1f3f|#d0d7de)"> \| <\/tspan><tspan fill="#7a7a7a">\. Stars: <\/tspan><tspan fill="(?:#4d3a66|#d0d7de)">\.\.\.\.\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="(?:#55ffff|#0969da)">)\s*\d+/,
    `$1 ${publicRepos}$2 ${totalStars}`
  );

  // 2. Terminal Bio: Commits & Followers
  const bioCommits = externalStats.commits !== null ? externalStats.commits : (externalStats.totalContributions || 726);
  svgContent = svgContent.replace(
    /(<tspan fill="#7a7a7a">\. Commits: <\/tspan><tspan fill="(?:#4d3a66|#d0d7de)">\.\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="(?:#55ffff|#0969da)">)\s*\d+(\s*<\/tspan><tspan fill="(?:#2d1f3f|#d0d7de)"> \| <\/tspan><tspan fill="#7a7a7a">\. Followers: <\/tspan><tspan fill="(?:#4d3a66|#d0d7de)">\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="(?:#55ffff|#0969da)">)\s*\d+/,
    `$1 ${bioCommits}$2 ${followers}`
  );

  // 3. Stats Card (widget-widget_1791144465669)
  const starsVal = externalStats.stars !== null ? externalStats.stars : totalStars;
  svgContent = svgContent.replace(/(data-testid="stars"[\s\S]*?>\s*)\d+(\s*<\/text>)/, `$1${starsVal}$2`);

  if (externalStats.commits !== null) {
    svgContent = svgContent.replace(/(data-testid="commits"[\s\S]*?>\s*)\d+(\s*<\/text>)/, `$1${externalStats.commits}$2`);
  }
  if (externalStats.prs !== null) {
    svgContent = svgContent.replace(/(data-testid="prs"[\s\S]*?>\s*)\d+(\s*<\/text>)/, `$1${externalStats.prs}$2`);
  }
  if (externalStats.issues !== null) {
    svgContent = svgContent.replace(/(data-testid="issues"[\s\S]*?>\s*)\d+(\s*<\/text>)/, `$1${externalStats.issues}$2`);
  }
  if (externalStats.contribs !== null) {
    svgContent = svgContent.replace(/(data-testid="contribs"[\s\S]*?>\s*)\d+(\s*<\/text>)/, `$1${externalStats.contribs}$2`);
  }
  if (externalStats.rank) {
    svgContent = svgContent.replace(/(data-testid="level-rank-icon"[\s\S]*?>\s*)[A-Za-z\+\-]+(\s*<\/text>)/, `$1${externalStats.rank}$2`);
    svgContent = svgContent.replace(/(<title id="titleId">[^,]+,\s*Rank:\s*)[A-Za-z\+\-]+(<\/title>)/, `$1${externalStats.rank}$2`);
  }

  // 4. Streak Stats Card (widget-widget_1791144495945)
  if (externalStats.totalContributions) {
    svgContent = svgContent.replace(
      /(<!-- Total Contributions big number -->[\s\S]*?<text[^>]*>\s*)\d+(\s*<\/text>)/,
      `$1${externalStats.totalContributions}$2`
    );
  }
  if (externalStats.currentStreak) {
    svgContent = svgContent.replace(
      /(<!-- Current Streak big number -->[\s\S]*?<text[^>]*>\s*)\d+(\s*<\/text>)/,
      `$1${externalStats.currentStreak}$2`
    );
  }
  if (externalStats.currentStreakRange) {
    svgContent = svgContent.replace(
      /(<!-- Current Streak range -->[\s\S]*?<text[^>]*>\s*)([^<\n]+)(\s*<\/text>)/,
      `$1${externalStats.currentStreakRange}$3`
    );
  }
  if (externalStats.longestStreak) {
    svgContent = svgContent.replace(
      /(<!-- Longest Streak big number -->[\s\S]*?<text[^>]*>\s*)\d+(\s*<\/text>)/,
      `$1${externalStats.longestStreak}$2`
    );
  }
  if (externalStats.longestStreakRange) {
    svgContent = svgContent.replace(
      /(<!-- Longest Streak range -->[\s\S]*?<text[^>]*>\s*)([^<\n]+)(\s*<\/text>)/,
      `$1${externalStats.longestStreakRange}$3`
    );
  }

  // Clean any remaining gitascii class references
  svgContent = svgContent.replaceAll('.gitascii-canvas-bg', '.profile-canvas-bg');

  // 5. Inject contribution snake if dist file exists
  svgContent = injectSnake(svgContent, isDark);

  fs.writeFileSync(svgPath, svgContent, 'utf8');
  console.log(`${fileName} updated successfully.`);
}

function updateReadmeCacheBuster() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  if (!fs.existsSync(readmePath)) return;
  let content = fs.readFileSync(readmePath, 'utf8');
  const timestamp = Date.now();
  content = content.replace(/(dark\.svg\?v=)[^\s"'>]+/g, `$1${timestamp}`);
  content = content.replace(/(light\.svg\?v=)[^\s"'>]+/g, `$1${timestamp}`);
  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(`Updated README.md cache buster with v=${timestamp}`);
}

async function updateStats() {
  console.log(`Fetching repositories for user: ${USERNAME}...`);
  const cachePath = path.join(__dirname, 'cached-repos.json');
  let repos = [];
  let userInfo = null;
  let useCache = false;

  try {
    repos = await fetchJSON(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner`);
  } catch (err) {
    if (fs.existsSync(cachePath)) {
      console.warn(`Warning: Could not fetch repos live (${err.message}). Using local cache fallback.`);
      const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      repos = cached.repos || [];
      userInfo = cached.userInfo || null;
      useCache = true;
    } else {
      throw err;
    }
  }

  let totalStars = 0;
  const langBytes = {};
  let totalBytes = 0;

  for (const repo of repos) {
    if (repo.fork) continue;
    totalStars += repo.stargazers_count || 0;

    let langs = repo.languages;
    if (!langs) {
      try {
        langs = await fetchJSON(repo.languages_url);
        repo.languages = langs;
      } catch (err) {
        langs = {};
      }
    }

    for (const [lang, bytes] of Object.entries(langs)) {
      if (isLanguageExcludedForRepo(repo.name, lang)) {
        console.log(`Excluding ${lang} (${bytes} bytes) from ${repo.name}`);
        continue;
      }
      if (EXCLUDE_FROM_DISPLAY.includes(lang)) {
        continue;
      }
      langBytes[lang] = (langBytes[lang] || 0) + bytes;
      totalBytes += bytes;
    }
  }

  console.log('Total aggregated bytes:', langBytes);
  console.log('Total bytes sum:', totalBytes);

  // Filter and sort languages
  const sortedLangs = Object.entries(langBytes)
    .filter(([lang]) => !EXCLUDE_FROM_DISPLAY.includes(lang))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topLanguages = sortedLangs.map(([lang, bytes]) => {
    const pct = (bytes / totalBytes) * 100;
    const formattedPct = pct.toFixed(2) + '%';
    const color = LANG_COLORS[lang] || '#00bcd4';
    const barWidth = Math.round(442 * (pct / 100));
    return { lang, pct, formattedPct, color, barWidth };
  });

  console.log('Calculated Top Languages:', topLanguages);

  // Fetch user info for follower & public repo count and created_at for uptime
  if (!userInfo) {
    try {
      userInfo = await fetchJSON(`https://api.github.com/users/${USERNAME}`);
    } catch (err) {
      if (fs.existsSync(cachePath)) {
        userInfo = JSON.parse(fs.readFileSync(cachePath, 'utf8')).userInfo;
      }
    }
  }
  const publicRepos = userInfo ? (userInfo.public_repos || repos.length) : repos.length;
  const followers = userInfo ? (userInfo.followers || 0) : 0;
  const uptime = getUptime((userInfo && userInfo.created_at) || '2021-05-29T03:18:12Z');

  if (!useCache) {
    try {
      fs.writeFileSync(cachePath, JSON.stringify({ userInfo, repos }, null, 2), 'utf8');
    } catch (e) {}
  }

  console.log(`User stats -> Repos: ${publicRepos}, Stars: ${totalStars}, Followers: ${followers}, Uptime: ${uptime}`);

  // Fetch live external stats (GitHub Readme Stats & Streak Stats)
  const externalStats = await fetchExternalStats(USERNAME);

  // Process both dark and light profile SVG files
  updateSvgFile('dark.svg', {
    topLanguages,
    totalStars,
    publicRepos,
    followers,
    uptime,
    externalStats
  });

  updateSvgFile('light.svg', {
    topLanguages,
    totalStars,
    publicRepos,
    followers,
    uptime,
    externalStats
  });

  // Automatically update cache buster in README.md
  updateReadmeCacheBuster();

  console.log('All profile SVG assets and README cache-buster updated successfully!');
}

updateStats().catch(err => {
  console.error('Error updating stats:', err);
  process.exit(1);
});
