// Writes the deployable site to dist/. Replace the body when a framework is
// chosen, but keep the last step: .crew.yaml's `released` hook reads
// dist/version.txt to learn which commit Pages is serving.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('src', 'dist', { recursive: true });

let sha = 'unknown';
try {
  sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
} catch {
  // Not a git checkout (a tarball); the released hook then never matches.
}
await writeFile('dist/version.txt', `${sha}\n`);
