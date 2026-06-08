#!/usr/bin/env node
/*
 * Cuts a GitHub release for the version currently in package.json, automating
 * the manual post-publish steps:
 *
 *   1. confirm the working tree is clean and on the default branch
 *   2. confirm that version is already published to npm (publish-first)
 *   3. confirm the release/tag does not already exist
 *   4. build lib/ and zip it to lib.zip (the release asset convention)
 *   5. create the GitHub release (which creates the lightweight v<version> tag)
 *      pinned to the current commit, with notes from the CHANGELOG, and attach
 *      lib.zip
 *
 * This does NOT publish to npm; run `npm publish` first. Pass --dry-run to
 * print the plan without creating anything.
 *
 * Usage: node scripts/release.mjs [--dry-run]
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';

const DRY_RUN = process.argv.includes('--dry-run');
const DEFAULT_BRANCH = 'master';

const log = (msg) => console.log(`[release] ${msg}`);
const fail = (msg) => {
  console.error(`[release] error: ${msg}`);
  process.exit(1);
};

// Run a command, returning trimmed stdout. Throws on non-zero exit.
const run = (cmd, args) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Run a command, returning { ok, out } instead of throwing.
const tryRun = (cmd, args) => {
  try {
    return { ok: true, out: run(cmd, args) };
  } catch (e) {
    return { ok: false, out: `${e.stdout || ''}${e.stderr || ''}`.trim() };
  }
};

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const { name, version } = pkg;
const tag = `v${version}`;

// Derive the canonical repo URL from the repository field.
const repoUrl = String(pkg.repository?.url || pkg.repository || '')
  .replace(/^git\+/, '')
  .replace(/\.git$/, '');
if (!repoUrl.startsWith('http')) fail('could not derive an https repository URL from package.json');

log(`preparing release ${tag} for ${name}`);

// 1. Clean tree on the default branch.
const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
if (branch !== DEFAULT_BRANCH) fail(`must release from "${DEFAULT_BRANCH}", currently on "${branch}"`);
if (run('git', ['status', '--porcelain'])) fail('working tree is not clean; commit or stash first');

const sha = run('git', ['rev-parse', 'HEAD']);
log(`commit: ${sha}`);

// 2. Publish-first: the version must already exist on npm.
const npmVersion = tryRun('npm', ['view', `${name}@${version}`, 'version']);
if (!npmVersion.ok || npmVersion.out !== version) {
  fail(`${name}@${version} is not on the npm registry yet. Run "npm publish" first.`);
}
log(`confirmed ${name}@${version} is published`);

// 3. The release must not already exist.
if (tryRun('gh', ['release', 'view', tag]).ok) fail(`release ${tag} already exists`);

// Notes: the CHANGELOG section for this version + a compare link.
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const startIdx = changelog.indexOf(`## [${version}]`);
if (startIdx === -1) fail(`no CHANGELOG.md section found for [${version}]`);
const bodyStart = changelog.indexOf('\n', startIdx) + 1;
const rest = changelog.slice(bodyStart);
// The section ends at the next version heading or the trailing link-reference
// block (`[x.y.z]: url`), whichever comes first. The link-reference bound
// matters for the oldest entry, which has no following heading.
const bounds = [rest.search(/\n## \[/), rest.search(/\n\[[^\]]+\]:\s/)].filter((i) => i !== -1);
const section = rest.slice(0, bounds.length ? Math.min(...bounds) : rest.length).trim();

const versions = [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
const prev = versions[versions.indexOf(version) + 1];
const compareUrl = prev
  ? `${repoUrl}/compare/v${prev}...${tag}`
  : `${repoUrl}/releases/tag/${tag}`;
const notes = `${section}\n\n**Full changelog:** ${compareUrl}`;

if (DRY_RUN) {
  log('dry run: no release will be created');
  log(`tag:     ${tag}`);
  log(`target:  ${sha}`);
  log(`asset:   lib.zip (from lib/)`);
  log('notes:');
  console.log(notes);
  process.exit(0);
}

// 4. Build and zip the asset.
log('building lib/');
run('yarn', ['build']);
rmSync('lib.zip', { force: true });
log('zipping lib.zip');
run('zip', ['-r', 'lib.zip', 'lib/']);

// 5. Create the release (creates the tag) and attach the asset.
try {
  log(`creating release ${tag}`);
  const url = run('gh', [
    'release',
    'create',
    tag,
    'lib.zip',
    '--target',
    sha,
    '--title',
    tag,
    '--notes',
    notes,
  ]);
  log(`released: ${url}`);
} finally {
  rmSync('lib.zip', { force: true });
}
