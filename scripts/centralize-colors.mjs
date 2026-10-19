import fs from 'fs';
import path from 'path';

export const COLOR_MAP = [
  { hex: '#D09A16', token: 'brand-gold' },
  { hex: '#E5AC2B', token: 'brand-gold-light' },
  { hex: '#F3CA68', token: 'brand-gold-pale' },
  { hex: '#17213D', token: 'brand-navy' },
  { hex: '#0E162B', token: 'brand-navy-deep' },
  { hex: '#202B4A', token: 'brand-navy-surface' },
  { hex: '#182345', token: 'brand-navy-gradient' },
  { hex: '#0A0E17', token: 'brand-obsidian' },
  { hex: '#0C101A', token: 'brand-dark' },
  { hex: '#F7F5EF', token: 'brand-ivory' },
  { hex: '#FAF8F5', token: 'brand-ivory-warm' },
  { hex: '#EFEBE1', token: 'brand-cream' },
  { hex: '#E2DDD5', token: 'brand-cream-border' },
  { hex: '#566078', token: 'brand-slate' },
  { hex: '#8A95A7', token: 'brand-slate-light' },
  { hex: '#8892A6', token: 'brand-muted' },
  { hex: '#C9CED9', token: 'brand-text-on-dark-muted' },
  { hex: '#9DA6B8', token: 'brand-text-dim' },
  { hex: '#121A2F', token: 'brand-text-dark' }
];

function getFiles(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.next')) {
        getFiles(full, files);
      }
    } else if (/\.(jsx?|tsx?)$/.test(f)) {
      files.push(full);
    }
  }
  return files;
}

export function transformContent(content) {
  let updated = content;

  for (const { hex, token } of COLOR_MAP) {
    // 1. Match bracketed hex with slash opacity or ending: -[#hex] or -[#hex]/
    const bracketRegex = new RegExp(`-\\[${hex}\\](?=/|(?=[^a-zA-Z0-9_#\\-]))`, 'gi');
    updated = updated.replace(bracketRegex, `-${token}`);

    const bracketEndRegex = new RegExp(`-\\[${hex}\\]`, 'gi');
    updated = updated.replace(bracketEndRegex, `-${token}`);

    // 2. Match background gradient with hex_1px: e.g. radial-gradient(#D09A16_1px
    const gradRegex = new RegExp(`${hex}_1px`, 'gi');
    updated = updated.replace(gradRegex, `var(--color-${token})_1px`);

    // 3. Match shadow-[...#hex...]
    const shadowHexRegex = new RegExp(`(?<=shadow-\\[[^\\]]*)${hex}(?=[^\\]]*\\])`, 'gi');
    updated = updated.replace(shadowHexRegex, `var(--color-${token})`);
  }

  return updated;
}

const args = process.argv.slice(2);

if (args.includes('--diff')) {
  const fileArg = args[args.indexOf('--diff') + 1] || 'src/sections/home/WhyChooseUsSection.jsx';
  const original = fs.readFileSync(fileArg, 'utf8');
  const transformed = transformContent(original);
  const origLines = original.split('\n');
  const transLines = transformed.split('\n');
  console.log(`--- Diffs for ${fileArg} ---`);
  for (let i = 0; i < origLines.length; i++) {
    if (origLines[i] !== transLines[i]) {
      console.log(`L${i + 1}:`);
      console.log(`  - ${origLines[i].trim()}`);
      console.log(`  + ${transLines[i].trim()}`);
    }
  }
} else if (args.includes('--write')) {
  const files = getFiles('src');
  let updatedCount = 0;
  for (const f of files) {
    const original = fs.readFileSync(f, 'utf8');
    const transformed = transformContent(original);
    if (original !== transformed) {
      fs.writeFileSync(f, transformed, 'utf8');
      updatedCount++;
    }
  }
  console.log(`Successfully updated ${updatedCount} files across src/ with theme tokens!`);
} else {
  // Dry run
  const files = getFiles('src');
  let totalChanges = 0;
  let changedFiles = 0;
  for (const f of files) {
    const original = fs.readFileSync(f, 'utf8');
    const transformed = transformContent(original);
    if (original !== transformed) {
      changedFiles++;
      const origLines = original.split('\n');
      const transLines = transformed.split('\n');
      let fileChanges = 0;
      for (let i = 0; i < origLines.length; i++) {
        if (origLines[i] !== transLines[i]) fileChanges++;
      }
      totalChanges += fileChanges;
    }
  }
  console.log(`DRY RUN: ${changedFiles} files with ${totalChanges} line changes would be updated.`);
}
