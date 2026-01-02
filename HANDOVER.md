# 📦 KelolaAja Backend - Handover Documentation

Dokumentasi handover untuk deployment KelolaAja Backend ke VPS client.

## 📚 Daftar Isi

1. [Ringkasan Project](#ringkasan-project)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Struktur Project](#struktur-project)
4. [Setup & Deployment](#setup--deployment)
5. [Default Credentials](#-default-credentials)
6. [Panduan Operasional](#-panduan-operasional)
7. [Performance & Monitoring](#-performance--monitoring)
8. [Automated Backup Script](#-automated-backup-script)
9. [Best Practices & Tips](#-best-practices--tips)
10. [File Penting](#file-penting)
11. [API Documentation](#api-documentation)
12. [Troubleshooting](#troubleshooting)
13. [Maintenance Checklist](#-maintenance-checklist)
14. [Production Checklist](#-production-checklist)

---

## 📋 Ringkasan Project

KelolaAja Backend adalah REST API yang dibangun dengan Node.js, Express, TypeScript, dan Prisma ORM dengan PostgreSQL sebagai database.

### Fitur Utama:

- ✅ Authentication & Authorization (JWT)
- ✅ User Management (Admin & User roles)
- ✅ Content Management (Features, Industries, FAQs, etc)
- ✅ Media Upload (Images dengan Sharp processing)
- ✅ Audit Logging
- ✅ Analytics
- ✅ Career & Job Applications
- ✅ Contact Form Submissions
- ✅ Multi-language Support (ID & EN)

---

## 🔧 Teknologi yang Digunakan

### Backend Stack:

- **Runtime**: Node.js v18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 12+
- **ORM**: Prisma 6.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Image Processing**: Sharp
- **Validation**: Zod

### Production Tools:

- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (Certbot)

---

## 📁 Struktur Project

```
kelolaAja-BE/
├── src/                          # Source code
│   ├── app.ts                    # Entry point
│   ├── controllers/              # Request handlers
│   ├── middlewares/              # Auth, error handling, etc
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   ├── utils/                    # Helper functions
│   ├── types/                    # TypeScript types
│   └── validators/               # Zod schemas
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration history
│   └── seed*.ts                  # Database seeders
│
├── dist/                         # Compiled JavaScript (generated)
├── uploads/                      # Uploaded media files
├── node_modules/                 # Dependencies
│
├── .env                          # Environment variables (TIDAK di-commit)
├── .env.example                  # Template environment variables
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── Dockerfile                    # Docker image config
├── docker-compose.yml            # Docker compose config
├── setup-production.sh           # Production setup script
│
└── Documentation Files:
    ├── README.md                 # General documentation
    ├── HANDOVER.md               # This file
    ├── VPS_DEPLOYMENT_GUIDE.md   # VPS deployment guide
    ├── API_DOCUMENTATION.md      # API endpoints
    └── MEDIA_UPLOAD_GUIDE.md     # Media upload guide
```

---

## 🚀 Setup & Deployment

### Prerequisites di VPS:

- Ubuntu 20.04 LTS atau lebih baru
- Node.js v18+
- PostgreSQL 12+
- PM2 (process manager)
- Nginx (reverse proxy)
- Git

### Quick Start - Deployment ke VPS:

#### 1. Clone Repository ke VPS

```bash
cd /var/www
git clone <repository-url> kelolaaja-backend
cd kelolaaja-backend
```

#### 2. Setup Environment

```bash
# Copy .env.example menjadi .env
cp .env.example .env

# Edit .env dengan konfigurasi production
nano .env
```

**Konfigurasi yang HARUS diubah:**

```env
NODE_ENV=production
PORT=8080

# Database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/kelolaaja_db"

# Generate dengan: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
ACCESS_TOKEN_SECRET=<generated-secret-1>
REFRESH_TOKEN_SECRET=<generated-secret-2>
SECRET_KEY=<generated-secret-3>

# Frontend domain
WEB_URL=https://your-frontend-domain.com

# Set true hanya untuk deployment pertama
RUN_SEED=true
```

#### 3. Run Production Setup Script

```bash
chmod +x setup-production.sh
./setup-production.sh
```

Script ini akan otomatis:

- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Build TypeScript
- ✅ Run migrations
- ✅ Seed database (opsional)
- ✅ Setup uploads directory

#### 4. Setup PM2

```bash
# Start aplikasi
pm2 start dist/app.js --name kelolaaja-api

# Save PM2 configuration
pm2 save

# Auto-start on server reboot
pm2 startup
# Jalankan command yang ditampilkan

# Monitor aplikasi
pm2 status
pm2 logs kelolaaja-api
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/kelolaaja-api
```

Contoh konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kelolaaja-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Setup SSL (Optional tapi Sangat Disarankan)

```bash
sudo certbot --nginx -d api.yourdomain.com
```

### 📖 Dokumentasi Lengkap

Untuk panduan deployment yang lebih detail, lihat: **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)**

---

## � Default Credentials

**PENTING**: Credentials default ini akan dibuat saat menjalankan database seed.

### Admin Account (Default)

```
Email    : admin@kelolaaja.com
Password : admin123
Role     : Admin
```

⚠️ **CRITICAL SECURITY**:

- **WAJIB** ganti password default setelah login pertama kali!
- Gunakan password yang kuat (min 12 karakter, kombinasi huruf besar/kecil, angka, simbol)
- Atau buat admin user baru dan hapus yang default

### Cara Ganti Password Admin:

1. Login dengan credentials default
2. Akses endpoint `PUT /api/users/:userId` dengan body:
   ```json
   {
     "password": "new_secure_password_here"
   }
   ```
3. Atau update langsung via database:

   ```bash
   # Generate hashed password
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('new_password', 10).then(hash => console.log(hash));"

   # Update di database
   psql -U kelolaaja -d kelolaaja_db
   UPDATE "AdminUser" SET "passwordHash" = 'hashed_password_here' WHERE email = 'admin@kelolaaja.com';
   ```

---

## �🔄 Panduan Operasional

### Update Aplikasi

Untuk update aplikasi setelah ada perubahan code:

```bash
cd /var/www/kelolaaja-backend

# Pull update
git pull origin main

# Install dependencies baru (jika ada)
npm install --production

# Generate Prisma Client (jika ada perubahan schema)
npx prisma generate

# Run migrations (jika ada)
npx prisma migrate deploy

# Build ulang
npm run build

# Restart aplikasi
pm2 restart kelolaaja-api

# Monitor logs
pm2 logs kelolaaja-api
```

### PM2 Commands

```bash
# Status aplikasi
pm2 status

# Logs real-time
pm2 logs kelolaaja-api

# Restart
pm2 restart kelolaaja-api

# Stop
pm2 stop kelolaaja-api

# Start
pm2 start kelolaaja-api

# Monitoring dashboard
pm2 monit
```

### Database Operations

#### Backup Database

```bash
# Backup manual
pg_dump -U kelolaaja -d kelolaaja_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U kelolaaja -d kelolaaja_db < backup_20260102.sql
```

#### Database Migrations

```bash
# Deploy migrations ke production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# View database in browser (development only)
npx prisma studio
```

### Log Management

```bash
# Application logs (PM2)
pm2 logs kelolaaja-api
pm2 logs kelolaaja-api --lines 100
pm2 logs kelolaaja-api --err  # Error logs only

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Environment Variables (`.env`) - Penjelasan Detail

| Variable               | Deskripsi                              | Contoh                                | Wajib?      |
| ---------------------- | -------------------------------------- | ------------------------------------- | ----------- |
| `NODE_ENV`             | Environment mode                       | `production`                          | ✅ Wajib    |
| `PORT`                 | Port aplikasi berjalan                 | `8080`                                | ✅ Wajib    |
| `DATABASE_URL`         | PostgreSQL connection string           | `postgresql://user:pass@host:5432/db` | ✅ Wajib    |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret (expire cepat) | `random-64-char-hex`                  | ✅ Wajib    |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret (expire lama) | `random-64-char-hex`                  | ✅ Wajib    |
| `SECRET_KEY`           | General encryption key                 | `random-64-char-hex`                  | ✅ Wajib    |
| `WEB_URL`              | Frontend domain untuk CORS             | `https://yourdomain.com`              | ✅ Wajib    |
| `RUN_SEED`             | Auto-seed database on startup          | `false` (set `true` hanya sekali)     | ⚠️ Optional |

**Generate Secure Secrets**:

```bash
# Generate 3 unique secrets untuk production
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**DATABASE_URL Format**:

```
postgresql://[username]:[password]@[host]:[port]/[database_name]

Contoh:
postgresql://kelolaaja:SecurePass123@localhost:5432/kelolaaja_db
```

---

## 📄 File Penting

### File yang TIDAK boleh dihapus:

- ✅ `src/` - Source code
- ✅ `prisma/` - Database schema & migrations
- ✅ `dist/` - Compiled code (generated, tapi diperlukan untuk production)
- ✅ `uploads/` - Media files
- ✅ `package.json` - Dependencies
- ✅ `tsconfig.json` - TypeScript config
- ✅ `.env` - Environment variables (JANGAN commit ke Git!)
- ✅ `.env.example` - Template untuk .env
- ✅ Dockerfile & docker-compose.yml - Docker configs
- ✅ entrypoint.sh - Docker entrypoint
- ✅ setup-production.sh - Production setup script

### Dokumentasi:

- 📖 `README.md` - Overview & setup
- 📖 `HANDOVER.md` - Handover documentation (file ini)
- 📖 `VPS_DEPLOYMENT_GUIDE.md` - Detailed VPS deployment
- 📖 `API_DOCUMENTATION.md` - API endpoints
- 📖 `MEDIA_UPLOAD_GUIDE.md` - Media upload guide

### File yang SUDAH dihapus (tidak diperlukan):

- ❌ `RAILWAY_DOCKER_GUIDE.md` - Railway specific (tidak relevan)
- ❌ `railway.json` - Railway config (tidak relevan)
- ❌ `KelolaAja-API.postman_collection.json` - Development tool
- ❌ `jest.config.ts` - Testing config (tidak diperlukan di production)
- ❌ `tests/` - Test files (tidak diperlukan di production)
- ❌ `scripts/verify-data-integrity.ts` - Development script

---

## 📚 API Documentation

### Base URL

```
Production: https://api.yourdomain.com
Development: http://localhost:8080
```

### Authentication

API menggunakan JWT Bearer Token. Setiap request yang memerlukan authentication harus include header:

```
Authorization: Bearer <access_token>
```

### Endpoints Overview

#### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Users (Admin only)

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Content Management

- Features: `/api/features`
- Industries: `/api/industries`
- FAQs: `/api/faqs`
- Testimonials: `/api/testimonials`
- Partners: `/api/partners`
- Job Postings: `/api/job-postings`
- Contact Submissions: `/api/contact-submissions`
- And more...

### Untuk dokumentasi API lengkap, lihat: **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 🔐 Security Checklist

### ✅ Yang Sudah Dikonfigurasi:

- ✅ JWT Authentication
- ✅ Password hashing dengan bcrypt
- ✅ CORS protection
- ✅ Input validation dengan Zod
- ✅ Environment variables untuk secrets
- ✅ Helmet.js untuk HTTP headers (jika sudah ada)

### ⚠️ Yang Harus Diperhatikan di Production:

1. **Secret Keys**: Generate secret keys yang kuat dan unik

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Database**:

   - Gunakan password PostgreSQL yang kuat
   - Jangan expose PostgreSQL ke public internet
   - Setup regular backup

3. **Firewall**:

   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

4. **SSL Certificate**: Gunakan HTTPS untuk production

   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

5. **File .env**: JANGAN PERNAH commit `.env` ke Git repository

6. **Updates**: Regularly update dependencies
   ```bash
   npm audit
   npm audit fix
   ```

---

## 🆘 Troubleshooting

### Aplikasi Tidak Bisa Start

**Gejala**: PM2 status "errored" atau terus restart

**Solusi**:

```bash
# Check error logs
pm2 logs kelolaaja-api --err

# Common issues:
# 1. Port sudah digunakan - ganti PORT di .env
# 2. Database connection gagal - check DATABASE_URL
# 3. Missing environment variables - check .env file

# Check .env file
cat .env

# Check port usage
sudo lsof -i :8080
```

### Database Connection Error

**Gejala**: "Cannot connect to database" error

**Solusi**:

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -U kelolaaja -d kelolaaja_db

# Check DATABASE_URL format
# Format: postgresql://username:password@host:port/database
```

### Nginx 502 Bad Gateway

**Gejala**: Nginx menampilkan 502 error

**Solusi**:

```bash
# Check if app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart kelolaaja-api
sudo systemctl restart nginx
```

### Upload Files Gagal

**Gejala**: Error saat upload gambar

**Solusi**:

```bash
# Check uploads directory exists dan permissions
ls -la uploads/
chmod 755 uploads/

# Check Nginx client_max_body_size
sudo nano /etc/nginx/sites-available/kelolaaja-api
# Pastikan ada: client_max_body_size 10M;
```

### Disk Space Penuh

**Gejala**: Application error, logs penuh

**Solusi**:

```bash
# Check disk space
df -h

# Clean PM2 logs
pm2 flush

# Clean old uploads (backup dulu!)
find uploads/ -type f -mtime +90 -delete

# Clean old database backups
find /var/backups/kelolaaja/ -name "backup_*.sql" -mtime +30 -delete
```

---

## � Performance & Monitoring

### Performance Optimization Tips

#### 1. Database Optimization

```bash
# Connect to database
psql -U kelolaaja kelolaaja_db

# Analyze database untuk update statistics
ANALYZE;

# Vacuum untuk reclaim storage
VACUUM;

# Full vacuum (lebih thorough, butuh exclusive lock)
VACUUM FULL;

# Check database size
SELECT pg_size_pretty(pg_database_size('kelolaaja_db'));

# Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### 2. PM2 Optimization

```bash
# Run with cluster mode (multi-core)
pm2 start dist/app.js --name kelolaaja-api -i max

# Or specify number of instances
pm2 start dist/app.js --name kelolaaja-api -i 4

# Monitor resources
pm2 monit

# Set memory limit (restart jika exceed)
pm2 start dist/app.js --name kelolaaja-api --max-memory-restart 500M
```

#### 3. Nginx Caching (Optional)

Tambahkan di konfigurasi Nginx untuk cache static responses:

```nginx
# Cache static files
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Monitoring Tools

#### 1. PM2 Plus (Recommended - Free tier available)

```bash
# Register di pm2.io
pm2 link <secret_key> <public_key>

# Monitor via web dashboard
# https://app.pm2.io
```

#### 2. Server Monitoring

```bash
# Install htop untuk real-time monitoring
sudo apt install htop
htop

# Check disk I/O
sudo apt install iotop
sudo iotop

# Check network
sudo apt install nethogs
sudo nethogs
```

#### 3. Application Metrics

```bash
# PM2 metrics
pm2 describe kelolaaja-api

# Request rate, memory, CPU
pm2 monit
```

### Health Check Endpoint

Jika aplikasi memiliki health check endpoint (misal: `/health`), setup monitoring:

```bash
# Cron job untuk check health
crontab -e

# Check setiap 5 menit
*/5 * * * * curl -f http://localhost:8080/health || pm2 restart kelolaaja-api
```

---

## 🔄 Automated Backup Script

### Setup Database Auto-Backup

#### 1. Buat Backup Script

```bash
sudo nano /usr/local/bin/kelolaaja-backup.sh
```

Isi script:

```bash
#!/bin/bash

# KelolaAja Database Backup Script

# Configuration
BACKUP_DIR="/var/backups/kelolaaja"
DB_USER="kelolaaja"
DB_NAME="kelolaaja_db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"
RETENTION_DAYS=7

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup database
echo "[$(date)] Starting backup..."
pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "[$(date)] Backup successful: $BACKUP_FILE"

    # Compress backup
    gzip $BACKUP_FILE
    echo "[$(date)] Backup compressed: $BACKUP_FILE.gz"

    # Remove old backups
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "[$(date)] Old backups cleaned (>$RETENTION_DAYS days)"
else
    echo "[$(date)] Backup failed!"
    exit 1
fi

# Optional: Upload to cloud storage (S3, Google Cloud, etc)
# aws s3 cp $BACKUP_FILE.gz s3://your-bucket/backups/
```

#### 2. Set Permissions

```bash
sudo chmod +x /usr/local/bin/kelolaaja-backup.sh
sudo chown postgres:postgres /usr/local/bin/kelolaaja-backup.sh
```

#### 3. Setup Cron Job

```bash
sudo -u postgres crontab -e

# Tambahkan: Backup setiap hari jam 2 pagi
0 2 * * * /usr/local/bin/kelolaaja-backup.sh >> /var/log/kelolaaja-backup.log 2>&1
```

#### 4. Test Backup

```bash
sudo -u postgres /usr/local/bin/kelolaaja-backup.sh

# Check backup files
ls -lh /var/backups/kelolaaja/
```

### Restore dari Backup

```bash
# Uncompress backup
gunzip /var/backups/kelolaaja/backup_20260102_020000.sql.gz

# Stop aplikasi dulu
pm2 stop kelolaaja-api

# Drop database (HATI-HATI!)
psql -U postgres -c "DROP DATABASE kelolaaja_db;"
psql -U postgres -c "CREATE DATABASE kelolaaja_db OWNER kelolaaja;"

# Restore backup
psql -U kelolaaja kelolaaja_db < /var/backups/kelolaaja/backup_20260102_020000.sql

# Restart aplikasi
pm2 start kelolaaja-api
```

---

## �📞 Kontak & Support

### Untuk Masalah Teknis:

1. Check dokumentasi di folder project
2. Review logs: `pm2 logs kelolaaja-api`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Resources:

- **VPS Setup Guide**: [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)
- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Media Upload Guide**: [MEDIA_UPLOAD_GUIDE.md](MEDIA_UPLOAD_GUIDE.md)

---

## 📝 Maintenance Checklist

### Daily:

- ✅ Monitor PM2 status: `pm2 status`
- ✅ Check application logs: `pm2 logs kelolaaja-api --lines 50`
- ✅ Monitor disk space: `df -h`

### Weekly:

- ✅ Database backup: `pg_dump -U kelolaaja kelolaaja_db > backup.sql`
- ✅ Review error logs
- ✅ Check security updates: `npm audit`

### Monthly:

- ✅ Update dependencies: `npm update` (test di development dulu!)
- ✅ Review and clean old uploads
- ✅ Database optimization (vacuum, analyze)
- ✅ SSL certificate renewal (auto dengan certbot)

---

## 💡 Best Practices & Tips

### Git Workflow untuk Update

**Jangan push langsung ke production!** Gunakan workflow ini:

```bash
# 1. Buat branch untuk feature/fix
git checkout -b feature/new-feature

# 2. Test di local
npm run dev

# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push ke repository
git push origin feature/new-feature

# 5. Setelah testing OK, merge ke main
git checkout main
git merge feature/new-feature
git push origin main

# 6. Di VPS, pull latest changes
cd /var/www/kelolaaja-backend
git pull origin main
npm install --production
npm run build
pm2 restart kelolaaja-api
```

### Security Best Practices

1. **Firewall Rules**

   ```bash
   # Hanya allow port yang diperlukan
   sudo ufw status
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw deny 8080/tcp   # Block direct access ke app
   ```

2. **SSH Hardening**

   ```bash
   # Disable root login
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   # Set: PasswordAuthentication no (gunakan SSH keys)

   sudo systemctl restart sshd
   ```

3. **Fail2ban** (proteksi dari brute force)

   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Regular Security Updates**

   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y

   # Update Node.js dependencies
   cd /var/www/kelolaaja-backend
   npm audit
   npm audit fix
   ```

### Scaling Recommendations

#### Vertical Scaling (Upgrade VPS)

- **1GB RAM**: 50-100 concurrent users
- **2GB RAM**: 100-300 concurrent users
- **4GB RAM**: 300-1000 concurrent users
- **8GB+ RAM**: 1000+ concurrent users

#### Horizontal Scaling (Multiple Servers)

Jika traffic sangat tinggi:

1. Load Balancer (Nginx/HAProxy)
2. Multiple app servers
3. Shared/Centralized database
4. Redis untuk session storage
5. CDN untuk static assets

### Cost Estimation (Contoh)

**Small Setup (1-2GB VPS)**:

- VPS: $5-10/month
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)
- **Total**: ~$10/month

**Medium Setup (4GB VPS)**:

- VPS: $20-40/month
- Database backup storage: $5/month
- Monitoring tools: Free tier
- **Total**: ~$30/month

### Common Workflows

#### 1. Deploy New Feature

```bash
cd /var/www/kelolaaja-backend
git pull origin main
npm install --production
npx prisma generate  # If schema changed
npx prisma migrate deploy  # If migrations added
npm run build
pm2 restart kelolaaja-api
pm2 logs kelolaaja-api
```

#### 2. Rollback ke Versi Sebelumnya

```bash
cd /var/www/kelolaaja-backend
git log --oneline  # Check commit history
git checkout <commit-hash>  # Rollback ke commit tertentu
npm install --production
npm run build
pm2 restart kelolaaja-api
```

#### 3. Emergency Restart

```bash
# Quick restart
pm2 restart kelolaaja-api

# Full restart (reload environment)
pm2 delete kelolaaja-api
pm2 start dist/app.js --name kelolaaja-api

# Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## 🎯 Production Checklist

Sebelum go-live, pastikan:

- [ ] `.env` sudah dikonfigurasi dengan benar
- [ ] Secret keys sudah di-generate dengan aman (tidak pakai default!)
- [ ] **Default admin password sudah diganti!**
- [ ] Database sudah di-setup dan di-migrate
- [ ] Data sudah di-seed (untuk deployment pertama)
- [ ] PM2 sudah di-setup dan running
- [ ] Nginx sudah dikonfigurasi sebagai reverse proxy
- [ ] SSL certificate sudah di-install (HTTPS)
- [ ] Firewall sudah dikonfigurasi (UFW)
- [ ] Database backup automation sudah di-setup
- [ ] Monitoring sudah di-setup (PM2 monit)
- [ ] WEB_URL di `.env` sudah diset ke frontend domain
- [ ] Test semua API endpoints penting
- [ ] Frontend sudah bisa connect ke backend API
- [ ] Uploads directory permissions sudah benar (755)
- [ ] Error logs accessible dan bisa dipantau
- [ ] Server timezone sudah di-set dengan benar

---

## 📦 Deployment Summary

Project ini sudah siap untuk deployment ke VPS dengan:

1. ✅ Complete source code
2. ✅ Production-ready Dockerfile & docker-compose
3. ✅ Automated setup script (`setup-production.sh`)
4. ✅ Comprehensive documentation
5. ✅ Environment template (`.env.example`)
6. ✅ Database migrations & seeders
7. ✅ Cleaned up development files

### Quick Deployment Steps:

1. Clone repository ke VPS
2. Setup environment (`.env`)
3. Run `./setup-production.sh`
4. Setup PM2 & Nginx
5. Install SSL certificate
6. Done! 🎉

---

**Good luck dengan deployment! 🚀**

Jika ada pertanyaan atau butuh bantuan, silakan refer ke dokumentasi atau hubungi developer.
