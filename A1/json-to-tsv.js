const fs = require('fs');
const path = require('path');

// adjust inputPath/outputPath if you put the script somewhere else
const inputPath = path.join(__dirname, '.', 'data', 'publications-stats.json');
const outputPath = path.join(__dirname, '.', 'data', 'publications-stats.tsv');

const json = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

if (!Array.isArray(json) || json.length === 0) {
  console.error('Input JSON must be a non-empty array.');
  process.exit(1);
}

// header from keys of the first object
const keys = Object.keys(json[0]);
const header = keys.join('\t');

// rows
const rows = json.map(obj =>
  keys.map(k => String(obj[k] ?? '').replace(/\t/g, ' ')).join('\t')
);

const tsv = [header, ...rows].join('\n');
fs.writeFileSync(outputPath, tsv, 'utf8');

console.log(`Wrote TSV to: ${outputPath}`);