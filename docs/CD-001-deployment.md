# CD-001: Continuous Deployment & Automated Hosting Specification

## 🚀 DevOps Automator Specifications

### 1. Target Infrastructure
- **Deployment Platform**: GitHub Pages (`https://hyeon1101.github.io/taja/`)
- **Source Branch**: `main`
- **Automation Runner**: GitHub Actions Workflow (`.github/workflows/deploy.yml`)

### 2. Workflow Trigger & Pipeline Steps
```yaml
name: Deploy Hancom Taja Game to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Deployment Health Check Protocol
1. **GitHub Pages URL**: `https://hyeon1101.github.io/taja/`
2. **Local Dev Server**: `http://localhost:8080/index.html`
3. **Rollback Strategy**: Git commit reset & force-push to `main` branch if deployment verification fails.
