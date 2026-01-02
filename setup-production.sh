#!/bin/bash

# KelolaAja Backend - Production Setup Script
# This script helps setup the application for production deployment on VPS

set -e  # Exit on error

echo "🚀 KelolaAja Backend - Production Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Please edit .env file with your production values!${NC}"
    echo "   - Set DATABASE_URL with your PostgreSQL credentials"
    echo "   - Generate secure secret keys with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    echo "   - Set WEB_URL to your frontend domain"
    echo ""
    read -p "Press Enter after you've configured .env file..."
fi

echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js version 18 or higher is required${NC}"
    echo "  Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
echo ""

echo "2️⃣  Installing dependencies..."
npm install --production
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo "3️⃣  Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo ""

echo "4️⃣  Building TypeScript..."
npm run build
echo -e "${GREEN}✓ TypeScript compiled${NC}"
echo ""

echo "5️⃣  Running database migrations..."
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate deploy
    echo -e "${GREEN}✓ Migrations deployed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped database migrations${NC}"
fi
echo ""

echo "6️⃣  Seed database..."
read -p "Do you want to seed the database? (Only for first deployment) (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed:prod
    echo -e "${GREEN}✓ Database seeded${NC}"
    echo -e "${YELLOW}⚠️  Remember to set RUN_SEED=false in .env file${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped database seeding${NC}"
fi
echo ""

echo "7️⃣  Creating uploads directory..."
mkdir -p uploads
chmod 755 uploads
echo -e "${GREEN}✓ Uploads directory created${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}✓ Production setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Setup PM2 to run the application:"
echo "   pm2 start dist/app.js --name kelolaaja-api"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "2. Configure Nginx as reverse proxy (see VPS_DEPLOYMENT_GUIDE.md)"
echo ""
echo "3. Setup SSL certificate with Let's Encrypt (optional but recommended)"
echo ""
echo "For detailed instructions, see: VPS_DEPLOYMENT_GUIDE.md"
echo ""
