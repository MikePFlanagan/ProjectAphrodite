#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const commands = {
  ship,
  sprint,
  parking: () => printDocument('docs/PARKING_LOT.md'),
  roadmap: () => printDocument('docs/ROADMAP.md'),
  manifesto: () => printDocument('docs/MANIFESTO.md'),
  traditions: () => printDocument('docs/TRADITIONS.md'),
  status,
  love,
};

const command = process.argv[2];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

if (!(command in commands)) {
  console.error(`Unknown Founder CLI command: ${command}\n`);
  printHelp();
  process.exit(1);
}

try {
  commands[command]();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Founder CLI could not complete "${command}": ${message}`);
  process.exitCode = 1;
}

function printHelp() {
  console.log(`Founder CLI — Project Aphrodite

Usage:
  pnpm founder <command>

Commands:
  ship        Show the release checklist
  sprint      Show the current sprint focus
  parking     Read the parking lot
  roadmap     Read the founder roadmap
  manifesto   Read the project manifesto
  traditions  Read the engineering traditions
  status      Show the repository's Git status
  love        Get a little founder encouragement
  help        Show this help`);
}

function ship() {
  console.log(String.raw`
  ____  _   _ ___ ____    ___ _____ _
 / ___|| | | |_ _|  _ \  |_ _|_   _| |
 \___ \| |_| || || |_) |  | |  | | | |
  ___) |  _  || ||  __/   | |  | | |_|
 |____/|_| |_|___|_|     |___| |_| (_)
`);
  console.log(`Release checklist:
  [ ] The next brick is focused and complete
  [ ] Lint, typecheck, tests, and build pass
  [ ] Documentation reflects reality
  [ ] The diff contains no accidental changes
  [ ] The product test passes: Does this make the relationship better?
  [ ] Risks and rollback notes are understood`);
}

function sprint() {
  console.log(`Current sprint: Sprint 001 — Founder CLI and repository traditions

Focus: Establish the project's operating principles and a small, dependable command-line companion.

What's the next brick?`);
}

function printDocument(relativePath) {
  const path = join(repositoryRoot, relativePath);

  try {
    process.stdout.write(readFileSync(path, 'utf8'));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
        `${relativePath} is unavailable. Restore it in the repository and try again.`,
      );
    }
    throw error;
  }
}

function git(...args) {
  try {
    return execFileSync('git', ['-C', repositoryRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    const detail =
      error && typeof error === 'object' && 'stderr' in error
        ? String(error.stderr).trim()
        : 'Git is unavailable.';
    throw new Error(detail || 'Git is unavailable.');
  }
}

function status() {
  const branch = git('branch', '--show-current') || 'detached HEAD';
  const changes = git('status', '--porcelain');
  const latestCommit = git('log', '-1', '--format=%h %s (%cr)');

  console.log(`Founder status

Branch:       ${branch}
Working tree: ${changes ? 'changes present' : 'clean'}
Latest commit: ${latestCommit}`);
}

function love() {
  const encouragements = [
    'Craft matters, especially when nobody is watching.',
    'Perseverance is the quiet work between the exciting moments.',
    'Protect the trust people place in what we build.',
    'Keep your humor. Serious work does not require a joyless heart.',
    'The whole dream is built one honest brick at a time.',
  ];
  const message = encouragements[Math.floor(Math.random() * encouragements.length)];

  console.log(`${message}\n\n❤️ ONE BRICK.\n\n🚢 SHIP IT.`);
}
