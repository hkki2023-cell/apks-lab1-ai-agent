'use strict';

/**
 * Read-only project check (command "check").
 * Does NOT modify tracked files. Verifies agent structure, project structure,
 * build config, CI workflow, .gitignore, secrets, then runs tests and build.
 *
 * Usage: npm run check            full check (static + tests + build)
 *        node scripts/check.js --static   only static checks (no npm)
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const staticOnly = process.argv.includes('--static');
const results = [];

const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

function check(name, fn) {
  try {
    const detail = fn();
    results.push({ name, ok: true, detail: detail || '' });
  } catch (e) {
    results.push({ name, ok: false, detail: e.message });
  }
}
function must(cond, msg) {
  if (!cond) throw new Error(msg);
}
function mustContain(file, needles) {
  must(exists(file), `${file} is missing`);
  const text = rd(file);
  const missing = needles.filter((n) => !text.includes(n));
  must(missing.length === 0, `${file}: missing ${missing.map((m) => `"${m}"`).join(', ')}`);
}

// ---- 1. Agent ---------------------------------------------------------------
check('agent manifest', () => {
  mustContain('.github/agents/build-engineer.agent.md', [
    '## Роль', '## Область відповідальності', '## Правила роботи з файлами',
    '## Заборонені дії', '## Критерії успішного завершення',
  ]);
});

const SKILLS = ['project-scaffold', 'build-and-test', 'github-actions'];
const SKILL_SECTIONS = ['## Коли застосовувати', '## Вхідні дані', '## Результат',
  '## Перевірка', '## Типова помилка', '## Приклад'];
for (const s of SKILLS) {
  check(`skill ${s}`, () => mustContain(`.github/skills/${s}/SKILL.md`, [`name: ${s}`, ...SKILL_SECTIONS]));
}

const COMMANDS = ['git-init', 'create-project', 'create-build', 'create-actions', 'check', 'init'];
for (const c of COMMANDS) {
  check(`command ${c}`, () => mustContain(`.github/prompts/${c}.prompt.md`,
    ['description:', '## Передумови', '## Дії', '## Очікувані файли', '## Перевірка', '## Помилка']));
}

check('init order', () => {
  const t = rd('.github/prompts/init.prompt.md');
  const order = ['/git-init', '/create-project', '/create-build', '/create-actions', '/check'];
  const pos = order.map((c) => t.indexOf(c));
  must(pos.every((p) => p >= 0), 'init must reference all 5 commands');
  must(pos.every((p, i) => i === 0 || p > pos[i - 1]), `wrong order: ${order.join(' -> ')} expected`);
  return order.join(' -> ');
});

// ---- 2. Project ------------------------------------------------------------
check('project files', () => {
  for (const f of ['src/hello.js', 'tests/hello.test.js', 'package.json', 'sea-config.json',
    'scripts/build.js', 'ci.sh', 'ci.bat', 'README.md', 'docs/architecture.md', 'docs/usage.md']) {
    must(exists(f), `${f} is missing`);
  }
});
check('BasicAddition test', () => mustContain('tests/hello.test.js', ["test('BasicAddition'"]));
check('package.json scripts', () => {
  const pkg = JSON.parse(rd('package.json'));
  for (const s of ['test', 'build', 'start', 'check']) must(pkg.scripts && pkg.scripts[s], `scripts.${s} missing`);
  must(pkg.devDependencies && pkg.devDependencies.jest, 'jest is not in devDependencies');
});

// ---- 3. CI -----------------------------------------------------------------
check('ci.yml', () => {
  const f = '.github/workflows/ci.yml';
  mustContain(f, ['push:', 'pull_request:', 'develop', 'master', 'matrix:',
    'ubuntu-latest', 'windows-latest', 'macos-latest', 'actions/checkout', './ci.sh', 'ci.bat']);
  const y = rd(f);
  must(!/\t/.test(y), 'YAML must not contain tab characters');
  must(!/npm (ci|install|test|run)/.test(y), 'ci.yml must only call ci.sh / ci.bat, not npm directly');
  must(!/secrets\./.test(y), 'ci.yml must not use secrets');
});

// ---- 4. Git hygiene --------------------------------------------------------
check('.gitignore', () => mustContain('.gitignore', ['node_modules/', 'build/', '.env']));
check('no build dirs / secrets in git', () => {
  let files;
  try {
    files = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  } catch {
    return 'skipped: not a git repository';
  }
  const bad = files.filter((f) => /^(build|node_modules|coverage|dist)\//.test(f) || /\.(blob|pem|key)$/.test(f) || /(^|\/)\.env/.test(f));
  must(bad.length === 0, `tracked forbidden files: ${bad.join(', ')}`);
  const secretRe = /(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
  const leaks = files.filter((f) => f !== 'scripts/check.js' && exists(f) && fs.statSync(path.join(root, f)).size < 1e6
    && secretRe.test(rd(f)));
  must(leaks.length === 0, `possible secrets in: ${leaks.join(', ')}`);
  return `${files.length} tracked files`;
});

// ---- 5. Tests and build ----------------------------------------------------
if (!staticOnly) {
  const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });
  check('npm test (Jest)', () => run('npm test'));
  check('npm run build (executable + smoke test)', () => run('npm run build'));
}

// ---- Report ----------------------------------------------------------------
console.log('\n===== check report =====');
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  -- ${r.detail}` : ''}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
