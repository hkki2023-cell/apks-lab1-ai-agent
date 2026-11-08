# Лабораторна робота №1 — AI-агент для автоматизації розробки та CI/CD

| | |
|---|---|
| Студент | Кузнєцов Григорій Д. |
| Група | КІ-409 |
| Дисципліна | Автоматизоване проєктування комп'ютерних систем |
| Варіант | 3 — JavaScript, npm scripts, Jest |
| AI-інструмент | GitHub Copilot (VS Code, режим Agent, custom agent `build-engineer`) |

AI-агент `build-engineer` за допомогою skills і commands генерує кросплатформний
проєкт Hello World, систему складання у виконуваний файл, юніт-тести Jest і
GitHub Actions для Windows, Linux і macOS.

## Як запустити агента
1. Відкрити репозиторій у VS Code, увійти в GitHub Copilot.
2. Перейти на гілку `feature/...`: `git switch -c feature/lab1-hello-js`.
3. Відкрити Copilot Chat → вибрати агента **build-engineer**.
4. Ввести `/init` — оркестратор виконає `/git-init` → `/create-project` →
   `/create-build` → `/create-actions` → `/check`.
5. Окремі операції: `/git-init`, `/create-project`, `/create-build`,
   `/create-actions`, `/check`.

Детально: [docs/usage.md](docs/usage.md). Архітектура агента:
[docs/architecture.md](docs/architecture.md). Журнал AI: [docs/ai-log.md](docs/ai-log.md).

## Структура агента
```
.github/
├── agents/build-engineer.agent.md     # manifest агента
├── prompts/                           # commands
│   ├── git-init.prompt.md
│   ├── create-project.prompt.md
│   ├── create-build.prompt.md
│   ├── create-actions.prompt.md
│   ├── check.prompt.md
│   └── init.prompt.md                 # orchestrator
└── skills/
    ├── project-scaffold/SKILL.md
    ├── build-and-test/SKILL.md
    └── github-actions/SKILL.md
```

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
