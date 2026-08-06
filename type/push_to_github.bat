@echo off
chcp 65001 > nul
title 한컴 타자 연습 - GitHub 배포 스크립트

echo ===================================================
echo 🚀 한컴 타자 연습 (Hancom Taja) 깃허브 배포 시작
echo ===================================================
echo.

cd /d "%~dp0"

if not exist ".git" (
    echo 📦 Git 저장소 초기화 중...
    git init
    git branch -M main
    git add .
    git commit -m "feat: initial release of Hancom Taja typing game"
)

echo 🔗 원격 저장소 URL 연결 중... (https://github.com/Hyeon1101/taja.git)
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Hyeon1101/taja.git

echo 📤 GitHub 푸시 중...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo 🎉 성공적으로 GitHub에 푸시되었습니다!
    echo 🌐 GitHub Pages 배포 URL: https://hyeon1101.github.io/taja/
    echo ===================================================
) else (
    echo.
    echo ⚠️ SSH 방식으로 다시 시도합니다 (git@github.com:Hyeon1101/taja.git)...
    git remote set-url origin git@github.com:Hyeon1101/taja.git
    git push -u origin main
)

pause
