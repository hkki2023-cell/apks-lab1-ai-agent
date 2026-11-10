# Архітектура AI-агента build-engineer

## 1. Яку проблему вирішує агент
Створення навіть мінімального кросплатформного проєкту вимагає однакових
повторюваних дій: структура каталогів, `.gitignore`, система складання, тести,
CI для трьох ОС, перевірка результату. Агент формалізує ці дії в skills і commands,
тому результат відтворюваний: запуск `/init` у гілці `develop` дає той самий
проєкт, що й у гілці `feature/...`. Помилки не приховуються — оркестратор
зупиняється на першому кроці, що не пройшов перевірку.

## 2. Компоненти
| Компонент | Файл | Роль |
|---|---|---|
| Agent manifest | `.github/agents/build-engineer.agent.md` | Роль, область відповідальності, правила, заборонені дії, критерії завершення |
| Skill | `.github/skills/project-scaffold/SKILL.md` | Hello World, структура, README, `.gitignore` |
| Skill | `.github/skills/build-and-test/SKILL.md` | `package.json`, Jest, складання у виконуваний файл, `check.js` |
| Skill | `.github/skills/github-actions/SKILL.md` | `ci.sh`, `ci.bat`, `ci.yml` (matrix 3 ОС) |
| Command | `.github/prompts/git-init.prompt.md` | Репозиторій, `.gitignore`, стан Git |
| Command | `.github/prompts/create-project.prompt.md` | Викликає `project-scaffold` |
| Command | `.github/prompts/create-build.prompt.md` | Викликає `build-and-test` |
| Command | `.github/prompts/create-actions.prompt.md` | Викликає `github-actions` |
| Command | `.github/prompts/check.prompt.md` | Перевірка без змін (`npm run check`) |
| Orchestrator | `.github/prompts/init.prompt.md` | Послідовний запуск 5 commands |

## 3. Відповідність формату GitHub Copilot (VS Code)
Методичка рекомендує `.github/agents`, `.github/prompts`, `.github/skills` — саме ці
каталоги використовує GitHub Copilot у VS Code:
- `*.agent.md` — custom agent (вибирається у списку агентів Copilot Chat);
- `*.prompt.md` — prompt file, викликається в чаті як `/<назва>`; поле `agent: build-engineer`
  прив'язує command до агента;
- `skills/<name>/SKILL.md` — Agent Skill (увімкнено в `.vscode/settings.json`: `chat.useAgentSkills`).
  Commands додатково явно посилаються на шлях skill, тому працюють і без автопідбору skills.

## 4. Схема взаємодії
```
Користувач ──/init──► init.prompt.md (orchestrator)
                         │
   ┌─────────────────────┼───────────────────────────────────────────────┐
   ▼                     ▼                  ▼                   ▼         ▼
/git-init      /create-project       /create-build      /create-actions   /check
   │                     │                  │                   │         │
.gitignore      skill project-scaffold  skill build-and-test  skill github-actions  scripts/check.js
                src/hello.js, README    package.json, tests,  ci.sh, ci.bat,         PASS/FAIL
                                        build/hello           ci.yml
```
Усі кроки підпорядковані правилам manifest `build-engineer.agent.md`.

## 5. Дані між етапами
| Етап | Вхід | Вихід |
|---|---|---|
| git-init | робочий каталог | Git-репозиторій, `.gitignore` |
| create-project | `.gitignore`, мова `javascript`, назва `hello-js` | `src/hello.js`, секція README |
| create-build | `src/hello.js` (функція `add`) | `package.json`, `package-lock.json`, `tests/hello.test.js`, `scripts/*.js`, `build/hello` |
| create-actions | робочі `npm test` / `npm run build` | `ci.sh`, `ci.bat`, `.github/workflows/ci.yml` |
| check | усі файли | звіт PASS/FAIL, код виходу 0/1 |

## 6. Обробка помилок оркестратором
- Перед кожним кроком перевіряються передумови, після — перевірки з command.
- Перша помилка → `init STOPPED at step N (<command>): <причина>`, наступні кроки не виконуються.
- Повторний запуск ідемпотентний: файли, що збігаються з шаблоном, пропускаються (SKIP),
  `.gitignore` і README не дублюються, нічого не видаляється.
- Успіх фіксується лише після `check` з усіма PASS.

## 7. Збірка та CI
- Виконуваний файл — Node.js Single Executable Application: `scripts/build.js` копіює
  бінарник `node`, вбудовує в нього `src/hello.js` (postject) і запускає smoke-тест.
- `ci.yml` містить одну job `build-test` з matrix `ubuntu-latest`, `windows-latest`,
  `macos-latest`; виконує checkout, setup-node, `ci.sh`/`ci.bat` і зберігає артефакт
  `hello-<os>`. Уся логіка збірки — у скриптах, не в YAML.
