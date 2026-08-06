# PowerShell GitHub Repository Creation & Deployment Script
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "==========================================" -ForegroundColor Gold
Write-Host "🚀 Hancom Taja Game - GitHub Deployer" -ForegroundColor Gold
Write-Host "==========================================" -ForegroundColor Gold

# Change directory
Set-Location -Path "c:\Users\FEB2726\Downloads\type"

# Initialize Git
if (!(Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Cyan
    git init
}

# Configure Git user if not set
$gitName = git config user.name
if (-not $gitName) {
    git config user.name "HancomTajaUser"
    git config user.email "user@example.com"
}

# Add and Commit
Write-Host "📝 Staging files and creating initial commit..." -ForegroundColor Cyan
git add .
git commit -m "feat: initial release of Hancom Taja typing game with 3 modes and side stats"

# Ensure main branch
git branch -M main

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Local repository initialized & committed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "👉 Next Step to Push to GitHub:" -ForegroundColor Yellow
Write-Host "1. Create a new GitHub repository at https://github.com/new (e.g. name: 'hancom-taja')" -ForegroundColor White
Write-Host "2. Run the following commands in your terminal:" -ForegroundColor White
Write-Host "   git remote add origin git@github.com:<YOUR_USERNAME>/hancom-taja.git" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Once pushed, GitHub Actions (.github/workflows/deploy.yml) will automatically publish your game live to GitHub Pages!" -ForegroundColor Gold
