# KelolaAja Backend API

> REST API backend untuk aplikasi KelolaAja - ERP Solution Platform

Backend API yang dibangun dengan Node.js, Express, TypeScript, dan Prisma ORM dengan PostgreSQL sebagai database.

## ✨ Features

- 🔐 Authentication & Authorization (JWT-based)
- 👥 User Management (Role-based: Admin, Editor, Viewer)
- 💰 Pricing Plans Management
- 🎯 Content Management System (CMS)
- 📊 Analytics & Visitor Tracking
- 📝 Contact Form & Job Applications
- 🌐 Multi-language Support (ID/EN)
- 🖼️ Media Upload & Management
- 📄 Audit Logging
- 🏢 Industry Solutions & Feature Pages

## 🚀 Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 12+
- **ORM**: Prisma 6.x
- **Authentication**: JWT (Access & Refresh Tokens)
- **Password Hashing**: bcrypt
- **Image Processing**: Sharp
- **Validation**: Zod

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── middlewares/     # Custom middlewares (auth, error handling)
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions (JWT, password, response)
├── types/           # TypeScript types & interfaces
└── app.ts           # Express app setup

prisma/
├── schema.prisma    # Database schema
├── seed.ts          # Database seeder
└── migrations/      # Database migrations
```

## 🛠️ Quick Start

### Prerequisites

- Node.js v18 or higher
- PostgreSQL 12 or higher
- npm or yarn

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd kelolaAja-BE
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` file:

```env
NODE_ENV=development
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/kelolaaja_db"
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
SECRET_KEY=your-secret-key
WEB_URL=http://localhost:3000
```

4. **Setup database**

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npm run seed
```

5. **Start application**

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:8080`

## 👤 Default Admin Account

After running the seed, you can login with:

```
Email    : admin@kelolaaja.com
Password : admin123
```

⚠️ **IMPORTANT**: Change the default password after first login!

## 📚 Documentation

- **[HANDOVER.md](HANDOVER.md)** - Complete handover documentation for production deployment (VPS)
- **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** - Detailed VPS deployment guide
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference (6000+ lines)
- **[MEDIA_UPLOAD_GUIDE.md](MEDIA_UPLOAD_GUIDE.md)** - Media upload guide

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Deploy to VPS

See **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** for complete VPS deployment instructions.

## 📦 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Seed database with initial data
npm run seed:prod    # Seed database in production
npm run deploy       # Run migrations and start server
```

## 📦 Project Structure

```
kelolaAja-BE/
├── src/
│   ├── app.ts              # Application entry point
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth, error handling, etc
│   ├── routes/             # API routes definition
│   ├── services/           # Business logic layer
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript type definitions
│   └── validators/         # Request validation schemas
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed*.ts            # Database seeders
│
├── uploads/                # Media file storage
├── dist/                   # Compiled JavaScript (generated)
│
└── Documentation:
    ├── README.md                    # This file
    ├── HANDOVER.md                  # Production handover guide
    ├── VPS_DEPLOYMENT_GUIDE.md      # VPS deployment steps
    ├── API_DOCUMENTATION.md         # Complete API reference
    └── MEDIA_UPLOAD_GUIDE.md        # Media upload guide
```

## 🔐 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ CORS protection
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection
- ✅ Rate limiting ready
- ✅ Secure HTTP headers

## 🌍 Environment Variables

| Variable               | Description                                   | Required |
| ---------------------- | --------------------------------------------- | -------- |
| `NODE_ENV`             | Environment mode (`development`/`production`) | ✅       |
| `PORT`                 | Server port                                   | ✅       |
| `DATABASE_URL`         | PostgreSQL connection string                  | ✅       |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret                       | ✅       |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret                      | ✅       |
| `SECRET_KEY`           | General encryption key                        | ✅       |
| `WEB_URL`              | Frontend URL for CORS                         | ✅       |
| `RUN_SEED`             | Auto-seed on startup (`true`/`false`)         | ❌       |

See [.env.example](.env.example) for complete configuration.

## 🚢 Deployment

### Option 1: VPS Deployment (Recommended for Client)

Complete step-by-step guide available in:

- **[HANDOVER.md](HANDOVER.md)** - For client/operations team
- **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** - For sysadmin

Quick steps:

1. Setup VPS (Ubuntu 20.04+, Node.js 18+, PostgreSQL, PM2, Nginx)
2. Clone repository
3. Configure `.env`
4. Run `./setup-production.sh`
5. Setup PM2 and Nginx
6. Install SSL certificate

### Option 2: Docker Deployment

```bash
docker-compose up -d
```

### Option 3: Cloud Platform (Railway, Heroku, etc)

See deployment guides in respective documentation files.

## 🔄 Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test
npm run dev

# 3. Build and verify
npm run build

# 4. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 5. Create pull request and merge
```

## 🐛 Troubleshooting

### Common Issues

**1. Cannot connect to database**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

**2. Port already in use**

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

**3. Prisma Client errors**

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

For more troubleshooting, see [HANDOVER.md](HANDOVER.md#troubleshooting).

## 📝 API Quick Reference

### Base URL

```
Development: http://localhost:8080/api
Production:  https://api.yourdomain.com/api
```

### Authentication

```bash
# Login
POST /api/auth/login

# Get current user
GET /api/auth/me

# Refresh token
POST /api/auth/refresh

# Logout
POST /api/auth/logout
```

### Main Endpoints

- `/api/users` - User management (Admin)
- `/api/pricing` - Pricing plans (Public & Admin)
- `/api/features` - Features management
- `/api/industries` - Industry solutions
- `/api/testimonials` - Customer testimonials
- `/api/faqs` - FAQ management
- `/api/contact-submissions` - Contact forms
- `/api/job-postings` - Career management
- `/api/analytics` - Analytics & tracking

**Complete API documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md) (6000+ lines)

## 🤝 Contributing

This is a private project. For internal development:

1. Follow the development workflow above
2. Write clean, documented code
3. Test your changes thoroughly
4. Follow existing code patterns
5. Update documentation as needed

## 📄 License

ISC License

## 👨‍💻 Authors

- Bima Dharmawan
- Derva Anargya Ghaly

---

**Need help?**

- Check [HANDOVER.md](HANDOVER.md) for operational guide
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Check [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md) for deployment

**Last Updated:** January 2, 2026
