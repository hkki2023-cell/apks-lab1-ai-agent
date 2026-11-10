---
agent: build-engineer
description: Оркестратор. Послідовно запускає git-init, create-project, create-build, create-actions і check; зупиняється на першій помилці.
---

# Command: /init (orchestrator)

## Передумови
- Встановлено `git` і Node.js ≥ 22, є доступ до npm registry.
- Поточна гілка — `feature/...` (якщо `master`/`develop` — запитати користувача, чи продовжувати).

## Дії
Виконати кроки **строго в такому порядку**. Кожен крок виконується за інструкцією
відповідного файлу `.github/prompts/<name>.prompt.md`.

| Крок | Command | Вхід від попереднього кроку | Вихід для наступного кроку |
|---|---|---|---|
| 1 | `/git-init` | — | репозиторій, `.gitignore` |
| 2 | `/create-project` | `.gitignore` | `src/hello.js`, README |
| 3 | `/create-build` | `src/hello.js` | `package.json`, тести, `build/hello` |
| 4 | `/create-actions` | робочі `npm test` і `npm run build` | `ci.sh`, `ci.bat`, `ci.yml` |
| 5 | `/check` | усі файли | звіт PASS/FAIL |

Правила оркестратора:
1. Перед кроком перевірити його передумови; після кроку — його перевірки.
2. Якщо крок завершився помилкою — **зупинитися**, не виконувати наступні кроки,
   вивести "init STOPPED at step N (<command>): <причина>".
3. Повторний запуск `/init` безпечний: кроки, файли яких уже відповідають шаблонам,
   повідомляють SKIP; нічого не дублюється й не видаляється.
4. Не робити `git commit`/`git push` — лише запропонувати коміти:
   `feat(agent)`, `feat(project)`, `build: npm scripts + jest`, `ci: github actions`.
5. Роботу вважати успішною **лише** якщо крок 5 (`/check`) повернув усі PASS.

## Очікувані файли
Усі файли skills `project-scaffold`, `build-and-test`, `github-actions` + `package-lock.json`
+ запис у `docs/ai-log.md`.

## Перевірка
```bash
npm run check     # N/N checks passed
```

## Помилка
- "init STOPPED at step N (<command>): <причина>" + вивід помилки + пропозиція,
  яку command перезапустити після виправлення.
- Фінальне повідомлення успіху: "init DONE: 5/5 steps, check passed".
