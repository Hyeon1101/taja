# DEVOPS-001: CI/CD Pipeline & GitHub Pages Deployment Guide

## ⚙️ Infrastructure Overview
- **Deployment Platform**: GitHub Pages (`https://<username>.github.io/<repo-name>/`)
- **CI/CD Orchestrator**: GitHub Actions (`.github/workflows/deploy.yml`)
- **Version Control**: Git (`main` branch)

## 🚀 Pipeline Workflow
1. **Developer Push**: Commits pushed to `main` branch.
2. **GitHub Action Trigger**: `.github/workflows/deploy.yml` runs automatically.
3. **Static Artifact Upload**: Uploads root web files (`index.html`, `styles.css`, `js/`, `docs/`).
4. **Deploy Step**: Deploys to GitHub Pages static environment.

## 🔐 SSH & Automated Setup
- SSH Public Key Fingerprint registered: `SHA256:tNQcah12nw2ThRtQn2xzwV+0zrcNtzc8HsFi6tSHShk`.
- Automated script `deploy-github.ps1` initializes git, commits changes, creates or links remote GitHub repository, and pushes to remote.
