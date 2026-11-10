---
name: project-scaffold
description: Створює мінімальний кросплатформний Hello World на JavaScript (Node.js), структуру каталогів, секцію README і .gitignore. Використовувати в command /create-project.
---

# Skill: project-scaffold

## Коли застосовувати
- Command `/create-project` або `/init` (крок 2).
- У репозиторії ще немає `src/hello.js` або його треба привести до шаблону.

## Вхідні дані
| Параметр | Значення за замовчуванням |
|---|---|
| Мова | `javascript` (варіант 3) |
| Назва проєкту | `hello-js` |
| Корінь репозиторію | поточний workspace, вже ініціалізований `/git-init` |

Якщо користувач передав іншу мову, ніж `javascript`, — зупинитися: цей skill
підтримує лише варіант 3.

## Результат
- Каталоги `src/`, `tests/`, `scripts/`, `docs/`.
- `src/hello.js` — функції `add`, `greet`, `main`; при запуску друкує `Hello, World!`.
- `.gitignore` — містить усі рядки з шаблону (відсутні рядки дописати в кінець, наявні не дублювати).
- `README.md` — секція між маркерами `<!-- hello-project:start -->` і
  `<!-- hello-project:end -->`. Якщо маркери вже є — замінити лише вміст між ними;
  якщо немає — дописати секцію в кінець. Інший текст README не чіпати.

Створюй файли **дослівно** за шаблонами нижче. Якщо файл існує і збігається — SKIP; якщо відрізняється — покажи diff і запитай користувача.

### `src/hello.js`

````javascript
'use strict';

/**
 * Hello World application (variant 3: JavaScript + npm scripts + Jest).
 * The file is self-contained (no local require) so it can be packed
 * into a Node.js Single Executable Application (build/hello).
 */

/** Adds two numbers. Used by the BasicAddition unit test. */
function add(a, b) {
  return a + b;
}

/** Returns a greeting string. */
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

/** Entry point: prints the greeting, returns the exit code. */
function main(argv = []) {
  console.log(greet(argv[0]));
  return 0;
}

module.exports = { add, greet, main };

let isSea = false;
try {
  isSea = require('node:sea').isSea();
} catch {
  isSea = false;
}

if (isSea || require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
````

### `.gitignore`

````gitignore
# dependencies
node_modules/

# build output (executables, SEA blobs)
build/
dist/
*.blob

# test / coverage output
coverage/
junit.xml

# logs and caches
npm-debug.log*
.npm/
.cache/

# OS / editor files
.DS_Store
Thumbs.db
.vscode/*
!.vscode/settings.json

# secrets: never commit
.env
.env.*
*.pem
*.key
````

### Секція `README.md`

````markdown
<!-- hello-project:start -->
## Проєкт Hello World

| Параметр | Значення |
|---|---|
| Мова | JavaScript (Node.js 22) |
| Система складання/запуску | npm scripts |
| Тестування | Jest |
| Виконуваний файл | `build/hello` (Linux/macOS), `build\hello.exe` (Windows) |

```bash
npm install        # залежності (jest, postject)
npm start          # Hello, World!
npm test           # юніт-тести, у т.ч. BasicAddition
npm run build      # виконуваний файл build/hello + smoke-тест
npm run check      # повна перевірка проєкту і агента
./ci.sh            # те саме, що робить CI (Windows: ci.bat)
```
<!-- hello-project:end -->
````

## Перевірка
```bash
node src/hello.js          # очікується: Hello, World!
node src/hello.js Lviv     # очікується: Hello, Lviv!
node -e "console.log(require('./src/hello').add(2,3))"   # очікується: 5
git check-ignore build/ node_modules/                    # обидва шляхи мають вивестись
```

## Типова помилка
| Симптом | Причина | Дія |
|---|---|---|
| `SyntaxError` при `node src/hello.js` | Файл змінено не за шаблоном | Відновити шаблон, повторити перевірку |
| `node: command not found` | Не встановлено Node.js ≥ 22 | Зупинитися, попросити встановити Node.js 22 LTS |
| `git check-ignore` нічого не вивів | Рядки не дописані в `.gitignore` | Дописати рядки з шаблону |

## Приклад
**Вхід:** `/create-project` у репозиторії після `/git-init`, мова `javascript`, назва `hello-js`.
**Очікуваний вивід перевірки:**
```
Hello, World!
Hello, Lviv!
5
build/
node_modules/
```
