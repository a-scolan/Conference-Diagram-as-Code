#!/usr/bin/env bash
set -euo pipefail

TARGET_REPO="${TARGET_REPO:-https://github.com/a-scolan/likec4-presentation.git}"
OUT_DIR="${OUT_DIR:-../_publish-likec4-presentation}"
FORCE_PUSH="${FORCE_PUSH:-true}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$ROOT_DIR/presentation"
OUT_PATH="$(cd "$ROOT_DIR" && mkdir -p "$(dirname "$OUT_DIR")" && cd "$(dirname "$OUT_DIR")" && pwd)/$(basename "$OUT_DIR")"

echo "[1/6] Nettoyage export: $OUT_PATH"
rm -rf "$OUT_PATH"
mkdir -p "$OUT_PATH/.github/workflows" "$OUT_PATH/likec4/projects"

echo "[2/6] Copie des fichiers strictement nécessaires"
cp "$SRC_DIR/package.json" "$OUT_PATH/"
cp "$SRC_DIR/package-lock.json" "$OUT_PATH/"
cp "$SRC_DIR/build-single-assets.js" "$OUT_PATH/"
cp -R "$SRC_DIR/public" "$OUT_PATH/"
cp -R "$SRC_DIR/likec4/projects/coffee-v1" "$OUT_PATH/likec4/projects/"
cp -R "$SRC_DIR/likec4/projects/coffee-v2" "$OUT_PATH/likec4/projects/"
cp -R "$SRC_DIR/likec4/projects/shared" "$OUT_PATH/likec4/projects/"
rm -rf "$OUT_PATH/likec4/projects/coffee-v1/dist" "$OUT_PATH/likec4/projects/coffee-v1/dist copy" "$OUT_PATH/likec4/projects/coffee-v1/png" "$OUT_PATH/likec4/projects/coffee-v2/dist"

echo "[3/6] Écriture workflow GitHub Pages + fichiers racine"
cat > "$OUT_PATH/.github/workflows/github-pages.yml" <<'YAML'
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
YAML

cat > "$OUT_PATH/public/index.html" <<'HTML'
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
HTML

cat > "$OUT_PATH/index.html" <<'HTML'
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
HTML

cat > "$OUT_PATH/presentation-diagram-as-code.html" <<'HTML'
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
HTML

cat > "$OUT_PATH/.gitignore" <<'GITIGNORE'
node_modules/
.DS_Store
GITIGNORE

cat > "$OUT_PATH/README.md" <<'MD'
# likec4-presentation

Repo minimal pour builder et publier la présentation sur GitHub Pages.

## Local

- `npm ci`
- `npm run build`

Le site statique servi par Pages est dans `public/`.
MD

echo "[4/6] Validation build"
(cd "$OUT_PATH" && npm ci && npm run build)

echo "[5/6] Commit"
(cd "$OUT_PATH" && git init -b main >/dev/null && git add . && git commit -m "chore: publish minimal presentation" >/dev/null)

echo "[6/6] Push -> $TARGET_REPO"
if [[ "$FORCE_PUSH" == "true" ]]; then
  (cd "$OUT_PATH" && git remote add origin "$TARGET_REPO" && git push -u origin main --force)
else
  (cd "$OUT_PATH" && git remote add origin "$TARGET_REPO" && git push -u origin main)
fi

echo "✅ Publication terminée"
