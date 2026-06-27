#!/usr/bin/env bash
# Full local verification: install deps and run every quality gate.
# Usage: bash scripts/verify.sh
set -euo pipefail

echo "==> pnpm install"
pnpm install

echo "==> lint"
pnpm run lint

echo "==> typecheck"
pnpm run typecheck

echo "==> test"
pnpm run test

echo "==> build"
pnpm run build

echo "✅ All checks passed"
