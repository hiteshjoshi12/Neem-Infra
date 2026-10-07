import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

const REPLACEMENTS = [
  // Exact hex colors (case insensitive)
  { regex: /#C6A24A/gi, replacement: '#D09A16' },
  { regex: /#D8BD73/gi, replacement: '#D09A16' },
  { regex: /#E9D9A8/gi, replacement: '#D09A16' },
  { regex: /#B38E36/gi, replacement: '#D09A16' },
  { regex: /#D4B258/gi, replacement: '#D09A16' },
  { regex: /#B39366/gi, replacement: '#D09A16' },
  { regex: /#E2C372/gi, replacement: '#D09A16' },
  { regex: /#C5A880/gi, replacement: '#D09A16' },
  { regex: /#E2CEB4/gi, replacement: '#D09A16' },
  { regex: /#C29B38/gi, replacement: '#D09A16' },
  // Old rgba values
  { regex: /rgba\(198,\s*162,\s*74,/g, replacement: 'rgba(208, 154, 22,' },
  { regex: /rgba\(198,162,74,/g, replacement: 'rgba(208,154,22,' },
  { regex: /rgba\(197,\s*168,\s*128,/g, replacement: 'rgba(208, 154, 22,' },
  { regex: /rgba\(179,\s*147,\s*102,/g, replacement: 'rgba(208, 154, 22,' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(jsx?|tsx?|css)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { regex, replacement } of REPLACEMENTS) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated gold shades in: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('Standardizing gold shades across src/ to #D09A16...');
processDirectory(SRC_DIR);
console.log('Done!');
