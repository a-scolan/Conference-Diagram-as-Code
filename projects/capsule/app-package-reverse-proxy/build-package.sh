#!/bin/bash
# Package builder script for Capsule reverse proxy package

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

VERSION=$(jq -r '.version' manifest.json 2>/dev/null)
SITENAME=$(jq -r '.siteName' manifest.json 2>/dev/null)

if [ -z "$VERSION" ] || [ -z "$SITENAME" ]; then
    echo -e "${RED}Error: Could not read version or siteName from manifest.json${NC}"
    exit 1
fi

PACKAGE_NAME="${SITENAME}-v${VERSION}.tar.gz"

echo -e "${YELLOW}📦 Capsule Reverse Proxy Package Builder${NC}"
echo "Site: $SITENAME"
echo "Version: $VERSION"
echo ""

# Validate required files
echo "✓ Checking required files..."
for file in manifest.json Dockerfile nginx.conf; do
    if [ ! -e "$file" ]; then
        echo -e "${RED}Error: Missing required file: $file${NC}"
        exit 1
    fi
done

# Validate manifest.json syntax
echo "✓ Validating manifest.json..."
jq . manifest.json > /dev/null || {
    echo -e "${RED}Error: Invalid JSON in manifest.json${NC}"
    exit 1
}

# Optional: Test build locally
if [ "$1" == "--test" ]; then
    echo -e "${YELLOW}🧪 Testing build locally...${NC}"
    podman build -t "test-${SITENAME}:${VERSION}" . || {
        echo -e "${RED}Error: Build failed${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Build successful${NC}"
    podman rmi "test-${SITENAME}:${VERSION}" 2>/dev/null || true
fi

# Create package
echo "📦 Creating package: $PACKAGE_NAME"
tar -czf "$PACKAGE_NAME" \
    --exclude='*.tar.gz' \
    --exclude='.git' \
    --exclude='.gitignore' \
    --exclude='build-package.sh' \
    manifest.json Dockerfile nginx.conf

if [ -f "$PACKAGE_NAME" ]; then
    SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
    echo -e "${GREEN}✓ Package created successfully${NC}"
    echo "  File: $PACKAGE_NAME"
    echo "  Size: $SIZE"
else
    echo -e "${RED}Error: Package creation failed${NC}"
    exit 1
fi
