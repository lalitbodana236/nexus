#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

git config core.hooksPath .githooks
Write-Host "Configured git hooks path to .githooks"
