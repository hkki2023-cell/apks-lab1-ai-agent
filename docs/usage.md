# Інструкція запуску

## 1. Передумови
- Git, VS Code з розширенням **GitHub Copilot** (Copilot Chat), активний Copilot Student.
- Node.js 22 LTS (`node --version` → v22.x або новіше).
- macOS: Xcode Command Line Tools (`codesign`).

## 2. Запуск AI-агента
```bash
git clone https://github.com/<user>/<repo>.git
cd <repo>
git switch develop
git switch -c feature/lab1-hello-js
code .
```
У VS Code: Copilot Chat → вибрати агента **build-engineer** → режим Agent.

| Що зробити | Ввести в чаті |
|---|---|
| Повний сценарій (orchestrator) | `/init` |
| Перевірити репозиторій і `.gitignore` | `/git-init` |
| Створити Hello World | `/create-project` |
| Створити збірку і тести | `/create-build` |
| Створити GitHub Actions | `/create-actions` |
| Перевірити все (без змін) | `/check` |

Copilot запитує дозвіл на кожну термінальну команду — переглядати й підтверджувати.

## 3. Локальна перевірка (без AI)
```bash
npm install
npm start            # Hello, World!
npm test             # 4 passed, серед них BasicAddition
npm run build        # build/hello  (Windows: build\hello.exe)
./build/hello        # Hello, World!
npm run check        # N/N checks passed
./ci.sh              # Linux/macOS: повний CI-сценарій
ci.bat               # Windows
git status --short   # build/ і node_modules/ не показуються
```

## 4. Демонстрація навмисно зламаної перевірки
1. У `tests/hello.test.js` змінити `expect(add(2, 3)).toBe(5)` на `toBe(6)`.
2. `npm run check` → `FAIL  npm test (Jest)`, код виходу 1; `/init` зупиняється на кроці 3.
3. Після push — job у GitHub Actions червоні на всіх трьох ОС.
4. Повернути `toBe(5)` (`git checkout -- tests/hello.test.js`) → усе знову PASS.

## 5. Git-процес
```bash
git switch develop                    # тут лише агент та інструкції
git switch -c feature/lab1-hello-js   # тут результат /init
# окремі коміти: агент / skills+commands / проєкт / CI
git push -u origin feature/lab1-hello-js
```
Pull request `feature/lab1-hello-js` → `develop` з назвою `lab1/finish`;
після перевірки — merge `develop` → `master`.
