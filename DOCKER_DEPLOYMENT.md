# 🐳 Docker Deployment Guide - KelolaAja Backend

Complete guide untuk deploy KelolaAja Backend menggunakan Docker.

---

## 📋 Table of Contents

1. [Local Development dengan Docker Compose](#1-local-development-dengan-docker-compose)
2. [Build Docker Image Manual](#2-build-docker-image-manual)
3. [Deploy ke Railway dengan Docker](#3-deploy-ke-railway-dengan-docker)
4. [Deploy ke VPS/Cloud dengan Docker](#4-deploy-ke-vpscloud-dengan-docker)
5. [Production Best Practices](#5-production-best-practices)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Local Development dengan Docker Compose

### Step 1: Persiapan Environment

```bash
# Copy environment template
cp .env.docker .env

# Edit .env dan sesuaikan dengan kebutuhan
nano .env
```

### Step 2: Generate Secrets untuk Production

```bash
# Generate ACCESS_TOKEN_SECRET
openssl rand -base64 64

# Generate REFRESH_TOKEN_SECRET
openssl rand -base64 64

# Generate SECRET_KEY
openssl rand -base64 32
```

Update secrets di file `.env`:

```env
ACCESS_TOKEN_SECRET=<hasil-dari-openssl-1>
REFRESH_TOKEN_SECRET=<hasil-dari-openssl-2>
SECRET_KEY=<hasil-dari-openssl-3>
```

### Step 3: Start Services

```bash
# Build dan start semua services (PostgreSQL + App)
docker-compose up -d

# Lihat logs
docker-compose logs -f app

# Check health status
curl http://localhost:8080/health
```

### Step 4: Run Migrations dan Seed

```bash
# Migrations sudah auto-run di startup
# Tapi kalau mau manual:
docker-compose exec app npx prisma migrate deploy

# Seed initial data
docker-compose exec app npm run seed
```

### Step 5: Stop Services

```bash
# Stop semua services
docker-compose down

# Stop dan hapus volumes (WARNING: Data akan hilang!)
docker-compose down -v
```

---

## 2. Build Docker Image Manual

### Build Image

```bash
# Build image
docker build -t kelolaaja-backend:latest .

# Build dengan tag versi
docker build -t kelolaaja-backend:1.0.0 .
```

### Run Container Manual

```bash
# Run dengan environment variables
docker run -d \
  --name kelolaaja-app \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e ACCESS_TOKEN_SECRET="your-secret" \
  -e REFRESH_TOKEN_SECRET="your-secret" \
  -e SECRET_KEY="your-key" \
  -e WEB_URL="http://localhost:3000" \
  kelolaaja-backend:latest

# Check logs
docker logs -f kelolaaja-app

# Stop container
docker stop kelolaaja-app

# Remove container
docker rm kelolaaja-app
```

---

## 3. Deploy ke Railway dengan Docker

Railway akan otomatis detect Dockerfile dan build image.

### Step 1: Prepare Railway Project

1. Push code ke GitHub repository
2. Login ke [Railway.app](https://railway.app)
3. Create New Project → Deploy from GitHub

### Step 2: Add PostgreSQL Database

1. Klik "New" → "Database" → "Add PostgreSQL"
2. Railway akan auto-create database dan set `DATABASE_URL`

### Step 3: Configure Environment Variables

Di Railway dashboard, set environment variables:

```env
NODE_ENV=production
PORT=${{PORT}}
DATABASE_URL=${{PGDATABASE.DATABASE_URL}}
ACCESS_TOKEN_SECRET=<generate-with-openssl>
REFRESH_TOKEN_SECRET=<generate-with-openssl>
SECRET_KEY=<generate-with-openssl>
WEB_URL=https://your-frontend-domain.com
```

### Step 4: Deploy

```bash
# Railway akan auto-deploy ketika push ke GitHub
git add .
git commit -m "Add Docker support"
git push origin main
```

### Step 5: Run Seed (Optional)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run seed
railway run npm run seed
```

### Step 6: Monitor

```bash
# View logs
railway logs

# Open app
railway open
```

---

## 4. Deploy ke VPS/Cloud dengan Docker

### Prerequisites

```bash
# Install Docker di VPS
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 1: Upload Code ke VPS

```bash
# Option 1: Git clone
git clone https://github.com/your-repo/kelolaaja-be.git
cd kelolaaja-be

# Option 2: SCP upload
scp -r . user@vps-ip:/opt/kelolaaja-be
```

### Step 2: Configure Environment

```bash
# Create .env file
nano .env
```

Isi dengan:

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://kelolaaja:secure_password@postgres:5432/kelolaaja_db
ACCESS_TOKEN_SECRET=<generated-secret>
REFRESH_TOKEN_SECRET=<generated-secret>
SECRET_KEY=<generated-key>
WEB_URL=https://your-domain.com
```

### Step 3: Update docker-compose.yml untuk Production

```bash
nano docker-compose.yml
```

Update PostgreSQL password:

```yaml
environment:
  POSTGRES_PASSWORD: <secure-password-here>
```

### Step 4: Deploy

```bash
# Build dan start
docker-compose up -d

# Check logs
docker-compose logs -f app

# Run seed
docker-compose exec app npm run seed
```

### Step 5: Setup Nginx Reverse Proxy (Optional)

```bash
# Install Nginx
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/kelolaaja
```

Nginx config:

```nginx
server {
    listen 80;
    server_name api.kelolaaja.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/kelolaaja /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL dengan Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.kelolaaja.com

# Auto-renewal sudah disetup
```

---

## 5. Production Best Practices

### Security

1. **Never commit secrets to Git**

   ```bash
   # Ensure .env is in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use strong secrets**

   ```bash
   # Generate random secrets
   openssl rand -base64 64
   ```

3. **Run as non-root user** (Sudah configured di Dockerfile)

4. **Keep base images updated**
   ```bash
   docker pull node:18-alpine
   docker-compose build --no-cache
   ```

### Monitoring

1. **Check container health**

   ```bash
   docker ps
   docker stats kelolaaja-app
   ```

2. **View logs**

   ```bash
   # Real-time logs
   docker-compose logs -f app

   # Last 100 lines
   docker-compose logs --tail=100 app
   ```

3. **Database backup**

   ```bash
   # Backup
   docker-compose exec postgres pg_dump -U kelolaaja kelolaaja_db > backup.sql

   # Restore
   docker-compose exec -T postgres psql -U kelolaaja kelolaaja_db < backup.sql
   ```

### Performance

1. **Use multi-stage build** (Sudah implemented)
2. **Minimize layers** (Sudah optimized)
3. **Use .dockerignore** (Sudah configured)

### Maintenance

1. **Update dependencies**

   ```bash
   npm update
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Database migrations**

   ```bash
   # Auto-run on startup
   # Manual: docker-compose exec app npx prisma migrate deploy
   ```

3. **Restart services**
   ```bash
   docker-compose restart app
   ```

---

## 6. Troubleshooting

### Problem: Container exits immediately

```bash
# Check logs
docker-compose logs app

# Common causes:
# 1. DATABASE_URL tidak set
# 2. Prisma migration failed
# 3. Port already in use
```

**Solution:**

```bash
# Verify environment variables
docker-compose exec app env | grep DATABASE_URL

# Check port
lsof -i :8080

# Restart fresh
docker-compose down -v
docker-compose up -d
```

### Problem: Cannot connect to database

```bash
# Check if postgres is running
docker-compose ps

# Check postgres logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U kelolaaja -d kelolaaja_db
```

**Solution:**

```bash
# Wait for postgres to be ready
docker-compose up -d postgres
sleep 10
docker-compose up -d app
```

### Problem: Prisma migration fails

```bash
# Check migration status
docker-compose exec app npx prisma migrate status

# Reset database (WARNING: Data loss!)
docker-compose exec app npx prisma migrate reset --force
```

### Problem: Image build fails

```bash
# Clean build cache
docker builder prune

# Rebuild from scratch
docker-compose build --no-cache
```

### Problem: Out of disk space

```bash
# Clean unused images
docker system prune -a

# Clean volumes (WARNING: Data loss!)
docker volume prune
```

---

## 📞 Support

Jika ada masalah:

1. Check logs: `docker-compose logs -f app`
2. Verify environment: `docker-compose exec app env`
3. Test health: `curl http://localhost:8080/health`
4. Check database: `docker-compose exec postgres psql -U kelolaaja -d kelolaaja_db`

---

## 🚀 Quick Commands Reference

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart app

# Logs
docker-compose logs -f app

# Shell access
docker-compose exec app sh

# Database shell
docker-compose exec postgres psql -U kelolaaja -d kelolaaja_db

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed data
docker-compose exec app npm run seed

# Backup database
docker-compose exec postgres pg_dump -U kelolaaja kelolaaja_db > backup.sql

# Clean everything
docker-compose down -v && docker system prune -a
```
