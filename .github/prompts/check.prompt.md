---
agent: build-engineer
description: Перевіряє структуру агента, проєкт, конфігурацію, складання, тести і YAML workflow. Нічого не змінює.
---

# Command: /check

## Передумови
- Виконано `/create-build` (є `scripts/check.js` і `node_modules/`).

## Дії
1. **Не змінювати жодного файлу**, що відстежується Git (дозволено лише `build/`, який у `.gitignore`).
2. Виконати `npm run check` (= `node scripts/check.js`): перевіряє manifest, 3 skills,
   6 commands, порядок у `/init`, файли проєкту, тест `BasicAddition`, `ci.yml`
   (3 ОС, лише `ci.sh`/`ci.bat`, без secrets, без табуляції), `.gitignore`,
   відсутність build-каталогів і секретів у Git, `npm test`, `npm run build`.
3. Додатково вручну переглянути: чи має кожен skill входи/виходи/перевірки,
   чи кожна command однозначна.
4. Виконати `git status --short` і переконатися, що check нічого не змінив.
5. Вивести таблицю PASS/FAIL. Додати запис у `docs/ai-log.md`.

## Очікувані файли
- Нових файлів немає (лише `build/`, ігнорований Git).

## Перевірка
```bash
npm run check     # останній рядок: N/N checks passed, код виходу 0
git status --short
```

## Помилка
- Будь-який FAIL → "check FAILED: <назва перевірки> — <причина>", код виходу 1.
  Нічого не виправляти автоматично — лише запропонувати, яку command перезапустити.
