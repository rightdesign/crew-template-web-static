import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('build writes a page and the version marker to dist/', () => {
  execFileSync('node', ['scripts/build.mjs']);
  assert.match(readFileSync('dist/index.html', 'utf8'), /<h1>/);
  assert.ok(readFileSync('dist/version.txt', 'utf8').trim().length > 0);
});
