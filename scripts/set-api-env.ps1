# ============================================================
# One-time setup: wires the admin credentials into Vercel env vars
# Run:  powershell -File scripts\set-api-env.ps1
# The password is typed into YOUR terminal and never stored in chat/logs.
# ============================================================
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

$email = Read-Host 'Supabase admin email'
$secure = Read-Host 'Supabase admin password' -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)

$email | vercel env add SUPABASE_ADMIN_EMAIL production 2>$null
$password | vercel env add SUPABASE_ADMIN_PASSWORD production 2>$null

Write-Host 'Done. Verifying:'
vercel env ls production | Select-String 'SUPABASE_ADMIN'
Write-Host 'Now redeploy so the API picks them up: git commit --allow-empty + git push (or ask the agent).'