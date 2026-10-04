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
const EXCLUDE_FROM_DISPLAY = ['Java'];

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
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

    const snakeWidgetRegex = /(<g transform="translate\(12, 616\)" id="widget-widget_1791144914293">[\s\S]*?<rect class="" x="0" y="0" width="772" height="184" fill="transparent" stroke="#252525" stroke-width="1" rx="0" \/>\s*\n\s*\n\s*)(<svg[\s\S]*?<\/svg>)(\s*\n\s*\n\s*<\/g>)/;

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

function updateSvgFile(fileName, topLanguages, totalStars, publicRepos, followers) {
  const svgPath = path.join(__dirname, '..', fileName);
  if (!fs.existsSync(svgPath)) {
    console.log(`Skipping ${fileName}: file does not exist.`);
    return;
  }

  let svgContent = fs.readFileSync(svgPath, 'utf8');
  const isDark = fileName.includes('dark');

  // Build the Top Languages XML snippet
  const yPositions = [48, 74, 100, 126, 152];
  let langsXml = `    <text x="24" y="32" font-family="'Inter Tight', sans-serif" font-size="11" font-weight="500" fill="#7a7a7a" letter-spacing="2">[ TOP LANGUAGES ]</text>\n    \n`;

  topLanguages.forEach((item, index) => {
    const y = yPositions[index] || (48 + index * 26);
    langsXml += `      <g transform="translate(24, ${y})">
        <circle cx="6" cy="8" r="4" fill="${item.color}" />
        <text x="18" y="14" font-family="'Inter Tight', sans-serif" font-size="12" fill="#e5e5e5">${item.lang}</text>
        <text x="442" y="14" text-anchor="end" font-family="'Inter Tight', sans-serif" font-size="11" fill="#7a7a7a">${item.formattedPct}</text>
        <rect x="0" y="20" width="442" height="3" fill="#252525" rx="1" />
        <rect x="0" y="20" width="${item.barWidth}" height="3" fill="${item.color}" rx="1" />
      </g>\n`;
    if (index < topLanguages.length - 1) {
      langsXml += `    \n`;
    }
  });

  // Regex to replace Top Languages widget content
  const widgetRegex = /(<g transform="translate\(12, 402\)" id="widget-widget_1791141275992_3">[\s\S]*?<rect class="" x="0" y="0" width="526" height="202" fill="[^"]*" stroke="[^"]*" stroke-width="1" rx="0" \/>\s*)([\s\S]*?)(<\/g>\s*<g transform="translate\(544, 402\)")/;

  if (widgetRegex.test(svgContent)) {
    svgContent = svgContent.replace(widgetRegex, `$1\n${langsXml}  $3`);
    console.log(`Successfully updated Top Languages in ${fileName}`);
  } else {
    console.warn(`Could not match Top Languages widget in ${fileName}`);
  }

  // Update Stars in stats card
  svgContent = svgContent.replace(/(data-testid="stars">\s*)(\d+)(\s*<\/text>)/, `$1${totalStars}$3`);

  // Terminal bio: Repos & Stars
  svgContent = svgContent.replace(
    /(<tspan fill="#7a7a7a">\. Repos: <\/tspan><tspan fill="#4d3a66">\.\.\.\.\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="#55ffff">\s*)\d+(\s*<\/tspan><tspan fill="#2d1f3f"> \| <\/tspan><tspan fill="#7a7a7a">\. Stars: <\/tspan><tspan fill="#4d3a66">\.\.\.\.\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="#55ffff">\s*)\d+/,
    `$1${publicRepos}$2${totalStars}`
  );

  // Terminal bio: Followers
  svgContent = svgContent.replace(
    /(<tspan fill="#7a7a7a">\. Followers: <\/tspan><tspan fill="#4d3a66">\.\.\.\.\.\.\.\.\.<\/tspan><tspan fill="#55ffff">\s*)\d+/,
    `$1${followers}`
  );

  // Clean any remaining gitascii class references
  svgContent = svgContent.replaceAll('.gitascii-canvas-bg', '.profile-canvas-bg');

  // Inject contribution snake if dist file exists
  svgContent = injectSnake(svgContent, isDark);

  fs.writeFileSync(svgPath, svgContent, 'utf8');
  console.log(`${fileName} updated successfully.`);
}

async function updateStats() {
  console.log(`Fetching repositories for user: ${USERNAME}...`);
  const repos = await fetchJSON(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner`);

  let totalStars = 0;
  const langBytes = {};
  let totalBytes = 0;

  for (const repo of repos) {
    if (repo.fork) continue;
    totalStars += repo.stargazers_count || 0;

    const langs = await fetchJSON(repo.languages_url);
    for (const [lang, bytes] of Object.entries(langs)) {
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

  // Fetch user info for follower & public repo count
  const userInfo = await fetchJSON(`https://api.github.com/users/${USERNAME}`);
  const publicRepos = userInfo.public_repos || repos.length;
  const followers = userInfo.followers || 0;

  // Process both dark and light profile SVG files
  updateSvgFile('dark.svg', topLanguages, totalStars, publicRepos, followers);
  updateSvgFile('light.svg', topLanguages, totalStars, publicRepos, followers);

  console.log('All profile SVG assets updated successfully!');
}

updateStats().catch(err => {
  console.error('Error updating stats:', err);
  process.exit(1);
});
