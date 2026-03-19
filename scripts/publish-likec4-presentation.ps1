param(
  [string]$TargetRepo = "https://github.com/a-scolan/likec4-presentation.git",
  [string]$OutDir = "../_publish-likec4-presentation",
  [switch]$NoForcePush
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..")
$SrcDir = Join-Path $RootDir "presentation"
$OutPath = Resolve-Path (Join-Path $RootDir $OutDir) -ErrorAction SilentlyContinue
if ($null -eq $OutPath) {
  $OutPath = Join-Path $RootDir $OutDir
}

Write-Host "[1/6] Nettoyage export: $OutPath"
if (Test-Path $OutPath) { Remove-Item -Recurse -Force $OutPath }
New-Item -ItemType Directory -Force -Path (Join-Path $OutPath ".github/workflows") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $OutPath "likec4/projects") | Out-Null

Write-Host "[2/6] Copie des fichiers strictement nécessaires"
Copy-Item (Join-Path $SrcDir "package.json") $OutPath
Copy-Item (Join-Path $SrcDir "package-lock.json") $OutPath
Copy-Item (Join-Path $SrcDir "build-single-assets.js") $OutPath
Copy-Item -Recurse (Join-Path $SrcDir "public") $OutPath
Copy-Item -Recurse (Join-Path $SrcDir "likec4/projects/coffee-v1") (Join-Path $OutPath "likec4/projects")
Copy-Item -Recurse (Join-Path $SrcDir "likec4/projects/coffee-v2") (Join-Path $OutPath "likec4/projects")
Copy-Item -Recurse (Join-Path $SrcDir "likec4/projects/shared") (Join-Path $OutPath "likec4/projects")

$toRemove = @(
  "likec4/projects/coffee-v1/dist",
  "likec4/projects/coffee-v1/dist copy",
  "likec4/projects/coffee-v1/png",
  "likec4/projects/coffee-v2/dist"
)
foreach ($p in $toRemove) {
  $full = Join-Path $OutPath $p
  if (Test-Path $full) { Remove-Item -Recurse -Force $full }
}

Write-Host "[3/6] Écriture workflow GitHub Pages + fichiers racine"
@'
name: Deploy presentation to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: package-lock.json

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Build presentation assets
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
'@ | Set-Content -NoNewline (Join-Path $OutPath ".github/workflows/github-pages.yml")

@"
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>LikeC4 Presentation</title>
    <meta http-equiv="refresh" content="0; url=./presentation-diagram-as-code.html" />
    <script>window.location.replace('./presentation-diagram-as-code.html');</script>
  </head>
  <body>
    <p>Redirection vers la présentation… <a href="./presentation-diagram-as-code.html">Ouvrir</a></p>
  </body>
</html>
"@ | Set-Content -NoNewline (Join-Path $OutPath "public/index.html")

@"
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=./presentation-diagram-as-code.html" />
  <script>window.location.replace('./presentation-diagram-as-code.html');</script>
  <title>LikeC4 Presentation</title>
</head>
<body>
  <p>Redirection… <a href="./presentation-diagram-as-code.html">Ouvrir la présentation</a></p>
</body>
</html>
"@ | Set-Content -NoNewline (Join-Path $OutPath "index.html")

@"
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=./public/presentation-diagram-as-code.html" />
  <script>window.location.replace('./public/presentation-diagram-as-code.html');</script>
  <title>Redirection…</title>
</head>
<body>
  <p>Redirection… <a href="./public/presentation-diagram-as-code.html">Ouvrir la présentation</a></p>
</body>
</html>
"@ | Set-Content -NoNewline (Join-Path $OutPath "presentation-diagram-as-code.html")

@"
node_modules/
.DS_Store
"@ | Set-Content -NoNewline (Join-Path $OutPath ".gitignore")

@"
# likec4-presentation

Repo minimal pour builder et publier la présentation sur GitHub Pages.

## Local

- `npm ci`
- `npm run build`

Le site statique servi par Pages est dans `public/`.
"@ | Set-Content -NoNewline (Join-Path $OutPath "README.md")

Write-Host "[4/6] Validation build"
Push-Location $OutPath
npm ci
npm run build
Pop-Location

Write-Host "[5/6] Commit"
Push-Location $OutPath
git init -b main | Out-Null
git add .
git commit -m "chore: publish minimal presentation" | Out-Null

Write-Host "[6/6] Push -> $TargetRepo"
git remote add origin $TargetRepo
if ($NoForcePush) {
  git push -u origin main
} else {
  git push -u origin main --force
}
Pop-Location

Write-Host "✅ Publication terminée"
