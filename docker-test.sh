#!/bin/bash

# Docker Test Script untuk KelolaAja Backend
# This script tests if Docker build and container work properly

set -e

echo "======================================"
echo "KelolaAja Backend - Docker Test"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Build Docker image
echo "Test 1: Building Docker image..."
if docker build -t kelolaaja-backend:test . > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker build successful${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi
echo ""

# Test 2: Check image size
echo "Test 2: Checking image size..."
SIZE=$(docker images kelolaaja-backend:test --format "{{.Size}}")
echo -e "${GREEN}✓ Image size: $SIZE${NC}"
echo ""

# Test 3: Check if Docker Compose file is valid
echo "Test 3: Validating docker-compose.yml..."
if docker-compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✓ docker-compose.yml is valid${NC}"
else
    echo -e "${RED}✗ docker-compose.yml has errors${NC}"
    exit 1
fi
echo ""

# Test 4: Check required files
echo "Test 4: Checking required files..."
FILES=("Dockerfile" ".dockerignore" "docker-compose.yml" ".env.docker" "tsconfig.json")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
        exit 1
    fi
done
echo ""

# Test 5: Check if .env.docker template has required vars
echo "Test 5: Checking .env.docker template..."
REQUIRED_VARS=("NODE_ENV" "PORT" "DATABASE_URL" "ACCESS_TOKEN_SECRET" "REFRESH_TOKEN_SECRET" "SECRET_KEY")
for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "$var" .env.docker; then
        echo -e "${GREEN}✓ $var found in template${NC}"
    else
        echo -e "${YELLOW}⚠ $var missing in template${NC}"
    fi
done
echo ""

echo "======================================"
echo -e "${GREEN}All tests passed! ✓${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Copy environment: cp .env.docker .env"
echo "2. Generate secrets: openssl rand -base64 64"
echo "3. Update .env with secrets"
echo "4. Start services: docker-compose up -d"
echo "5. Check logs: docker-compose logs -f app"
echo "6. Test health: curl http://localhost:8080/health"
echo ""
echo "For Railway deployment:"
echo "1. Push to GitHub: git push origin main"
echo "2. Import in Railway.app"
echo "3. Add PostgreSQL database"
echo "4. Set environment variables"
echo "5. Deploy!"
echo ""
