# Full local verification: install deps and run every quality gate.
# Usage: pwsh scripts/verify.ps1
$ErrorActionPreference = 'Stop'

Write-Host '==> pnpm install'
pnpm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> lint'
pnpm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> typecheck'
pnpm run typecheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> test'
pnpm run test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> build'
pnpm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'All checks passed' -ForegroundColor Green
