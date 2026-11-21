#!/usr/bin/env node
// Builds <pageDir>/refs/shortlist.html from refs/candidates.json (+ optional refs/skipped.json).
// Usage: node shortlist.mjs <pageDir>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pageDir = process.argv[2];
if (!pageDir) { console.error('usage: node shortlist.mjs <pageDir>'); process.exit(2); }
const refs = join(pageDir, 'refs');
const candPath = join(refs, 'candidates.json');
if (!existsSync(candPath)) { console.error(`candidates.json not found at ${candPath}`); process.exit(1); }

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = (u) => (/^https?:\/\//i.test(String(u ?? '')) ? esc(u) : '#');

function readJson(path, name) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (e) { console.error(`${name} is not valid JSON (${path}): ${e.message}`); process.exit(1); }
}
const candidates = readJson(candPath, 'candidates.json');
if (!Array.isArray(candidates)) { console.error('candidates.json must be an array'); process.exit(1); }
const skippedPath = join(refs, 'skipped.json');
const skipped = existsSync(skippedPath) ? readJson(skippedPath, 'skipped.json') : [];

const cards = candidates.map((c, i) => `  <figure data-id="${esc(c.id)}">
    <a class="shot" href="${esc(c.file)}" target="_blank"><img src="${esc(c.file)}" alt="Reference ${i + 1}" loading="lazy"></a>
    <figcaption>
      <div class="row"><span class="num">${i + 1}</span><span class="src">${esc(c.source)}</span></div>
      <div class="note">${esc(c.note)}</div>
      <a class="link" href="${safeUrl(c.url)}" target="_blank" rel="noopener">${esc(c.url)}</a>
    </figcaption>
  </figure>`).join('\n');

const n = candidates.length;
let header = `${n} candidate${n === 1 ? '' : 's'}`;
if (skipped.length) header += ` · skipped: ${skipped.map((s) => `${esc(s.source)} (${esc(s.reason)})`).join(', ')}`;

const tpl = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'shortlist-template.html'), 'utf8');
const out = join(refs, 'shortlist.html');
writeFileSync(out, tpl.replace('<!--HEADER-->', () => header).replace('<!--GRID-->', () => cards));
console.log(out);
