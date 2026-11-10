---
agent: build-engineer
description: Викликає skill github-actions — створює ci.sh, ci.bat і .github/workflows/ci.yml (Windows, Linux, macOS).
---

# Command: /create-actions

## Передумови
- `npm test` і `npm run build` проходять локально (виконано `/create-build`).

## Дії
1. Прочитати `.github/skills/github-actions/SKILL.md`.
2. Створити `ci.sh` (LF), `ci.bat` (CRLF), `.github/workflows/ci.yml` за шаблонами (SKIP, якщо збігаються).
3. Встановити біт виконання: `git add ci.sh` і `git update-index --chmod=+x ci.sh`
   (Linux/macOS: також `chmod +x ci.sh`).
4. Виконати `node scripts/check.js --static`.
5. Локально запустити `./ci.sh` (Windows: `ci.bat`).
6. Додати запис у `docs/ai-log.md`.

## Очікувані файли
- `ci.sh`, `ci.bat`, `.github/workflows/ci.yml`

## Перевірка
```bash
node scripts/check.js --static   # PASS  ci.yml
./ci.sh                          # останній рядок: CI OK
```

## Помилка
- `FAIL ci.yml` → "create-actions FAILED: ci.yml" + причина з check; виправити за шаблоном.
- `./ci.sh` впав → "create-actions FAILED: локальний CI" + номер кроку `[n/4]`.
