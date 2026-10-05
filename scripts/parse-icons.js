const fs = require('fs');
const path = require('path');

const darkSvg = fs.readFileSync(path.join(__dirname, '../dark.svg'), 'utf8');

// Find all <svg width="32" height="32" ...> inside skills grid
const gridStart = darkSvg.indexOf('id="skills-icons-grid"');
const gridEnd = darkSvg.indexOf('id="widget-widget_1791141541265"');
const gridContent = darkSvg.substring(gridStart, gridEnd);

const iconRegex = /<svg width="32" height="32" viewBox="0 0 128 128">([\s\S]*?)<\/svg>/g;
const icons = [];
let m;
while ((m = iconRegex.exec(gridContent)) !== null) {
  icons.push(m[1].trim());
}

console.log('Extracted icons count:', icons.length);
fs.writeFileSync(path.join(__dirname, 'extracted-icons.json'), JSON.stringify(icons, null, 2), 'utf8');
