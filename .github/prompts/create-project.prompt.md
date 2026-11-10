---
agent: build-engineer
description: Викликає skill project-scaffold і створює початковий проєкт Hello World (JavaScript).
---

# Command: /create-project

## Передумови
- Виконано `/git-init` (є `.gitignore`, це Git-репозиторій).
- `node --version` ≥ 22.

## Дії
1. Прочитати `.github/skills/project-scaffold/SKILL.md`.
2. Створити каталоги `src/`, `tests/`, `scripts/`, `docs/`.
3. Створити `src/hello.js` за шаблоном (SKIP, якщо збігається).
4. Оновити `.gitignore` і секцію README між маркерами `hello-project:start/end`.
5. Виконати перевірки skill.
6. Додати запис у `docs/ai-log.md`.

## Очікувані файли
- `src/hello.js`, `.gitignore`, `README.md` (секція «Проєкт Hello World»)

## Перевірка
```bash
node src/hello.js        # Hello, World!
```

## Помилка
- Вивід не `Hello, World!` → "create-project FAILED: src/hello.js не відповідає шаблону" і показати diff.
- Немає Node.js 22 → "create-project FAILED: потрібен Node.js >= 22".
