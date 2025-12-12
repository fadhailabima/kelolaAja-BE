# 🚂 Railway Deployment dengan Docker - Quick Guide

Panduan cepat deploy KelolaAja Backend ke Railway menggunakan Docker.

---

## ⚡ Quick Deploy (5 Menit)

### Step 1: Push ke GitHub

```bash
git add .
git commit -m "Add Docker support"
git push origin main
```

### Step 2: Setup Railway Project

1. Buka [Railway.app](https://railway.app)
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Pilih repository: `kelolaaja-BE`

### Step 3: Add PostgreSQL Database

1. Klik **"New"** di Railway dashboard
2. Pilih **"Database"**
3. Pilih **"Add PostgreSQL"**
4. Database akan auto-create dengan connection string

### Step 4: Configure Environment Variables

Klik service `kelolaaja-BE` → **"Variables"** → Tambahkan:

```env
NODE_ENV=production
```

```env
PORT=${{PORT}}
```

```env
DATABASE_URL=${{PGDATABASE.DATABASE_URL}}
```

**Generate secrets di terminal:**

```bash
# Generate ACCESS_TOKEN_SECRET
openssl rand -base64 64

# Generate REFRESH_TOKEN_SECRET  
openssl rand -base64 64

# Generate SECRET_KEY
openssl rand -base64 32
```

**Tambahkan ke Railway:**

```env
ACCESS_TOKEN_SECRET=<hasil-dari-command-1>
```

```env
REFRESH_TOKEN_SECRET=<hasil-dari-command-2>
```

```env
SECRET_KEY=<hasil-dari-command-3>
```

```env
WEB_URL=https://your-frontend-domain.com
```

### Step 5: Deploy!

Railway akan otomatis:
1. ✅ Detect Dockerfile
2. ✅ Build Docker image
3. ✅ Run migrations (`prisma migrate deploy`)
4. ✅ Start application

**Monitor deployment:**
- Klik **"Deployments"** untuk lihat progress
- Klik **"View Logs"** untuk lihat logs real-time

### Step 6: Verify Deployment

Railway akan generate URL otomatis (misal: `kelolaaja-be-production.up.railway.app`)

**Test endpoints:**

```bash
# Health check
curl https://your-app.up.railway.app/health

# API info
curl https://your-app.up.railway.app/api
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-12T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Step 7: Run Seed (Optional)

**Install Railway CLI:**

```bash
npm install -g @railway/cli
```

**Login dan run seed:**

```bash
# Login
railway login

# Link to project
railway link

# Run seed
railway run npm run seed
```

---

## 🔧 Troubleshooting

### Problem: Build fails dengan error Prisma

**Error:**
```
Error: Environment variable not found: DATABASE_URL
```

**Solution:**
1. Pastikan PostgreSQL database sudah di-add
2. Pastikan `DATABASE_URL=${{PGDATABASE.DATABASE_URL}}` sudah di-set
3. Redeploy: Klik **"Deploy"** → **"Redeploy"**

### Problem: Container crashes setelah deploy

**Check logs:**
```bash
railway logs
```

**Common causes:**
1. Missing environment variables
2. Database connection failed
3. Migration error

**Solution:**
```bash
# Verify all env vars are set
railway variables

# Force redeploy
railway up --detach
```

### Problem: Migration fails

**Error:**
```
Migration failed: Database connection timeout
```

**Solution:**
1. Tunggu 30-60 detik (database masih starting)
2. Klik **"Redeploy"**
3. Check database status di Railway dashboard

### Problem: Port binding error

**Error:**
```
Error: listen EADDRINUSE: address already in use :::8080
```

**Solution:**
Railway auto-assign PORT. Pastikan environment variable:
```env
PORT=${{PORT}}
```
Sudah di-set (TIDAK hardcode 8080!)

---

## 🎯 Custom Domain

### Add Custom Domain

1. Klik service → **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"** atau **"Custom Domain"**

### Setup DNS (untuk custom domain)

**A Record:**
```
Type: CNAME
Name: api (atau @)
Value: your-app.up.railway.app
```

Railway auto-provides SSL certificate! 🔒

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Install CLI
npm i -g @railway/cli

# View logs
railway logs

# Follow logs real-time
railway logs --follow
```

### Check Metrics

Railway dashboard shows:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Network traffic
- ✅ Request count

### Database Backup

```bash
# Connect to database
railway connect postgres

# Backup
pg_dump -U postgres kelolaaja_db > backup.sql

# Restore (if needed)
psql -U postgres kelolaaja_db < backup.sql
```

### Update Application

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys!
```

---

## 💰 Pricing Estimate

**Railway Free Tier:**
- $5 credit/month (cukup untuk small app)
- Auto-sleep after 30 min inactivity

**Hobby Plan ($5/month):**
- No auto-sleep
- Better performance
- More resources

**Pro Plan ($20/month):**
- Production-ready
- Priority support
- Higher limits

---

## ✅ Production Checklist

Before going live:

- [ ] All environment variables set dengan secure values
- [ ] `ACCESS_TOKEN_SECRET` & `REFRESH_TOKEN_SECRET` generated with `openssl rand -base64 64`
- [ ] `SECRET_KEY` generated with `openssl rand -base64 32`
- [ ] `WEB_URL` set ke frontend domain yang benar
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (auto by Railway)
- [ ] Database backup strategy in place
- [ ] Monitoring & logging configured
- [ ] Health check endpoint working: `/health`
- [ ] Seed data loaded: `railway run npm run seed`
- [ ] **CRITICAL:** Change default admin passwords!

---

## 🚀 Post-Deployment

### Change Default Admin Password

```bash
# Login dengan default credentials
# POST /api/auth/login
{
  "email": "admin@kelolaaja.com",
  "password": "admin123"
}

# Change password immediately
# PUT /api/users/me/password
{
  "currentPassword": "admin123",
  "newPassword": "YourSecurePassword123!"
}
```

### Test All Critical Endpoints

```bash
# Health check
curl https://your-app.up.railway.app/health

# Login
curl -X POST https://your-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kelolaaja.com","password":"your-new-password"}'

# Get users (with token)
curl https://your-app.up.railway.app/api/users \
  -H "Authorization: Bearer <your-token>"
```

---

## 📞 Support

**Railway Documentation:**
- https://docs.railway.app

**KelolaAja Guides:**
- [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - Full Docker guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

**Stuck?**
1. Check Railway logs: `railway logs`
2. Verify environment variables: `railway variables`
3. Test locally first: `docker-compose up`
4. Check Railway status: https://status.railway.app

---

## 🎉 Done!

Your KelolaAja Backend is now live on Railway with Docker! 🚀

Next steps:
1. Configure frontend to use new API URL
2. Setup monitoring & alerts
3. Plan database backup strategy
4. Share API documentation with frontend team
