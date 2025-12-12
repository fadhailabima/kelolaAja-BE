# Railway Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] TypeScript compilation successful (`npm run build`)
- [x] No console errors in production code
- [x] All dependencies in `package.json`
- [x] Prisma schema validated
- [x] All migrations committed to git

### 2. Configuration Files
- [x] `railway.json` configured
- [x] `package.json` scripts updated:
  - [x] `postinstall`: Generates Prisma Client
  - [x] `build`: Includes Prisma generate
  - [x] `deploy`: Runs migrations and starts server
- [x] `.gitignore` properly configured
- [x] `.dockerignore` created
- [x] `.env.railway` template created

### 3. Application Setup
- [x] Health check endpoint (`/health`)
- [x] Environment variables properly used
- [x] PORT from Railway (`${{PORT}}`)
- [x] Database URL from Railway (`${{PGDATABASE.DATABASE_URL}}`)
- [x] CORS configured for production
- [x] Static file serving configured
- [x] Error handling middleware in place

### 4. Database
- [x] Prisma schema validated
- [x] Migrations created and tested locally
- [x] Seed script working
- [x] No manual database edits

### 5. Security
- [ ] Generate strong JWT secrets (min 64 chars)
- [ ] Generate strong session secret (min 32 chars)
- [ ] Change default admin passwords after first deploy
- [ ] Configure proper CORS origins
- [ ] Review and update sensitive configs

### 6. Documentation
- [x] README.md updated
- [x] DEPLOYMENT.md created
- [x] API_DOCUMENTATION.md updated
- [x] Environment variables documented

## 🚀 Railway Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects configuration

### Step 3: Add PostgreSQL Database
1. In your project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway provisions a PostgreSQL instance
4. Copy the `DATABASE_URL` connection string

### Step 4: Configure Environment Variables

Go to your service → Settings → Variables:

**Required Variables:**
```bash
NODE_ENV=production
PORT=${{PORT}}
DATABASE_URL=${{PGDATABASE.DATABASE_URL}}
ACCESS_TOKEN_SECRET=<generate-with-openssl-rand-base64-64>
REFRESH_TOKEN_SECRET=<generate-with-openssl-rand-base64-64>
SECRET_KEY=<generate-with-openssl-rand-base64-32>
WEB_URL=https://your-frontend-domain.com
```

**Optional Variables:**
```bash
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

**Generate Secrets:**
```bash
# JWT Secrets (64 chars)
openssl rand -base64 64

# Session Secret (32 chars)
openssl rand -base64 32
```

### Step 5: Deploy
Railway automatically:
1. ✅ Installs dependencies
2. ✅ Runs `npm run build` (generates Prisma + compiles TS)
3. ✅ Runs `npm run deploy` (migrations + start server)
4. ✅ Starts application

### Step 6: Run Initial Seed (One-Time)
After first successful deployment:

1. Go to your service in Railway
2. Click "Deployments" → Latest deployment
3. Click "View Logs" or open terminal
4. Run:
   ```bash
   npm run seed
   ```

This creates default admin users.

### Step 7: Verify Deployment

**Check Health:**
```bash
curl https://your-app.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-12T...",
  "uptime": 123.456,
  "environment": "production"
}
```

**Test API:**
```bash
curl https://your-app.up.railway.app/api/v1
```

**Login Test:**
```bash
curl -X POST https://your-app.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kelolaaja.com","password":"admin123"}'
```

### Step 8: Change Default Passwords
**CRITICAL SECURITY STEP!**

After first login, immediately change default admin passwords:

```bash
curl -X PUT https://your-app.up.railway.app/api/v1/users/me/password \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "YourStrongPassword123!"
  }'
```

Do this for all 3 default users!

### Step 9: Monitor
- Check Railway logs for errors
- Monitor resource usage
- Set up alerts if needed

## 📊 Post-Deployment

### Custom Domain (Optional)
1. Go to service Settings → Domains
2. Click "Add Domain"
3. Enter your domain
4. Update DNS records (CNAME or A record)
5. Update `WEB_URL` in environment variables

### Database Backups
Railway automatically backs up PostgreSQL daily. To manual backup:
1. Go to PostgreSQL service
2. Click "Backups" tab
3. Create manual backup

### Monitoring
- **Logs**: View real-time in Railway dashboard
- **Metrics**: CPU, Memory, Network usage
- **Alerts**: Configure in project settings

### Updates & Redeployment
```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push origin main
# Railway auto-redeploys
```

## 🔧 Troubleshooting

### Build Fails
**Problem:** `prisma generate` fails
**Solution:** Ensure `postinstall` script runs Prisma generate

**Problem:** TypeScript compilation errors
**Solution:** Run `npm run build` locally first

### Migration Fails
**Problem:** Migration history mismatch
**Solution:** Check all migrations are committed to git

**Problem:** Database connection error
**Solution:** Verify `DATABASE_URL` uses Railway reference variable

### App Crashes
**Problem:** Missing environment variables
**Solution:** Check all required vars are set in Railway

**Problem:** Port binding error
**Solution:** Ensure using `process.env.PORT` not hardcoded port

### CORS Errors
**Problem:** Frontend can't connect
**Solution:** Add frontend URL to `WEB_URL` environment variable

## ✅ Production Ready Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied successfully
- [ ] Seed data created (admin users)
- [ ] Default passwords changed
- [ ] Health check endpoint working
- [ ] CORS configured for production domain
- [ ] Frontend connected and tested
- [ ] API endpoints tested
- [ ] File uploads working
- [ ] Logs monitored for errors
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active (Railway provides free SSL)

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Railway Project URL:** _____________

**Production API URL:** _____________
