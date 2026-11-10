---
agent: build-engineer
description: Викликає skill build-and-test — створює package.json, тести Jest, скрипти збірки й перевірки, ставить залежності.
---

# Command: /create-build

## Передумови
- Існує `src/hello.js` (виконано `/create-project`).
- Є доступ до npm registry.

## Дії
1. Прочитати `.github/skills/build-and-test/SKILL.md`.
2. Створити `package.json`, `sea-config.json`, `tests/hello.test.js`,
   `scripts/build.js`, `scripts/check.js` за шаблонами (SKIP, якщо збігаються).
3. Виконати `npm install` (з'явиться `package-lock.json`).
4. Виконати `npm test`, потім `npm run build`.
5. Перевірити, що `git status --short` не показує `build/` і `node_modules/`.
6. Додати запис у `docs/ai-log.md` з підсумком тестів.

## Очікувані файли
- `package.json`, `package-lock.json`, `sea-config.json`, `tests/hello.test.js`,
  `scripts/build.js`, `scripts/check.js`
- (не в Git) `build/hello` або `build\hello.exe`

## Перевірка
```bash
npm test          # Tests: 4 passed; є BasicAddition
npm run build     # [build] 5/5 OK
```

## Помилка
- Тести впали → "create-build FAILED: npm test" + вивід Jest; `/create-actions` не запускати.
- Збірка впала → "create-build FAILED: npm run build" + рядок `[build] FAILED: ...`.
