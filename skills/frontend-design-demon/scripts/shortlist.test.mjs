import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = join(dirname(fileURLToPath(import.meta.url)), 'shortlist.mjs');

function page(candidates, skipped) {
  const dir = mkdtempSync(join(tmpdir(), 'fdd-'));
  mkdirSync(join(dir, 'refs'));
  if (candidates) writeFileSync(join(dir, 'refs', 'candidates.json'), JSON.stringify(candidates));
  if (skipped) writeFileSync(join(dir, 'refs', 'skipped.json'), JSON.stringify(skipped));
  return dir;
}
const run = (dir) => spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
const cand = (i, extra = {}) => ({ id: `r${String(i).padStart(2, '0')}`, file: `r${String(i).padStart(2, '0')}.png`, url: `https://example.com/${i}`, source: 'awwwards', note: 'nice hero', ...extra });

test('builds grid for 12 candidates', () => {
  const dir = page(Array.from({ length: 12 }, (_, i) => cand(i + 1)));
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
  const html = readFileSync(join(dir, 'refs', 'shortlist.html'), 'utf8');
  assert.equal(html.match(/data-id=/g).length, 12);
  assert.ok(html.includes('12 candidates'));
  assert.ok(html.includes('src="r01.png"'));
});

test('handles 1 candidate and skipped sources', () => {
  const dir = page([cand(1)], [{ source: 'mobbin', reason: 'not signed in' }]);
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
  const html = readFileSync(join(dir, 'refs', 'shortlist.html'), 'utf8');
  assert.ok(html.includes('1 candidate'));
  assert.ok(!html.includes('1 candidates'));
  assert.ok(html.includes('skipped: mobbin (not signed in)'));
});

test('escapes notes', () => {
  const dir = page([cand(1, { note: '<script>x</script>', url: 'javascript:alert(1)' })]);
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
  const html = readFileSync(join(dir, 'refs', 'shortlist.html'), 'utf8');
  assert.ok(!html.includes('<script>x'));
  assert.ok(html.includes('&lt;script&gt;x'));
  assert.ok(!html.includes('href="javascript:'));
});

test('fails clearly when candidates.json missing', () => {
  const dir = page(null);
  const r = run(dir);
  assert.notEqual(r.status, 0);
  assert.ok(r.stderr.includes('candidates.json not found'));
});

test('dollar patterns in notes are kept literally', () => {
  const dir = page([cand(1, { note: "costs $$29 and $` and $& here" })]);
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
  const html = readFileSync(join(dir, 'refs', 'shortlist.html'), 'utf8');
  assert.ok(html.includes('costs $$29 and $` and $&amp; here'));
  assert.equal(html.match(/<!doctype html>/gi).length, 1);
});

test('malformed candidates.json fails with a clear message', () => {
  const dir = page(null);
  writeFileSync(join(dir, 'refs', 'candidates.json'), '[{"id": ');
  const r = run(dir);
  assert.notEqual(r.status, 0);
  assert.ok(r.stderr.includes('candidates.json is not valid JSON'));
  assert.ok(!r.stderr.includes('    at '));
});
