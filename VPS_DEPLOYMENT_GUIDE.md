# 🚀 Panduan Deployment KelolaAja Backend ke VPS

Panduan lengkap untuk deploy KelolaAja Backend API ke VPS (Virtual Private Server).

## 📋 Prerequisites

Sebelum memulai, pastikan VPS Anda memiliki:

- Ubuntu 20.04 LTS atau lebih baru (atau Debian/CentOS)
- RAM minimal 1GB (disarankan 2GB+)
- Node.js v18 atau lebih baru
- PostgreSQL 12 atau lebih baru
- Git
- PM2 (untuk process management)
- Nginx (sebagai reverse proxy)

## 🔧 Persiapan VPS

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

### 3. Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verifikasi instalasi
sudo systemctl status postgresql
```

### 4. Setup Database

```bash
# Login sebagai postgres user
sudo -u postgres psql

# Buat database dan user
CREATE DATABASE kelolaaja_db;
CREATE USER kelolaaja WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE kelolaaja_db TO kelolaaja;
\q
```

### 5. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 6. Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📦 Deploy Aplikasi

### 1. Clone Repository

```bash
# Buat direktori untuk aplikasi
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone <repository-url> kelolaaja-backend
cd kelolaaja-backend

# Set ownership
sudo chown -R $USER:$USER /var/www/kelolaaja-backend
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Setup Environment Variables

```bash
# Copy .env.example menjadi .env
cp .env.example .env

# Edit file .env dengan text editor
nano .env
```

Isi dengan konfigurasi production Anda:

```env
NODE_ENV=production
PORT=8080

# Database URL (sesuaikan dengan kredensial PostgreSQL Anda)
DATABASE_URL="postgresql://kelolaaja:your_secure_password_here@localhost:5432/kelolaaja_db"

# Generate secret keys dengan command ini:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
ACCESS_TOKEN_SECRET=<generated-secret-1>
REFRESH_TOKEN_SECRET=<generated-secret-2>
SECRET_KEY=<generated-secret-3>

# URL frontend Anda
WEB_URL=https://your-domain.com

# Set false setelah seed pertama kali
RUN_SEED=true
```

**PENTING:** Generate secret keys yang aman dengan command:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Generate Prisma Client & Build

```bash
# Generate Prisma Client
npx prisma generate

# Build TypeScript
npm run build
```

### 5. Run Database Migrations

```bash
# Deploy migrations ke production database
npx prisma migrate deploy
```

### 6. Seed Database (Opsional - Hanya untuk deployment pertama)

```bash
# Seed data awal
npm run seed:prod
```

Setelah seed pertama kali, ubah `RUN_SEED=false` di file `.env`.

### 7. Setup PM2

```bash
# Start aplikasi dengan PM2
pm2 start dist/app.js --name kelolaaja-api

# Save PM2 process list
pm2 save

# Setup PM2 untuk auto-start saat server reboot
pm2 startup
# Jalankan command yang ditampilkan oleh PM2

# Monitor aplikasi
pm2 status
pm2 logs kelolaaja-api
```

### 8. Configure Nginx

```bash
# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/kelolaaja-api
```

Isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Ganti dengan domain Anda

    # Increase timeout for long-running requests
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    send_timeout 300s;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload size limit
    client_max_body_size 10M;
}
```

Aktifkan konfigurasi:

```bash
# Buat symbolic link
sudo ln -s /etc/nginx/sites-available/kelolaaja-api /etc/nginx/sites-enabled/

# Test konfigurasi Nginx
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 9. Setup SSL dengan Let's Encrypt (Opsional tapi Disarankan)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Dapatkan SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal sudah disetup otomatis, test dengan:
sudo certbot renew --dry-run
```

## ✅ Verifikasi Deployment

### Test API

```bash
# Test dengan curl
curl http://localhost:8080
curl https://api.yourdomain.com

# Test health check endpoint (jika ada)
curl https://api.yourdomain.com/health
```

### Monitor Logs

```bash
# PM2 logs
pm2 logs kelolaaja-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Update Aplikasi (Deployment Selanjutnya)

Untuk update aplikasi di masa mendatang:

```bash
cd /var/www/kelolaaja-backend

# Pull update dari repository
git pull origin main

# Install dependencies baru (jika ada)
npm install --production

# Generate Prisma Client (jika ada perubahan schema)
npx prisma generate

# Run migrations (jika ada)
npx prisma migrate deploy

# Build aplikasi
npm run build

# Restart aplikasi dengan PM2
pm2 restart kelolaaja-api

# Monitor untuk memastikan tidak ada error
pm2 logs kelolaaja-api
```

## 🔐 Security Best Practices

1. **Firewall Configuration**

```bash
# Install UFW
sudo apt install ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

2. **Database Security**

- Gunakan password yang kuat untuk PostgreSQL
- Jangan expose PostgreSQL ke public internet
- Regular backup database

3. **Application Security**

- JANGAN commit file `.env` ke repository
- Gunakan secret keys yang kuat dan unik
- Update dependencies secara berkala: `npm audit fix`

4. **SSH Security**

- Gunakan SSH key authentication
- Disable root login
- Gunakan port SSH non-standard

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
# Status semua aplikasi
pm2 status

# Logs real-time
pm2 logs

# Logs aplikasi specific
pm2 logs kelolaaja-api

# Restart aplikasi
pm2 restart kelolaaja-api

# Stop aplikasi
pm2 stop kelolaaja-api

# Monitoring dashboard
pm2 monit
```

### Database Backup

```bash
# Backup database
pg_dump -U kelolaaja -d kelolaaja_db > backup_$(date +%Y%m%d).sql

# Restore database
psql -U kelolaaja -d kelolaaja_db < backup_20260102.sql
```

### Setup Automatic Backup (Cron Job)

```bash
# Buat script backup
nano /var/www/kelolaaja-backend/backup.sh
```

Isi script:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/kelolaaja"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump -U kelolaaja kelolaaja_db > $BACKUP_DIR/backup_$DATE.sql

# Hapus backup lebih dari 7 hari
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Set executable dan tambahkan ke cron:

```bash
chmod +x /var/www/kelolaaja-backend/backup.sh

# Edit crontab
crontab -e

# Tambahkan line ini untuk backup setiap hari jam 2 pagi
0 2 * * * /var/www/kelolaaja-backend/backup.sh
```

## 🆘 Troubleshooting

### Aplikasi tidak bisa start

```bash
# Check PM2 logs
pm2 logs kelolaaja-api --err

# Check disk space
df -h

# Check memory
free -h
```

### Database connection error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connection
psql -U kelolaaja -d kelolaaja_db

# Check DATABASE_URL di .env
cat .env | grep DATABASE_URL
```

### Nginx error

```bash
# Test konfigurasi
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

## 📞 Support

Jika ada masalah saat deployment:

1. Check logs: `pm2 logs kelolaaja-api`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verifikasi environment variables di `.env`
4. Pastikan semua services running: PostgreSQL, PM2, Nginx

---

**Catatan Penting:**

- File `.env` berisi informasi sensitif, JANGAN commit ke Git
- Generate secret keys yang kuat untuk production
- Lakukan backup database secara berkala
- Monitor aplikasi dan server resources
- Update dependencies secara berkala untuk security patches
