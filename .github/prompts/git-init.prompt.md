---
agent: build-engineer
description: Перевіряє Git-репозиторій, створює або оновлює .gitignore, показує стан Git.
---

# Command: /git-init

## Передумови
- Встановлено `git`; відкрито кореневий каталог репозиторію.

## Дії
1. `git rev-parse --is-inside-work-tree`. Якщо це не репозиторій — `git init -b master`.
   Якщо репозиторій є — нічого не ініціалізувати повторно.
2. Показати поточну гілку (`git branch --show-current`) і remote (`git remote -v`).
   Якщо поточна гілка `master` або `develop` — попередити, що генерацію проєкту
   треба робити у гілці `feature/...` (саму гілку не створювати без дозволу).
3. Створити `.gitignore` або дописати відсутні рядки з шаблону skill
   `project-scaffold` (`.github/skills/project-scaffold/SKILL.md`). Наявні рядки не дублювати.
4. Перевірити, що в індексі немає `build/`, `node_modules/`, `.env`.
5. Показати `git status --short`.
6. Додати запис у `docs/ai-log.md`.

## Очікувані файли
- `.gitignore`

## Перевірка
```bash
git rev-parse --is-inside-work-tree     # true
git check-ignore build/ node_modules/   # обидва рядки
git status --short
```

## Помилка
- `fatal: not a git repository` після кроку 1 → "git-init FAILED: не вдалося ініціалізувати репозиторій".
- Знайдено `build/` або `node_modules/` в індексі → "git-init FAILED: build-каталоги під Git-контролем;
  виконайте `git rm -r --cached build node_modules` (тільки після підтвердження користувача)". Самому не виконувати.
