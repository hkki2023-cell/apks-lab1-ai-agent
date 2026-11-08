---
name: github-actions
description: Створює CI-скрипти ci.sh / ci.bat і workflow .github/workflows/ci.yml з однією job і matrix Windows/Linux/macOS. Використовувати в command /create-actions.
---

# Skill: github-actions

## Коли застосовувати
- Command `/create-actions` або `/init` (крок 4).
- Після `build-and-test`: `npm test` і `npm run build` уже працюють локально.

## Вхідні дані
| Параметр | Значення |
|---|---|
| Гілки | `develop`, `master` (push і pull_request), `feature/**` (push) |
| ОС | `ubuntu-latest`, `windows-latest`, `macos-latest` |
| Node.js у CI | 22 |
| Скрипти збірки | `ci.sh` (Linux/macOS), `ci.bat` (Windows) |

## Результат
- `ci.sh` (LF, виконуваний: `git update-index --chmod=+x ci.sh`) і `ci.bat` (CRLF):
  встановлення залежностей → `npm test` → `npm run build` → запуск виконуваного файлу.
- `.github/workflows/ci.yml`: **одна** job `build-test` з `strategy.matrix.os`;
  кроки: checkout → setup-node → виклик `ci.sh`/`ci.bat` → upload-artifact з виконуваним файлом.
- **Правило:** `ci.yml` не викликає `npm` напряму — лише `ci.sh`/`ci.bat`. Жодних `secrets.*`.

Створюй файли **дослівно** за шаблонами нижче. Якщо файл існує і збігається — SKIP; якщо відрізняється — покажи diff і запитай користувача.

### `ci.sh`

````bash
#!/usr/bin/env bash
# CI entry point for Linux and macOS. Called by .github/workflows/ci.yml
# and can be run locally: ./ci.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "== [1/4] install dependencies =="
if [ -f package-lock.json ]; then npm ci; else npm install; fi

echo "== [2/4] unit tests (Jest) =="
npm test

echo "== [3/4] build executable =="
npm run build

echo "== [4/4] run executable =="
./build/hello
echo "CI OK"
````

### `ci.bat` (зберегти з кінцями рядків CRLF)

````bat
@echo off
rem CI entry point for Windows. Called by .github/workflows/ci.yml
rem and can be run locally: ci.bat
setlocal
cd /d "%~dp0"

echo == [1/4] install dependencies ==
if exist package-lock.json (call npm ci) else (call npm install)
if errorlevel 1 exit /b 1

echo == [2/4] unit tests (Jest) ==
call npm test
if errorlevel 1 exit /b 1

echo == [3/4] build executable ==
call npm run build
if errorlevel 1 exit /b 1

echo == [4/4] run executable ==
build\hello.exe
if errorlevel 1 exit /b 1
echo CI OK
````

### `.github/workflows/ci.yml`

````yaml
name: CI

on:
  push:
    branches: [develop, master, 'feature/**']
  pull_request:
    branches: [develop, master]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build-test:
    name: build-test (${{ matrix.os }})
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Configure, build and test (Linux / macOS)
        if: runner.os != 'Windows'
        shell: bash
        run: ./ci.sh

      - name: Configure, build and test (Windows)
        if: runner.os == 'Windows'
        shell: cmd
        run: ci.bat

      - name: Upload executable
        uses: actions/upload-artifact@v4
        with:
          name: hello-${{ matrix.os }}
          path: |
            build/hello
            build/hello.exe
          if-no-files-found: error
````

## Перевірка
```bash
node scripts/check.js --static     # рядок "PASS  ci.yml"
./ci.sh                            # локальний прогін того самого сценарію, що й у CI ("CI OK")
git add ci.sh && git update-index --chmod=+x ci.sh   # біт виконання для Linux/macOS runner
```
Після push: вкладка **Actions** → workflow **CI** → три зелені job
`build-test (ubuntu-latest)`, `build-test (windows-latest)`, `build-test (macos-latest)`
і три артефакти `hello-<os>`.

## Типова помилка
| Симптом | Причина | Дія |
|---|---|---|
| `./ci.sh: Permission denied` на Linux/macOS | Не встановлено біт виконання в Git | `git update-index --chmod=+x ci.sh`, commit |
| `'ci.bat' is not recognized` / дивні символи | `ci.bat` збережено з LF | Перезберегти з CRLF |
| `No files were found with the provided path` | Збірка не створила `build/hello*` | Дивитись лог кроку `ci.sh`/`ci.bat` |
| Workflow не запускається | Неправильні гілки в `on:` або файл не в `.github/workflows/` | Звірити з шаблоном |

## Приклад
**Вхід:** `/create-actions` після `/create-build`.
**Очікуваний результат:** `ci.sh`, `ci.bat`, `.github/workflows/ci.yml` створено;
`node scripts/check.js --static` → `PASS  ci.yml`; `./ci.sh` закінчується рядком `CI OK`.
