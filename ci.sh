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
