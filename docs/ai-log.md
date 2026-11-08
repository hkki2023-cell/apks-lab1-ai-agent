# Журнал взаємодії з AI

Інструмент: GitHub Copilot Chat (VS Code), агент `build-engineer`.
Формат запису: дата, запит, ключова відповідь/дія AI, результат перевірки, рішення.

| № | Дата | Запит (command) | Що зробив AI | Перевірка | Рішення / виправлення |
|---|---|---|---|---|---|
| 1 | 2026-11-08 | `/git-init` | Створено `.gitignore`, перевірено гілку `feature/lab1-hello-js`, remote і правила ігнорування | `git check-ignore build\ node_modules\` — PASS | Помилок немає |
| 2 | 2026-11-08 | `/create-project` | Створено `src/hello.js` і секцію Hello World у README | `node src/hello.js`, `node src/hello.js Lviv`, `add(2,3)` — PASS | Помилок немає |
| 3 | 2026-11-08 | `/create-build` | Створено npm/Jest/SEA-конфігурацію, тести та скрипти; встановлено залежності | `npm test` — 4/4; `npm run build` — smoke-тест PASS | npm audit повідомив 6 low severity vulnerabilities; виправлення не застосовувалось |
| 4 | 2026-11-08 | `/create-actions` | Створено `ci.sh`, `ci.bat`, workflow для Ubuntu/Windows/macOS; встановлено executable bit | static — 17/17; `ci.bat` — `CI OK` | SEA вивів штатне попередження postject про signature |
| 5 | 2026-11-08 | `/check` | Фінальна read-only перевірка структури, CI, Git hygiene, тестів і збірки | `npm run check` — 19/19 PASS | Помилок немає |
| 6 | 2026-11-08 | `/init` повторно: `/git-init`, `/create-project` | Перевірено наявний `.gitignore` і файли проєкту; повторне створення пропущено (SKIP) | Smoke-перевірки Hello World і `add(2,3)` — PASS | Нічого не перезаписувалось |
| 7 | 2026-11-08 | `/create-build` повторно | Перевірено наявні build-конфігурацію, тести й скрипти; виконано `npm install` | `npm test` — 4/4; `npm run build` — PASS | npm audit повідомив 6 low severity vulnerabilities |
| 8 | 2026-11-08 | `/create-actions` повторно | CI-файли відповідають шаблонам (SKIP), executable bit перевірено | static — 17/17; `ci.bat` — `CI OK` | SEA вивів штатне попередження postject про signature |
| 9 | 2026-11-08 | `/check` повторно | Фінальна read-only перевірка повторного init | `npm run check` — 19/19 PASS | Помилок немає |
