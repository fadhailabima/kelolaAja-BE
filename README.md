# KelolaAja Backend API

Backend API untuk aplikasi KelolaAja menggunakan Node.js, Express, TypeScript, dan Prisma ORM dengan PostgreSQL.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Access & Refresh Tokens)
- **Password Hashing**: bcrypt

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

## 🛠️ Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone repository

```bash
git clone <repo-url>
cd kelolaAja-BE
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` file dengan konfigurasi Anda:

```env
NODE_ENV=development
PORT=8080

DATABASE_URL="postgresql://user:password@localhost:5432/kelolaaja_db"

SECRET_KEY=your-secret-key
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

CORS_ORIGIN=http://localhost:3000
```

4. Setup database

```bash
# Push schema ke database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Run seeder (create default users)
npm run seed
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 👥 Default Users (Seeded)

Setelah menjalankan seeder, Anda akan mendapat 3 akun:

| Email                | Password | Role   |
| -------------------- | -------- | ------ |
| admin@kelolaaja.com  | admin123 | Admin  |
| editor@kelolaaja.com | admin123 | Editor |
| viewer@kelolaaja.com | admin123 | Viewer |

## 🌐 Landing Page Modules

Terdapat tiga ekosistem baru untuk kebutuhan landing page admin panel:

- **Industry Ecosystem** – CRUD lengkap `Industry`, `IndustryProblem`, `IndustrySolution`, dan `IndustryMedia`. Endpoint publik tersedia di `/api/industries` dan `/api/industries/:slug` (dengan dukungan locale), sedangkan endpoint admin berada di `/api/industries/admin/*`.
- **Feature Page Ecosystem** – Mengelola detail halaman fitur (hero/about/CTA) dan Item pendukung (`FeaturePageItem`). Endpoint publik: `/api/feature-pages` dan `/api/feature-pages/:slug`.
- **Visitor & Analytics** – Tracking visitor (`/api/analytics/visitors`), page view (`/api/analytics/page-views`), serta dashboard admin untuk overview, daftar visitor, dan page view (`/api/analytics/admin/*`).

## 🌱 Development Seed Data

Tersedia seeder tambahan untuk mengisi contoh data Industry dan Feature Page saat development:

```bash
NODE_ENV=development npx ts-node prisma/seed-industries.ts
NODE_ENV=development npx ts-node prisma/seed-feature-pages.ts
```

Kedua seed ini otomatis berhenti jika `NODE_ENV=production`, sehingga aman untuk deployment. Jalankan `npm run seed:all` bila ingin menggabungkan dengan seed utama lainnya.

## 🧪 Manual Testing via Postman

Folder `tests/postman/` menyertakan koleksi dan environment siap pakai:

- `kelolaaja-landing.postman_collection.json`
- `kelolaaja-landing.postman_environment.json`

Langkah cepat:

1. Import kedua file tersebut ke Postman.
2. Isi variable environment `baseUrl`, `adminToken` (hasil login), dan `visitorId` bila dibutuhkan.
3. Jalankan request sesuai README di folder `tests/postman` (mulai dari tracking visitor → page view → endpoint admin/publik).

Anda juga bisa mengeksekusi koleksi melalui CLI menggunakan `newman` sesuai contoh pada dokumentasi tersebut.

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication Endpoints

#### 1. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@kelolaaja.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": 1,
      "username": "superadmin",
      "email": "admin@kelolaaja.com",
      "fullName": "Super Administrator",
      "role": "Admin"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Get Current User Profile

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### 3. Refresh Access Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

#### 4. Logout

```http
POST /api/auth/logout
```

### User Profile Management (Authenticated Users)

#### 5. Update My Profile

```http
PUT /api/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "Updated Name",
  "username": "newusername"
}
```

#### 6. Change Password

```http
PUT /api/users/me/password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123456"
}
```

### User Management (Admin Only)

> **PENTING**: Tidak ada endpoint registrasi publik. Hanya Admin yang bisa menambahkan user baru melalui endpoint `/api/users` (POST).

#### 7. List All Users

```http
GET /api/users?page=1&limit=10&search=admin&role=Admin&isActive=true
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in username, email, fullName
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status (true/false)

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### 9. Get User by ID

```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

#### 10. Create New User (Hanya cara menambah user baru)

```http
POST /api/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@kelolaaja.com",
  "password": "SecurePass123",
  "fullName": "New User",
  "role": "Editor"
}
```

#### 11. Update User by ID

```http
PUT /api/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "Updated Name",
  "role": "Admin",
  "isActive": true
}
```

#### 12. Delete User by ID (Soft Delete)

```http
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

### Authentication

Semua protected endpoints memerlukan header:

```
Authorization: Bearer <access_token>
```

### Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

## 🔒 Password Requirements

- Minimal 8 karakter
- Harus mengandung huruf besar
- Harus mengandung huruf kecil
- Harus mengandung angka

## 📝 Scripts

```bash
npm run dev          # Development mode dengan hot reload
npm run build        # Build untuk production
npm start            # Run production build
npm run seed         # Run database seeder
npm run deploy       # Deploy: Run migrations + start server
```

## 🐳 Docker Deployment

### Quick Start dengan Docker Compose

```bash
# 1. Copy environment template
cp .env.docker .env

# 2. Generate secrets (WAJIB untuk production!)
openssl rand -base64 64  # ACCESS_TOKEN_SECRET
openssl rand -base64 64  # REFRESH_TOKEN_SECRET
openssl rand -base64 32  # SECRET_KEY

# 3. Update .env dengan secrets di atas

# 4. Start services (PostgreSQL + App)
docker-compose up -d

# 5. Check logs
docker-compose logs -f app

# 6. Run seed (opsional)
docker-compose exec app npm run seed

# 7. Test API
curl http://localhost:8080/health
```

### Deploy ke Railway dengan Docker

Railway akan otomatis detect Dockerfile dan build image.

**Step-by-step:**

1. Push code ke GitHub
2. Import project di Railway.app
3. Add PostgreSQL database (klik "New" → "Database" → "PostgreSQL")
4. Set environment variables di Railway:
   ```env
   NODE_ENV=production
   PORT=${{PORT}}
   DATABASE_URL=${{PGDATABASE.DATABASE_URL}}
   ACCESS_TOKEN_SECRET=<generated-secret>
   REFRESH_TOKEN_SECRET=<generated-secret>
   SECRET_KEY=<generated-key>
   WEB_URL=https://your-frontend.com
   ```
5. Deploy akan auto-run!

**📚 Panduan lengkap:** Lihat [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## 🧪 Testing

Gunakan file `api-test.http` untuk testing API menggunakan REST Client extension di VS Code.

## 📦 Database Schema

Database schema lengkap ada di `prisma/schema.prisma` yang mencakup:

- AdminUser - User management
- PricingPlan - Pricing & features
- ContentSection - Content management
- Testimonial - Testimonials
- Industry - Industry solutions
- MediaFile - File management
- Visitor & Analytics - Visitor tracking
- AuditLog - Activity logging
- SiteConfig - Site configuration

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing dengan bcrypt
- ✅ CORS protection
- ✅ HTTP-only cookies
- ✅ Session management
- ✅ Role-based access control

## 📄 License

ISC

## 👨‍💻 Developer

Bima Dharmawan
Derva Anargya Ghaly