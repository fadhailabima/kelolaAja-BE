# KelolaAja Backend API Documentation

## 📋 Daftar Isi

- [Informasi Umum](#informasi-umum)
- [Authentication](#1-authentication)
- [User Management](#2-user-management)
- [Pricing Plans](#3-pricing-plans)
- [Features](#4-features)
- [Partners](#5-partners)
- [Testimonials](#6-testimonials)
- [FAQs](#7-faqs)
- [Homepage Sections](#8-homepage-sections)
- [Content Management](#9-content-management)
- [Site Configuration](#10-site-configuration)
- [Media Files](#11-media-files)
- [Contact Submissions](#12-contact-submissions)
- [Audit Logs](#13-audit-logs)
- [Industries](#14-industries)
- [Feature Pages](#15-feature-pages)
- [Analytics](#16-analytics)

---

## Informasi Umum

### Base URL

```
http://localhost:8080/api/v1
```

Untuk production, sesuaikan dengan domain yang digunakan.

### Response Format

Semua endpoint menggunakan format response yang konsisten:

**Success Response:**

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {
    /* data response */
  }
}
```

**Success Response dengan Pagination:**

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": [
    /* array data */
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Pesan error"
}
```

### Authentication

Untuk endpoint yang memerlukan autentikasi, sertakan token di header:

```http
Authorization: Bearer <access_token>
```

### Locale Support

Endpoint publik yang mengembalikan konten terlokalisasi mendukung:

- **Indonesian** (`id`)
- **English** (`en`)

Cara menentukan locale:

1. Query parameter: `?locale=id` atau `?locale=en`
2. Header: `Accept-Language: id` atau `Accept-Language: en`
3. Default: `id` (Indonesian)

### User Roles

- **Admin**: Akses penuh ke semua operasi
- **Editor**: Akses baca dan beberapa operasi tulis
- **Viewer**: Hanya akses baca untuk endpoint admin

### Password Requirements

- Minimal 8 karakter
- Harus mengandung huruf besar
- Harus mengandung huruf kecil
- Harus mengandung angka

---

## 1. Authentication

### 1.1 Login

Login untuk mendapatkan access token dan refresh token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** ❌ Tidak diperlukan (Public)

**Request Body:**

```json
{
  "email": "admin@kelolaaja.com",
  "password": "admin123"
}
```

**Response Success (200):**

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
      "role": "Admin",
      "isActive": true,
      "lastLogin": "2025-11-23T10:30:00.000Z",
      "createdAt": "2025-11-20T08:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Token Expiration:**

- Access Token: 15 menit
- Refresh Token: 7 hari

---

### 1.2 Refresh Token

Mendapatkan access token baru menggunakan refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Authentication:** ❌ Tidak diperlukan

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Logout

Logout dari sistem.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** ❌ Tidak diperlukan

**Response Success (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 1.4 Get Current User Profile

Mendapatkan informasi user yang sedang login.

**Endpoint:** `GET /api/auth/me`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "userId": 1,
    "username": "superadmin",
    "email": "admin@kelolaaja.com",
    "fullName": "Super Administrator",
    "role": "Admin",
    "isActive": true,
    "lastLogin": "2025-11-23T10:30:00.000Z",
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-23T10:30:00.000Z"
  }
}
```

---

## 2. User Management

### 2.1 Update My Profile

Update profil user yang sedang login.

**Endpoint:** `PUT /api/users/me`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "username": "newusername",
  "fullName": "New Full Name",
  "email": "newemail@kelolaaja.com"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": 1,
    "username": "newusername",
    "email": "newemail@kelolaaja.com",
    "fullName": "New Full Name",
    "role": "Admin",
    "isActive": true
  }
}
```

---

### 2.2 Change Password

Ubah password user yang sedang login.

**Endpoint:** `PUT /api/users/me/password`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "NewPassword123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 2.3 List All Users

Mendapatkan daftar semua user (Admin only).

**Endpoint:** `GET /api/users`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 10) |
| `search` | string | ❌ | Cari di username, email, fullName |
| `role` | string | ❌ | Filter berdasarkan role (Admin/Editor/Viewer) |
| `isActive` | boolean | ❌ | Filter berdasarkan status aktif |

**Example Request:**

```http
GET /api/users?page=1&limit=10&search=admin&role=Admin&isActive=true
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "userId": 1,
      "username": "superadmin",
      "email": "admin@kelolaaja.com",
      "fullName": "Super Administrator",
      "role": "Admin",
      "isActive": true,
      "lastLogin": "2025-11-23T10:30:00.000Z",
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

---

### 2.4 Get User by ID

Mendapatkan detail user berdasarkan ID (Admin only).

**Endpoint:** `GET /api/users/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | User ID |

**Example Request:**

```http
GET /api/users/1
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": 1,
    "username": "superadmin",
    "email": "admin@kelolaaja.com",
    "fullName": "Super Administrator",
    "role": "Admin",
    "isActive": true,
    "lastLogin": "2025-11-23T10:30:00.000Z",
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-23T10:30:00.000Z"
  }
}
```

---

### 2.5 Create New User

Membuat user baru (Admin only). **Ini adalah satu-satunya cara untuk menambah user baru.**

**Endpoint:** `POST /api/users`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "username": "newuser",
  "email": "newuser@kelolaaja.com",
  "password": "SecurePass123",
  "fullName": "New User",
  "role": "Editor"
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | ✅ | Username unik |
| `email` | string | ✅ | Email unik |
| `password` | string | ✅ | Min 8 karakter, harus ada huruf besar, kecil, dan angka |
| `fullName` | string | ✅ | Nama lengkap |
| `role` | string | ✅ | Admin, Editor, atau Viewer |

**Response Success (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": 4,
    "username": "newuser",
    "email": "newuser@kelolaaja.com",
    "fullName": "New User",
    "role": "Editor",
    "isActive": true,
    "createdAt": "2025-11-23T11:00:00.000Z"
  }
}
```

---

### 2.6 Update User by ID

Update user berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/users/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | User ID |

**Request Body:**

```json
{
  "username": "updatedusername",
  "email": "updated@kelolaaja.com",
  "fullName": "Updated Full Name",
  "role": "Admin",
  "isActive": true
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": 2,
    "username": "updatedusername",
    "email": "updated@kelolaaja.com",
    "fullName": "Updated Full Name",
    "role": "Admin",
    "isActive": true
  }
}
```

---

### 2.7 Delete User by ID

Menghapus user (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | User ID |

**Example Request:**

```http
DELETE /api/users/2
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Note:** Ini adalah soft delete, user tidak benar-benar dihapus dari database tetapi di-set `deletedAt` timestamp.

---

## Default Users (Seeded)

Setelah menjalankan seeder (`npm run seed`), tersedia 3 akun default:

| Email                | Password | Role   |
| -------------------- | -------- | ------ |
| admin@kelolaaja.com  | admin123 | Admin  |
| editor@kelolaaja.com | admin123 | Editor |
| viewer@kelolaaja.com | admin123 | Viewer |

⚠️ **PENTING:** Tidak ada endpoint registrasi publik. Hanya Admin yang bisa menambahkan user baru melalui endpoint `POST /api/users`.

---

## 3. Pricing Plans

### 3.1 Get All Pricing Plans (Public)

Mendapatkan daftar semua paket harga yang aktif dengan terjemahan.

**Endpoint:** `GET /api/pricing-plans`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/pricing-plans?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Pricing plans retrieved successfully",
  "data": [
    {
      "planId": 1,
      "planName": "starter",
      "price": 0,
      "billingCycle": "monthly",
      "displayOrder": 1,
      "isActive": true,
      "displayName": "Paket Starter",
      "description": "Cocok untuk bisnis yang baru memulai",
      "createdAt": "2025-11-20T08:00:00.000Z"
    },
    {
      "planId": 2,
      "planName": "professional",
      "price": 500000,
      "billingCycle": "monthly",
      "displayOrder": 2,
      "isActive": true,
      "displayName": "Paket Professional",
      "description": "Untuk bisnis yang sedang berkembang",
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ]
}
```

---

### 3.2 Get Pricing Plan by ID (Public)

Mendapatkan detail paket harga berdasarkan ID.

**Endpoint:** `GET /api/pricing-plans/:id`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Pricing Plan ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/pricing-plans/1?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Pricing plan retrieved successfully",
  "data": {
    "planId": 1,
    "planName": "starter",
    "price": 0,
    "billingCycle": "monthly",
    "displayOrder": 1,
    "isActive": true,
    "displayName": "Paket Starter",
    "description": "Cocok untuk bisnis yang baru memulai",
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-20T08:00:00.000Z"
  }
}
```

---

### 3.3 Get Plan Features (Public)

Mendapatkan daftar fitur untuk paket tertentu.

**Endpoint:** `GET /api/pricing-plans/:planId/features`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `planId` | number | Pricing Plan ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/pricing-plans/2/features?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Plan features retrieved successfully",
  "data": [
    {
      "planFeatureId": 1,
      "featureName": "users_limit",
      "displayOrder": 1,
      "isActive": true,
      "displayName": "Maksimal 10 Pengguna",
      "description": "Dapat menambahkan hingga 10 pengguna aktif"
    },
    {
      "planFeatureId": 2,
      "featureName": "inventory_module",
      "displayOrder": 2,
      "isActive": true,
      "displayName": "Modul Inventori",
      "description": "Kelola stok barang dengan mudah"
    }
  ]
}
```

---

### 3.4 Get All Plans (Admin)

Mendapatkan semua paket termasuk yang tidak aktif (Admin/Editor).

**Endpoint:** `GET /api/pricing-plans/admin/all`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 10) |
| `search` | string | ❌ | Cari di planName, displayName |
| `isActive` | boolean | ❌ | Filter berdasarkan status aktif |

**Example Request:**

```http
GET /api/pricing-plans/admin/all?page=1&limit=10&isActive=true
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Pricing plans retrieved successfully",
  "data": [
    {
      "planId": 1,
      "planName": "starter",
      "price": 0,
      "billingCycle": "monthly",
      "displayOrder": 1,
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "displayName": "Paket Starter",
          "description": "Cocok untuk bisnis yang baru memulai"
        },
        {
          "locale": "en",
          "displayName": "Starter Plan",
          "description": "Perfect for starting businesses"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

---

### 3.5 Create Pricing Plan (Admin)

Membuat paket harga baru (Admin only).

**Endpoint:** `POST /api/pricing-plans/admin`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "planName": "enterprise",
  "price": 2000000,
  "billingCycle": "monthly",
  "displayOrder": 4,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "displayName": "Paket Enterprise",
      "description": "Solusi lengkap untuk perusahaan besar"
    },
    {
      "locale": "en",
      "displayName": "Enterprise Plan",
      "description": "Complete solution for large enterprises"
    }
  ]
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `planName` | string | ✅ | Nama unik paket (lowercase, no spaces) |
| `price` | number | ✅ | Harga dalam Rupiah |
| `billingCycle` | string | ✅ | monthly, yearly, lifetime |
| `displayOrder` | number | ❌ | Urutan tampilan (default: 0) |
| `isActive` | boolean | ❌ | Status aktif (default: true) |
| `translations` | array | ✅ | Minimal 1 terjemahan (id atau en) |

**Response Success (201):**

```json
{
  "success": true,
  "message": "Pricing plan created successfully",
  "data": {
    "planId": 5,
    "planName": "enterprise",
    "price": 2000000,
    "billingCycle": "monthly",
    "displayOrder": 4,
    "isActive": true,
    "translations": [...]
  }
}
```

---

### 3.6 Update Pricing Plan (Admin)

Update paket harga berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/pricing-plans/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Pricing Plan ID |

**Request Body:**

```json
{
  "price": 2500000,
  "displayOrder": 3,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "displayName": "Paket Enterprise Premium",
      "description": "Solusi terlengkap untuk perusahaan besar"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Pricing plan updated successfully",
  "data": {
    "planId": 5,
    "planName": "enterprise",
    "price": 2500000,
    "billingCycle": "monthly",
    "displayOrder": 3,
    "isActive": true
  }
}
```

---

### 3.7 Delete Pricing Plan (Admin)

Menghapus paket harga (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/pricing-plans/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Pricing Plan ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Pricing plan deleted successfully"
}
```

---

### 3.8 Add Feature to Plan (Admin)

Menambahkan fitur ke paket harga (Admin only).

**Endpoint:** `POST /api/pricing-plans/admin/:planId/features`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `planId` | number | Pricing Plan ID |

**Request Body:**

```json
{
  "featureName": "advanced_reporting",
  "displayOrder": 5,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "displayName": "Laporan Lanjutan",
      "description": "Akses ke semua laporan bisnis"
    },
    {
      "locale": "en",
      "displayName": "Advanced Reporting",
      "description": "Access to all business reports"
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Feature added to plan successfully",
  "data": {
    "planFeatureId": 15,
    "planId": 2,
    "featureName": "advanced_reporting",
    "displayOrder": 5,
    "isActive": true
  }
}
```

---

### 3.9 Bulk Add Features to Plan (Admin)

Menambahkan beberapa fitur sekaligus ke paket (Admin only).

**Endpoint:** `POST /api/pricing-plans/admin/:planId/features/bulk`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `planId` | number | Pricing Plan ID |

**Request Body:**

```json
{
  "features": [
    {
      "featureName": "feature_one",
      "displayOrder": 1,
      "translations": [
        {
          "locale": "id",
          "displayName": "Fitur Satu",
          "description": "Deskripsi fitur satu"
        }
      ]
    },
    {
      "featureName": "feature_two",
      "displayOrder": 2,
      "translations": [
        {
          "locale": "id",
          "displayName": "Fitur Dua",
          "description": "Deskripsi fitur dua"
        }
      ]
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Features added successfully",
  "data": [
    {
      "planFeatureId": 16,
      "featureName": "feature_one",
      "displayOrder": 1
    },
    {
      "planFeatureId": 17,
      "featureName": "feature_two",
      "displayOrder": 2
    }
  ]
}
```

---

### 3.10 Update Plan Feature (Admin)

Update fitur paket berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/pricing-plans/admin/:planId/features/:featureId`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `planId` | number | Pricing Plan ID |
| `featureId` | number | Plan Feature ID |

**Request Body:**

```json
{
  "displayOrder": 10,
  "isActive": false,
  "translations": [
    {
      "locale": "id",
      "displayName": "Fitur Updated",
      "description": "Deskripsi baru"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature updated successfully",
  "data": {
    "planFeatureId": 15,
    "displayOrder": 10,
    "isActive": false
  }
}
```

---

### 3.11 Delete Plan Feature (Admin)

Menghapus fitur dari paket (Admin only).

**Endpoint:** `DELETE /api/pricing-plans/admin/:planId/features/:featureId`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `planId` | number | Pricing Plan ID |
| `featureId` | number | Plan Feature ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature deleted successfully"
}
```

---

## 4. Features

### 4.1 Get All Features (Public)

Mendapatkan daftar semua fitur yang aktif dengan terjemahan.

**Endpoint:** `GET /api/features`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/features?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Features retrieved successfully",
  "data": [
    {
      "featureId": 1,
      "featureName": "inventory_management",
      "category": "core",
      "displayOrder": 1,
      "iconName": "warehouse",
      "isActive": true,
      "title": "Manajemen Inventori",
      "description": "Kelola stok barang dengan mudah dan efisien",
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ]
}
```

---

### 4.2 Get Feature by ID (Public)

Mendapatkan detail fitur berdasarkan ID.

**Endpoint:** `GET /api/features/:id`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Feature ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/features/1?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature retrieved successfully",
  "data": {
    "featureId": 1,
    "featureName": "inventory_management",
    "category": "core",
    "displayOrder": 1,
    "iconName": "warehouse",
    "isActive": true,
    "title": "Manajemen Inventori",
    "description": "Kelola stok barang dengan mudah dan efisien",
    "createdAt": "2025-11-20T08:00:00.000Z"
  }
}
```

---

### 4.3 Get All Features (Admin)

Mendapatkan semua fitur termasuk yang tidak aktif (Admin/Editor).

**Endpoint:** `GET /api/features/admin/all`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Features retrieved successfully",
  "data": [
    {
      "featureId": 1,
      "featureName": "inventory_management",
      "category": "core",
      "displayOrder": 1,
      "iconName": "warehouse",
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "title": "Manajemen Inventori",
          "description": "Kelola stok barang dengan mudah"
        },
        {
          "locale": "en",
          "title": "Inventory Management",
          "description": "Manage your stock easily"
        }
      ]
    }
  ]
}
```

---

### 4.4 Get Feature Categories (Admin)

Mendapatkan daftar kategori fitur yang tersedia (Admin/Editor).

**Endpoint:** `GET /api/features/admin/categories`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature categories retrieved successfully",
  "data": [
    {
      "category": "core",
      "count": 5
    },
    {
      "category": "advanced",
      "count": 3
    },
    {
      "category": "integration",
      "count": 2
    }
  ]
}
```

---

### 4.5 Create Feature (Admin)

Membuat fitur baru (Admin only).

**Endpoint:** `POST /api/features/admin`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "featureName": "crm_module",
  "category": "advanced",
  "iconName": "users",
  "displayOrder": 10,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Modul CRM",
      "description": "Kelola hubungan pelanggan dengan baik"
    },
    {
      "locale": "en",
      "title": "CRM Module",
      "description": "Manage customer relationships effectively"
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Feature created successfully",
  "data": {
    "featureId": 10,
    "featureName": "crm_module",
    "category": "advanced",
    "iconName": "users",
    "displayOrder": 10,
    "isActive": true
  }
}
```

---

### 4.6 Update Feature (Admin)

Update fitur berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/features/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Feature ID |

**Request Body:**

```json
{
  "category": "core",
  "iconName": "user-group",
  "displayOrder": 5,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Modul CRM Premium",
      "description": "Deskripsi diperbarui"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature updated successfully",
  "data": {
    "featureId": 10,
    "category": "core",
    "displayOrder": 5
  }
}
```

---

### 4.7 Delete Feature (Admin)

Menghapus fitur (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/features/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Feature ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature deleted successfully"
}
```

---

## 5. Partners

### 5.1 Get All Partners (Public)

Mendapatkan daftar semua partner yang aktif dengan terjemahan.

**Endpoint:** `GET /api/partners`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/partners?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Partners retrieved successfully",
  "data": [
    {
      "partnerId": 1,
      "partnerName": "tokopedia",
      "logoUrl": "https://example.com/logos/tokopedia.png",
      "websiteUrl": "https://tokopedia.com",
      "displayOrder": 1,
      "isActive": true,
      "displayName": "Tokopedia",
      "description": "Platform e-commerce terbesar di Indonesia",
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ]
}
```

---

### 5.2 Get All Partners (Admin)

Mendapatkan semua partner termasuk yang tidak aktif (Admin/Editor).

**Endpoint:** `GET /api/partners/admin/all`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Partners retrieved successfully",
  "data": [
    {
      "partnerId": 1,
      "partnerName": "tokopedia",
      "logoUrl": "https://example.com/logos/tokopedia.png",
      "websiteUrl": "https://tokopedia.com",
      "displayOrder": 1,
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "displayName": "Tokopedia",
          "description": "Platform e-commerce terbesar di Indonesia"
        },
        {
          "locale": "en",
          "displayName": "Tokopedia",
          "description": "Indonesia's largest e-commerce platform"
        }
      ]
    }
  ]
}
```

---

### 5.3 Create Partner (Admin)

Membuat partner baru (Admin only).

**Endpoint:** `POST /api/partners/admin`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "partnerName": "shopee",
  "logoUrl": "https://example.com/logos/shopee.png",
  "websiteUrl": "https://shopee.co.id",
  "displayOrder": 2,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "displayName": "Shopee",
      "description": "Platform belanja online terpercaya"
    },
    {
      "locale": "en",
      "displayName": "Shopee",
      "description": "Trusted online shopping platform"
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Partner created successfully",
  "data": {
    "partnerId": 5,
    "partnerName": "shopee",
    "logoUrl": "https://example.com/logos/shopee.png",
    "websiteUrl": "https://shopee.co.id",
    "displayOrder": 2,
    "isActive": true
  }
}
```

---

### 5.4 Update Partner (Admin)

Update partner berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/partners/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Partner ID |

**Request Body:**

```json
{
  "logoUrl": "https://example.com/logos/shopee-new.png",
  "displayOrder": 3,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "displayName": "Shopee Indonesia",
      "description": "Deskripsi diperbarui"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Partner updated successfully",
  "data": {
    "partnerId": 5,
    "displayOrder": 3,
    "isActive": true
  }
}
```

---

### 5.5 Delete Partner (Admin)

Menghapus partner (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/partners/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Partner ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Partner deleted successfully"
}
```

---

## 6. Testimonials

### 6.1 Get All Testimonials (Public)

Mendapatkan daftar semua testimonial yang aktif dengan terjemahan.

**Endpoint:** `GET /api/testimonials`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/testimonials?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Testimonials retrieved successfully",
  "data": [
    {
      "testimonialId": 1,
      "customerName": "Budi Santoso",
      "companyName": "PT Maju Jaya",
      "position": "CEO",
      "avatarUrl": "https://example.com/avatars/budi.jpg",
      "rating": 5,
      "displayOrder": 1,
      "isActive": true,
      "content": "KelolaAja sangat membantu bisnis kami berkembang pesat",
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ]
}
```

---

### 6.2 Get Testimonial by ID (Public)

Mendapatkan detail testimonial berdasarkan ID.

**Endpoint:** `GET /api/testimonials/:id`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Testimonial ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/testimonials/1?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Testimonial retrieved successfully",
  "data": {
    "testimonialId": 1,
    "customerName": "Budi Santoso",
    "companyName": "PT Maju Jaya",
    "position": "CEO",
    "avatarUrl": "https://example.com/avatars/budi.jpg",
    "rating": 5,
    "displayOrder": 1,
    "isActive": true,
    "content": "KelolaAja sangat membantu bisnis kami berkembang pesat",
    "createdAt": "2025-11-20T08:00:00.000Z"
  }
}
```

---

### 6.3 Get All Testimonials (Admin)

Mendapatkan semua testimonial termasuk yang tidak aktif (Admin/Editor).

**Endpoint:** `GET /api/admin/testimonials`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Testimonials retrieved successfully",
  "data": [
    {
      "testimonialId": 1,
      "customerName": "Budi Santoso",
      "companyName": "PT Maju Jaya",
      "position": "CEO",
      "avatarUrl": "https://example.com/avatars/budi.jpg",
      "rating": 5,
      "displayOrder": 1,
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "content": "KelolaAja sangat membantu bisnis kami berkembang pesat"
        },
        {
          "locale": "en",
          "content": "KelolaAja greatly helped our business grow rapidly"
        }
      ]
    }
  ]
}
```

---

### 6.4 Create Testimonial (Admin)

Membuat testimonial baru (Admin only).

**Endpoint:** `POST /api/admin/testimonials`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "customerName": "Siti Nurhaliza",
  "companyName": "CV Berkah Selalu",
  "position": "Owner",
  "avatarUrl": "https://example.com/avatars/siti.jpg",
  "rating": 5,
  "displayOrder": 2,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "content": "Dengan KelolaAja, pencatatan keuangan jadi lebih mudah"
    },
    {
      "locale": "en",
      "content": "With KelolaAja, financial recording becomes easier"
    }
  ]
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerName` | string | ✅ | Nama customer |
| `companyName` | string | ❌ | Nama perusahaan |
| `position` | string | ❌ | Jabatan |
| `avatarUrl` | string | ❌ | URL foto profil |
| `rating` | number | ✅ | Rating 1-5 |
| `displayOrder` | number | ❌ | Urutan tampilan |
| `isActive` | boolean | ❌ | Status aktif (default: true) |
| `translations` | array | ✅ | Minimal 1 terjemahan |

**Response Success (201):**

```json
{
  "success": true,
  "message": "Testimonial created successfully",
  "data": {
    "testimonialId": 8,
    "customerName": "Siti Nurhaliza",
    "companyName": "CV Berkah Selalu",
    "rating": 5,
    "isActive": true
  }
}
```

---

### 6.5 Update Testimonial (Admin)

Update testimonial berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/admin/testimonials/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Testimonial ID |

**Request Body:**

```json
{
  "rating": 5,
  "displayOrder": 1,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "content": "Konten testimonial yang diperbarui"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Testimonial updated successfully",
  "data": {
    "testimonialId": 8,
    "rating": 5,
    "displayOrder": 1
  }
}
```

---

### 6.6 Delete Testimonial (Admin)

Menghapus testimonial (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/admin/testimonials/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Testimonial ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Testimonial deleted successfully"
}
```

---

## 7. FAQs

### 7.1 Get FAQ Categories (Public)

Mendapatkan daftar kategori FAQ yang aktif.

**Endpoint:** `GET /api/faqs/categories`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/faqs/categories?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ categories retrieved successfully",
  "data": [
    {
      "categoryId": 1,
      "categoryName": "general",
      "displayOrder": 1,
      "isActive": true,
      "name": "Umum",
      "description": "Pertanyaan umum tentang KelolaAja"
    },
    {
      "categoryId": 2,
      "categoryName": "pricing",
      "displayOrder": 2,
      "isActive": true,
      "name": "Harga & Paket",
      "description": "Pertanyaan tentang harga dan paket langganan"
    }
  ]
}
```

---

### 7.2 Get All FAQs (Public)

Mendapatkan semua FAQ yang aktif dengan terjemahan.

**Endpoint:** `GET /api/faqs`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/faqs?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQs retrieved successfully",
  "data": [
    {
      "faqId": 1,
      "categoryId": 1,
      "displayOrder": 1,
      "isActive": true,
      "question": "Apa itu KelolaAja?",
      "answer": "KelolaAja adalah sistem ERP untuk mengelola bisnis Anda",
      "category": {
        "categoryId": 1,
        "categoryName": "general",
        "name": "Umum"
      }
    }
  ]
}
```

---

### 7.3 Get FAQs by Category (Public)

Mendapatkan FAQ berdasarkan kategori.

**Endpoint:** `GET /api/faqs/by-category`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | number | ✅ | Category ID |
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/faqs/by-category?categoryId=1&locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQs retrieved successfully",
  "data": [
    {
      "faqId": 1,
      "categoryId": 1,
      "displayOrder": 1,
      "isActive": true,
      "question": "Apa itu KelolaAja?",
      "answer": "KelolaAja adalah sistem ERP untuk mengelola bisnis Anda"
    }
  ]
}
```

---

### 7.4 Get FAQ by ID (Public)

Mendapatkan detail FAQ berdasarkan ID.

**Endpoint:** `GET /api/faqs/:id`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | FAQ ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/faqs/1?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ retrieved successfully",
  "data": {
    "faqId": 1,
    "categoryId": 1,
    "displayOrder": 1,
    "isActive": true,
    "question": "Apa itu KelolaAja?",
    "answer": "KelolaAja adalah sistem ERP untuk mengelola bisnis Anda",
    "category": {
      "categoryId": 1,
      "categoryName": "general",
      "name": "Umum"
    }
  }
}
```

---

### 7.5 Get All FAQ Categories (Admin)

Mendapatkan semua kategori FAQ termasuk yang tidak aktif (Admin/Editor).

**Endpoint:** `GET /api/admin/faq-categories`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ categories retrieved successfully",
  "data": [
    {
      "categoryId": 1,
      "categoryName": "general",
      "displayOrder": 1,
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "name": "Umum",
          "description": "Pertanyaan umum"
        },
        {
          "locale": "en",
          "name": "General",
          "description": "General questions"
        }
      ]
    }
  ]
}
```

---

### 7.6 Create FAQ Category (Admin)

Membuat kategori FAQ baru (Admin only).

**Endpoint:** `POST /api/admin/faq-categories`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "categoryName": "technical",
  "displayOrder": 3,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "name": "Teknis",
      "description": "Pertanyaan teknis dan troubleshooting"
    },
    {
      "locale": "en",
      "name": "Technical",
      "description": "Technical questions and troubleshooting"
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "FAQ category created successfully",
  "data": {
    "categoryId": 5,
    "categoryName": "technical",
    "displayOrder": 3,
    "isActive": true
  }
}
```

---

### 7.7 Update FAQ Category (Admin)

Update kategori FAQ berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/admin/faq-categories/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Category ID |

**Request Body:**

```json
{
  "displayOrder": 1,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "name": "Bantuan Teknis",
      "description": "Deskripsi diperbarui"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ category updated successfully",
  "data": {
    "categoryId": 5,
    "displayOrder": 1
  }
}
```

---

### 7.8 Delete FAQ Category (Admin)

Menghapus kategori FAQ (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/admin/faq-categories/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Category ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ category deleted successfully"
}
```

---

### 7.9 Get All FAQs (Admin)

Mendapatkan semua FAQ termasuk yang tidak aktif (Admin/Editor).

**Endpoint:** `GET /api/admin/faqs`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQs retrieved successfully",
  "data": [
    {
      "faqId": 1,
      "categoryId": 1,
      "displayOrder": 1,
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "question": "Apa itu KelolaAja?",
          "answer": "KelolaAja adalah sistem ERP"
        },
        {
          "locale": "en",
          "question": "What is KelolaAja?",
          "answer": "KelolaAja is an ERP system"
        }
      ],
      "category": {
        "categoryId": 1,
        "categoryName": "general"
      }
    }
  ]
}
```

---

### 7.10 Create FAQ (Admin)

Membuat FAQ baru (Admin only).

**Endpoint:** `POST /api/admin/faqs`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "categoryId": 1,
  "displayOrder": 5,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "question": "Bagaimana cara memulai?",
      "answer": "Anda bisa memulai dengan mendaftar dan memilih paket"
    },
    {
      "locale": "en",
      "question": "How to get started?",
      "answer": "You can start by registering and choosing a plan"
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "FAQ created successfully",
  "data": {
    "faqId": 20,
    "categoryId": 1,
    "displayOrder": 5,
    "isActive": true
  }
}
```

---

### 7.11 Update FAQ (Admin)

Update FAQ berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/admin/faqs/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | FAQ ID |

**Request Body:**

```json
{
  "categoryId": 2,
  "displayOrder": 1,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "question": "Pertanyaan diperbarui?",
      "answer": "Jawaban diperbarui"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ updated successfully",
  "data": {
    "faqId": 20,
    "categoryId": 2,
    "displayOrder": 1
  }
}
```

---

### 7.12 Delete FAQ (Admin)

Menghapus FAQ (soft delete) berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/admin/faqs/:id`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | FAQ ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "FAQ deleted successfully"
}
```

---

## 8. Homepage Sections

### 8.1 Benefit Stats

#### 8.1.1 Get All Benefit Stats (Public)

Mendapatkan daftar statistik benefit yang aktif.

**Endpoint:** `GET /api/benefit-stats`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/benefit-stats?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Benefit stats retrieved successfully",
  "data": [
    {
      "statId": 1,
      "statKey": "happy_clients",
      "value": "1000+",
      "displayOrder": 1,
      "iconName": "users",
      "isActive": true,
      "label": "Klien Puas",
      "description": "Pelanggan yang menggunakan KelolaAja"
    }
  ]
}
```

#### 8.1.2 Get All Benefit Stats (Admin)

**Endpoint:** `GET /api/benefit-stats/admin`

**Authentication:** ✅ Required

**Response:** Termasuk semua stat dengan translations lengkap

#### 8.1.3 Create Benefit Stat (Admin)

**Endpoint:** `POST /api/benefit-stats/admin`

**Authentication:** ✅ Required

**Request Body:**

```json
{
  "statKey": "years_experience",
  "value": "10+",
  "iconName": "calendar",
  "displayOrder": 2,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "label": "Tahun Pengalaman",
      "description": "Pengalaman dalam industri ERP"
    },
    {
      "locale": "en",
      "label": "Years Experience",
      "description": "Experience in ERP industry"
    }
  ]
}
```

#### 8.1.4 Update Benefit Stat (Admin)

**Endpoint:** `PUT /api/benefit-stats/admin/:id`

**Authentication:** ✅ Required

#### 8.1.5 Delete Benefit Stat (Admin)

**Endpoint:** `DELETE /api/benefit-stats/admin/:id`

**Authentication:** ✅ Required

---

### 8.2 Process Steps

#### 8.2.1 Get All Process Steps (Public)

Mendapatkan langkah-langkah proses implementasi.

**Endpoint:** `GET /api/process-steps`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/process-steps?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Process steps retrieved successfully",
  "data": [
    {
      "stepId": 1,
      "stepNumber": 1,
      "displayOrder": 1,
      "iconName": "clipboard-check",
      "isActive": true,
      "title": "Konsultasi & Analisis",
      "description": "Tim kami akan menganalisis kebutuhan bisnis Anda"
    }
  ]
}
```

#### 8.2.2 Get All Process Steps (Admin)

**Endpoint:** `GET /api/process-steps/admin`

**Authentication:** ✅ Required

#### 8.2.3 Create Process Step (Admin)

**Endpoint:** `POST /api/process-steps/admin`

**Authentication:** ✅ Required

**Request Body:**

```json
{
  "stepNumber": 4,
  "iconName": "rocket",
  "displayOrder": 4,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Implementasi & Pelatihan",
      "description": "Implementasi sistem dan pelatihan pengguna"
    }
  ]
}
```

#### 8.2.4 Update Process Step (Admin)

**Endpoint:** `PUT /api/process-steps/admin/:id`

**Authentication:** ✅ Required

#### 8.2.5 Delete Process Step (Admin)

**Endpoint:** `DELETE /api/process-steps/admin/:id`

**Authentication:** ✅ Required

---

### 8.3 ERP Benefits

#### 8.3.1 Get All ERP Benefits (Public)

Mendapatkan daftar benefit menggunakan ERP.

**Endpoint:** `GET /api/erp-benefits`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/erp-benefits?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "ERP benefits retrieved successfully",
  "data": [
    {
      "benefitId": 1,
      "displayOrder": 1,
      "iconName": "chart-line",
      "isActive": true,
      "title": "Tingkatkan Efisiensi",
      "description": "Otomasi proses bisnis untuk efisiensi maksimal"
    }
  ]
}
```

#### 8.3.2 Get All ERP Benefits (Admin)

**Endpoint:** `GET /api/erp-benefits/admin`

**Authentication:** ✅ Required

#### 8.3.3 Create ERP Benefit (Admin)

**Endpoint:** `POST /api/erp-benefits/admin`

**Authentication:** ✅ Required

**Request Body:**

```json
{
  "iconName": "shield-check",
  "displayOrder": 5,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Keamanan Data Terjamin",
      "description": "Data bisnis Anda aman dengan enkripsi tingkat enterprise"
    }
  ]
}
```

#### 8.3.4 Update ERP Benefit (Admin)

**Endpoint:** `PUT /api/erp-benefits/admin/:id`

**Authentication:** ✅ Required

#### 8.3.5 Delete ERP Benefit (Admin)

**Endpoint:** `DELETE /api/erp-benefits/admin/:id`

**Authentication:** ✅ Required

---

### 8.4 About Cards

#### 8.4.1 Get All About Cards (Public)

Mendapatkan kartu-kartu di halaman About.

**Endpoint:** `GET /api/about-cards`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/about-cards?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "About cards retrieved successfully",
  "data": [
    {
      "cardId": 1,
      "displayOrder": 1,
      "iconName": "target",
      "isActive": true,
      "title": "Visi Kami",
      "description": "Menjadi solusi ERP terdepan di Indonesia"
    }
  ]
}
```

#### 8.4.2 - 8.4.5 Admin Endpoints

- `GET /api/about-cards/admin` - Get all (Admin)
- `POST /api/about-cards/admin` - Create (Admin)
- `PUT /api/about-cards/admin/:id` - Update (Admin)
- `DELETE /api/about-cards/admin/:id` - Delete (Admin)

---

### 8.5 Advanced Features

#### 8.5.1 Get All Advanced Features (Public)

Mendapatkan daftar fitur-fitur lanjutan.

**Endpoint:** `GET /api/advanced-features`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/advanced-features?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Advanced features retrieved successfully",
  "data": [
    {
      "featureId": 1,
      "displayOrder": 1,
      "iconFile": {
        "mediaFileId": 5,
        "filePath": "/icons/ai-analytics.svg",
        "fileUrl": "https://example.com/icons/ai-analytics.svg"
      },
      "isActive": true,
      "title": "AI Analytics",
      "description": "Analisis bisnis dengan kecerdasan buatan"
    }
  ]
}
```

#### 8.5.2 - 8.5.5 Admin Endpoints

- `GET /api/advanced-features/admin` - Get all (Admin)
- `POST /api/advanced-features/admin` - Create (Admin)
- `PUT /api/advanced-features/admin/:id` - Update (Admin)
- `DELETE /api/advanced-features/admin/:id` - Delete (Admin)

---

### 8.6 KelolaAja Features

#### 8.6.1 Get All KelolaAja Features (Public)

Mendapatkan fitur-fitur utama KelolaAja.

**Endpoint:** `GET /api/kelolaaja-features`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/kelolaaja-features?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "KelolaAja features retrieved successfully",
  "data": [
    {
      "featureId": 1,
      "displayOrder": 1,
      "iconFile": {
        "mediaFileId": 10,
        "filePath": "/icons/inventory.svg",
        "fileUrl": "https://example.com/icons/inventory.svg"
      },
      "isActive": true,
      "title": "Manajemen Inventori",
      "description": "Kelola stok barang dengan mudah dan real-time"
    }
  ]
}
```

#### 8.6.2 - 8.6.5 Admin Endpoints

- `GET /api/kelolaaja-features/admin` - Get all (Admin)
- `POST /api/kelolaaja-features/admin` - Create (Admin)
- `PUT /api/kelolaaja-features/admin/:id` - Update (Admin)
- `DELETE /api/kelolaaja-features/admin/:id` - Delete (Admin)

---

## 9. Content Management

### 9.1 Detail Feature Sections

#### 9.1.1 Get All Detail Feature Sections (Public)

Mendapatkan sections untuk halaman detail fitur.

**Endpoint:** `GET /api/detail-feature-sections`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | ❌ | Filter by category |
| `locale` | string | ❌ | Bahasa (id/en) |

**Example Request:**

```http
GET /api/detail-feature-sections?category=inventory&locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Detail feature sections retrieved successfully",
  "data": [
    {
      "sectionId": 1,
      "sectionCode": "INV-001",
      "category": "inventory",
      "displayOrder": 1,
      "iconFile": {
        "mediaFileId": 15,
        "filePath": "/icons/stock-tracking.svg"
      },
      "isActive": true,
      "title": "Pelacakan Stok Real-time",
      "description": "Monitor stok barang Anda secara real-time dari mana saja"
    }
  ]
}
```

#### 9.1.2 - 9.1.5 Admin Endpoints

- `GET /api/detail-feature-sections/admin` - Get all (Admin)
- `POST /api/detail-feature-sections/admin` - Create (Admin)
- `PUT /api/detail-feature-sections/admin/:id` - Update (Admin)
- `DELETE /api/detail-feature-sections/admin/:id` - Delete (Admin)

**Create Request Body Example:**

```json
{
  "category": "sales",
  "displayOrder": 3,
  "iconFileId": 20,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Manajemen Pesanan",
      "description": "Kelola pesanan pelanggan dengan efisien"
    }
  ]
}
```

---

### 9.2 Content Sections

#### 9.2.1 Get All Content Sections (Public)

Mendapatkan content sections untuk halaman website.

**Endpoint:** `GET /api/content-sections`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/content-sections?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Content sections retrieved successfully",
  "data": [
    {
      "sectionId": 1,
      "sectionKey": "hero_section",
      "sectionType": "hero",
      "displayOrder": 1,
      "metadata": {
        "buttonText": "Mulai Sekarang",
        "buttonLink": "/pricing"
      },
      "backgroundImage": {
        "mediaFileId": 25,
        "fileUrl": "https://example.com/images/hero-bg.jpg"
      },
      "isActive": true,
      "title": "Kelola Bisnis Anda dengan Mudah",
      "content": "Sistem ERP terlengkap untuk bisnis Indonesia"
    }
  ]
}
```

#### 9.2.2 Get Content Section by Key (Public)

Mendapatkan section berdasarkan key.

**Endpoint:** `GET /api/content-sections/key/:key`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | Section key (e.g., hero_section) |

**Example Request:**

```http
GET /api/content-sections/key/hero_section?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Content section retrieved successfully",
  "data": {
    "sectionId": 1,
    "sectionKey": "hero_section",
    "sectionType": "hero",
    "title": "Kelola Bisnis Anda dengan Mudah",
    "content": "Sistem ERP terlengkap untuk bisnis Indonesia",
    "metadata": {
      "buttonText": "Mulai Sekarang",
      "buttonLink": "/pricing"
    }
  }
}
```

#### 9.2.3 - 9.2.6 Admin Endpoints

- `GET /api/content-sections/admin` - Get all (Admin)
- `POST /api/content-sections/admin` - Create (Admin)
- `PUT /api/content-sections/admin/:id` - Update (Admin)
- `DELETE /api/content-sections/admin/:id` - Delete (Admin)

**Create Request Body Example:**

```json
{
  "sectionKey": "cta_section",
  "sectionType": "cta",
  "displayOrder": 5,
  "backgroundImageId": 30,
  "metadata": {
    "primaryButtonText": "Coba Gratis",
    "primaryButtonLink": "/signup",
    "secondaryButtonText": "Lihat Demo",
    "secondaryButtonLink": "/demo"
  },
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Siap Meningkatkan Bisnis Anda?",
      "content": "Mulai gunakan KelolaAja sekarang dan rasakan perbedaannya"
    },
    {
      "locale": "en",
      "title": "Ready to Boost Your Business?",
      "content": "Start using KelolaAja now and feel the difference"
    }
  ]
}
```

---

## 10. Site Configuration

### 10.1 Get All Site Configs (Public)

Mendapatkan konfigurasi website yang bersifat publik.

**Endpoint:** `GET /api/site-config`

**Authentication:** ❌ Tidak diperlukan (Public)

**Response Success (200):**

```json
{
  "success": true,
  "message": "Site configs retrieved successfully",
  "data": [
    {
      "configId": 1,
      "configKey": "site_name",
      "configValue": "KelolaAja",
      "valueType": "string",
      "isPublic": true,
      "category": "general"
    },
    {
      "configId": 2,
      "configKey": "contact_email",
      "configValue": "info@kelolaaja.com",
      "valueType": "string",
      "isPublic": true,
      "category": "contact"
    }
  ]
}
```

---

### 10.2 Get Config by Key (Public)

Mendapatkan konfigurasi berdasarkan key.

**Endpoint:** `GET /api/site-config/key/:key`

**Authentication:** ❌ Tidak diperlukan (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | Config key |

**Example Request:**

```http
GET /api/site-config/key/contact_email
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Config retrieved successfully",
  "data": {
    "configId": 2,
    "configKey": "contact_email",
    "configValue": "info@kelolaaja.com",
    "valueType": "string",
    "isPublic": true
  }
}
```

---

### 10.3 Get All Configs (Admin)

Mendapatkan semua konfigurasi termasuk yang private (Admin).

**Endpoint:** `GET /api/site-config/admin`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Site configs retrieved successfully",
  "data": [
    {
      "configId": 1,
      "configKey": "site_name",
      "configValue": "KelolaAja",
      "valueType": "string",
      "category": "general",
      "isPublic": true,
      "description": "Nama website"
    },
    {
      "configId": 10,
      "configKey": "smtp_password",
      "configValue": "encrypted_password",
      "valueType": "string",
      "category": "email",
      "isPublic": false,
      "description": "Password SMTP server"
    }
  ]
}
```

---

### 10.4 Create Config (Admin)

Membuat konfigurasi baru (Admin only).

**Endpoint:** `POST /api/site-config/admin`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "configKey": "facebook_url",
  "configValue": "https://facebook.com/kelolaaja",
  "valueType": "string",
  "category": "social_media",
  "isPublic": true,
  "description": "URL halaman Facebook"
}
```

**Value Types:**

- `string` - Text value
- `number` - Numeric value
- `boolean` - true/false
- `json` - JSON object

**Response Success (201):**

```json
{
  "success": true,
  "message": "Config created successfully",
  "data": {
    "configId": 50,
    "configKey": "facebook_url",
    "configValue": "https://facebook.com/kelolaaja",
    "valueType": "string",
    "isPublic": true
  }
}
```

---

### 10.5 Update Config by ID (Admin)

Update konfigurasi berdasarkan ID (Admin only).

**Endpoint:** `PUT /api/site-config/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Config ID |

**Request Body:**

```json
{
  "configValue": "https://facebook.com/kelolaaja-official",
  "isPublic": true,
  "description": "URL halaman Facebook resmi"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Config updated successfully",
  "data": {
    "configId": 50,
    "configValue": "https://facebook.com/kelolaaja-official"
  }
}
```

---

### 10.6 Update Config by Key (Admin)

Update konfigurasi berdasarkan key (Admin only).

**Endpoint:** `PUT /api/site-config/admin/key/:key`

**Authentication:** ✅ Required (Admin only)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | Config key |

**Request Body:**

```json
{
  "configValue": "new-value@kelolaaja.com"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Config updated successfully",
  "data": {
    "configKey": "contact_email",
    "configValue": "new-value@kelolaaja.com"
  }
}
```

---

### 10.7 Bulk Update Configs (Admin)

Update beberapa konfigurasi sekaligus (Admin only).

**Endpoint:** `POST /api/site-config/admin/bulk-update`

**Authentication:** ✅ Required (Admin only)

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "configs": [
    {
      "key": "contact_email",
      "value": "contact@kelolaaja.com"
    },
    {
      "key": "contact_phone",
      "value": "+62-21-1234-5678"
    },
    {
      "key": "facebook_url",
      "value": "https://facebook.com/kelolaaja"
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Configs updated successfully",
  "data": {
    "updated": 3,
    "configs": [
      {
        "configKey": "contact_email",
        "configValue": "contact@kelolaaja.com"
      },
      {
        "configKey": "contact_phone",
        "configValue": "+62-21-1234-5678"
      },
      {
        "configKey": "facebook_url",
        "configValue": "https://facebook.com/kelolaaja"
      }
    ]
  }
}
```

---

### 10.8 Delete Config (Admin)

Menghapus konfigurasi berdasarkan ID (Admin only).

**Endpoint:** `DELETE /api/site-config/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Config ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Config deleted successfully"
}
```

---

## 11. Media Files

### 11.1 Get All Media Files (Admin)

Mendapatkan daftar semua file media dengan filter.

**Endpoint:** `GET /api/media-files/admin`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 20) |
| `fileType` | string | ❌ | Filter by type (image/icon/document/video) |
| `search` | string | ❌ | Cari di fileName, altText |

**Example Request:**

```http
GET /api/media-files/admin?page=1&limit=20&fileType=image&search=logo
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Media files retrieved successfully",
  "data": [
    {
      "mediaFileId": 1,
      "fileName": "company-logo.png",
      "filePath": "/uploads/images/company-logo.png",
      "fileUrl": "https://example.com/uploads/images/company-logo.png",
      "fileType": "image",
      "mimeType": "image/png",
      "fileSize": 45678,
      "altText": "Company Logo",
      "caption": "Official company logo",
      "uploadedBy": {
        "userId": 1,
        "fullName": "Admin User"
      },
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### 11.2 Get Media File by ID (Admin)

Mendapatkan detail file media berdasarkan ID.

**Endpoint:** `GET /api/media-files/admin/:id`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Media File ID |

**Example Request:**

```http
GET /api/media-files/admin/1
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Media file retrieved successfully",
  "data": {
    "mediaFileId": 1,
    "fileName": "company-logo.png",
    "filePath": "/uploads/images/company-logo.png",
    "fileUrl": "https://example.com/uploads/images/company-logo.png",
    "fileType": "image",
    "mimeType": "image/png",
    "fileSize": 45678,
    "altText": "Company Logo",
    "caption": "Official company logo",
    "uploadedBy": {
      "userId": 1,
      "username": "admin",
      "fullName": "Admin User"
    },
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-20T08:00:00.000Z"
  }
}
```

---

### 11.3 Upload Media File (Admin)

Upload file media baru.

**Endpoint:** `POST /api/media-files/admin/upload`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | ✅ | File yang akan diupload |
| `fileType` | string | ✅ | image/icon/document/video |
| `altText` | string | ❌ | Teks alternatif |
| `caption` | string | ❌ | Caption/keterangan |

**Response Success (201):**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "mediaFileId": 50,
    "fileName": "uploaded-image.jpg",
    "filePath": "/uploads/images/uploaded-image.jpg",
    "fileUrl": "https://example.com/uploads/images/uploaded-image.jpg",
    "fileType": "image",
    "mimeType": "image/jpeg",
    "fileSize": 123456,
    "uploadedBy": 1
  }
}
```

---

### 11.4 Update Media File (Admin)

Update metadata file media.

**Endpoint:** `PUT /api/media-files/admin/:id`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Media File ID |

**Request Body:**

```json
{
  "fileName": "new-filename.jpg",
  "altText": "Updated alt text",
  "caption": "Updated caption"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Media file updated successfully",
  "data": {
    "mediaFileId": 50,
    "fileName": "new-filename.jpg",
    "altText": "Updated alt text",
    "caption": "Updated caption"
  }
}
```

---

### 11.5 Delete Media File (Admin)

Menghapus file media (soft delete).

**Endpoint:** `DELETE /api/media-files/admin/:id`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Media File ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Media file deleted successfully"
}
```

---

### 11.6 Get Media Statistics (Admin)

Mendapatkan statistik file media.

**Endpoint:** `GET /api/media-files/admin/stats`

**Authentication:** ✅ Required

**Response Success (200):**

```json
{
  "success": true,
  "message": "Media statistics retrieved successfully",
  "data": {
    "totalFiles": 45,
    "totalSize": "125000000",
    "byType": {
      "image": 20,
      "icon": 15,
      "document": 8,
      "video": 2
    }
  }
}
```

---

## 12. Contact Submissions

### 12.1 Submit Contact Form (Public)

Kirim formulir kontak (Public - untuk pengunjung website).

**Endpoint:** `POST /api/contact-submissions`

**Authentication:** ❌ Tidak diperlukan (Public)

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+628123456789",
  "companyName": "Acme Corporation",
  "message": "Saya tertarik dengan produk KelolaAja",
  "source": "website"
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | ✅ | Nama lengkap |
| `email` | string | ✅ | Email valid |
| `phone` | string | ❌ | Nomor telepon |
| `companyName` | string | ❌ | Nama perusahaan |
| `message` | string | ✅ | Pesan/pertanyaan |
| `source` | string | ❌ | website/facebook/instagram/referral |

**Response Success (201):**

```json
{
  "success": true,
  "message": "Contact submission created successfully",
  "data": {
    "submissionId": 100,
    "fullName": "John Doe",
    "email": "john@example.com",
    "status": "pending",
    "createdAt": "2025-11-23T10:30:00.000Z"
  }
}
```

---

### 12.2 Get All Submissions (Admin)

Mendapatkan daftar semua submission dengan filter.

**Endpoint:** `GET /api/contact-submissions/admin`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 20) |
| `status` | string | ❌ | pending/assigned/contacted/resolved |
| `assignedTo` | number | ❌ | Filter by assigned user ID |
| `source` | string | ❌ | Filter by source |

**Example Request:**

```http
GET /api/contact-submissions/admin?page=1&limit=20&status=pending
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contact submissions retrieved successfully",
  "data": [
    {
      "submissionId": 100,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+628123456789",
      "companyName": "Acme Corporation",
      "message": "Saya tertarik dengan produk KelolaAja",
      "status": "pending",
      "source": "website",
      "assignedTo": null,
      "notes": null,
      "submittedAt": "2025-11-23T10:30:00.000Z",
      "contactedAt": null,
      "resolvedAt": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 12.3 Get Submission by ID (Admin)

Mendapatkan detail submission berdasarkan ID.

**Endpoint:** `GET /api/contact-submissions/admin/:id`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Submission ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contact submission retrieved successfully",
  "data": {
    "submissionId": 100,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+628123456789",
    "companyName": "Acme Corporation",
    "message": "Saya tertarik dengan produk KelolaAja",
    "status": "contacted",
    "source": "website",
    "assignedTo": {
      "userId": 2,
      "fullName": "Sales Manager"
    },
    "notes": "Follow up via email",
    "visitor": {
      "visitorId": 50,
      "ipAddress": "192.168.1.1",
      "country": "Indonesia",
      "city": "Jakarta"
    },
    "submittedAt": "2025-11-23T10:30:00.000Z",
    "assignedAt": "2025-11-23T11:00:00.000Z",
    "contactedAt": "2025-11-23T14:30:00.000Z",
    "resolvedAt": null
  }
}
```

---

### 12.4 Update Submission (Admin)

Update status atau notes submission.

**Endpoint:** `PUT /api/contact-submissions/admin/:id`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Submission ID |

**Request Body:**

```json
{
  "status": "contacted",
  "notes": "Telah dihubungi via WhatsApp, tertarik untuk demo"
}
```

**Status Values:**

- `pending` - Belum ditangani
- `assigned` - Sudah di-assign ke admin
- `contacted` - Sudah dihubungi
- `resolved` - Sudah selesai ditangani

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contact submission updated successfully",
  "data": {
    "submissionId": 100,
    "status": "contacted",
    "notes": "Telah dihubungi via WhatsApp, tertarik untuk demo",
    "contactedAt": "2025-11-23T15:00:00.000Z"
  }
}
```

**Note:** Field `contactedAt` dan `resolvedAt` otomatis di-set saat status berubah ke `contacted` atau `resolved`.

---

### 12.5 Assign Submission (Admin)

Assign submission ke admin tertentu.

**Endpoint:** `PUT /api/contact-submissions/admin/:id/assign`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Submission ID |

**Request Body:**

```json
{
  "assignedTo": 2
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contact submission assigned successfully",
  "data": {
    "submissionId": 100,
    "assignedTo": {
      "userId": 2,
      "fullName": "Sales Manager"
    },
    "status": "assigned",
    "assignedAt": "2025-11-23T15:30:00.000Z"
  }
}
```

---

### 12.6 Delete Submission (Admin)

Menghapus submission (soft delete).

**Endpoint:** `DELETE /api/contact-submissions/admin/:id`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Submission ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contact submission deleted successfully"
}
```

---

### 12.7 Get Submission Statistics (Admin)

Mendapatkan statistik submission.

**Endpoint:** `GET /api/contact-submissions/admin/stats`

**Authentication:** ✅ Required

**Response Success (200):**

```json
{
  "success": true,
  "message": "Submission statistics retrieved successfully",
  "data": {
    "total": 150,
    "byStatus": {
      "pending": 45,
      "assigned": 30,
      "contacted": 50,
      "resolved": 25
    },
    "bySource": {
      "website": 100,
      "facebook": 30,
      "instagram": 15,
      "referral": 5
    }
  }
}
```

---

## 13. Audit Logs

### 13.1 Get All Audit Logs (Admin)

Mendapatkan daftar log aktivitas sistem.

**Endpoint:** `GET /api/audit-logs/admin`

**Authentication:** ✅ Required

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 50) |
| `action` | string | ❌ | CREATE/UPDATE/DELETE |
| `entityType` | string | ❌ | Tipe entity (e.g., PricingPlan, User) |
| `userId` | number | ❌ | Filter by user ID |

**Example Request:**

```http
GET /api/audit-logs/admin?page=1&limit=50&action=UPDATE&entityType=PricingPlan
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": [
    {
      "logId": 500,
      "action": "UPDATE",
      "entityType": "PricingPlan",
      "entityId": 2,
      "oldData": {
        "price": 500000,
        "displayOrder": 2
      },
      "newData": {
        "price": 550000,
        "displayOrder": 1
      },
      "user": {
        "userId": 1,
        "fullName": "Admin User"
      },
      "ipAddress": "192.168.1.10",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-11-23T14:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 2500,
    "totalPages": 50
  }
}
```

---

### 13.2 Get Logs by Entity (Admin)

Mendapatkan log untuk entity tertentu.

**Endpoint:** `GET /api/audit-logs/admin/entity/:entityType/:entityId`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `entityType` | string | Tipe entity (e.g., PricingPlan) |
| `entityId` | number | Entity ID |

**Example Request:**

```http
GET /api/audit-logs/admin/entity/PricingPlan/2
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Entity logs retrieved successfully",
  "data": [
    {
      "logId": 500,
      "action": "UPDATE",
      "entityType": "PricingPlan",
      "entityId": 2,
      "oldData": {...},
      "newData": {...},
      "user": {...},
      "createdAt": "2025-11-23T14:30:00.000Z"
    },
    {
      "logId": 350,
      "action": "CREATE",
      "entityType": "PricingPlan",
      "entityId": 2,
      "newData": {...},
      "user": {...},
      "createdAt": "2025-11-20T08:00:00.000Z"
    }
  ]
}
```

---

### 13.3 Get Logs by User (Admin)

Mendapatkan semua log aktivitas user tertentu.

**Endpoint:** `GET /api/audit-logs/admin/user/:userId`

**Authentication:** ✅ Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | number | User ID |

**Example Request:**

```http
GET /api/audit-logs/admin/user/1
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "User logs retrieved successfully",
  "data": [
    {
      "logId": 502,
      "action": "DELETE",
      "entityType": "Feature",
      "entityId": 15,
      "oldData": {...},
      "createdAt": "2025-11-23T16:00:00.000Z"
    },
    {
      "logId": 500,
      "action": "UPDATE",
      "entityType": "PricingPlan",
      "entityId": 2,
      "oldData": {...},
      "newData": {...},
      "createdAt": "2025-11-23T14:30:00.000Z"
    }
  ]
}
```

---

### 13.4 Get Audit Statistics (Admin)

Mendapatkan statistik log audit.

**Endpoint:** `GET /api/audit-logs/admin/stats`

**Authentication:** ✅ Required

**Response Success (200):**

```json
{
  "success": true,
  "message": "Audit statistics retrieved successfully",
  "data": {
    "total": 2500,
    "byAction": {
      "CREATE": 800,
      "UPDATE": 1200,
      "DELETE": 500
    },
    "byEntityType": {
      "PricingPlan": 150,
      "Feature": 200,
      "User": 100,
      "Testimonial": 80,
      "FAQ": 120
    }
  }
}
```

---

### 13.5 Create Audit Log (Admin)

Membuat log audit manual (jarang digunakan, biasanya otomatis).

**Endpoint:** `POST /api/audit-logs/admin`

**Authentication:** ✅ Required

**Request Body:**

```json
{
  "action": "CUSTOM",
  "entityType": "System",
  "entityId": 0,
  "newData": {
    "description": "Manual system configuration change"
  }
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Audit log created successfully",
  "data": {
    "logId": 2501,
    "action": "CUSTOM",
    "entityType": "System",
    "createdAt": "2025-11-23T17:00:00.000Z"
  }
}
```

---

## 14. Industries

### 14.1 Get All Industries (Public)

Mendapatkan daftar industri yang dilayani.

**Endpoint:** `GET /api/industries`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | ❌ | Bahasa (id/en), default: id |

**Example Request:**

```http
GET /api/industries?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Industries retrieved successfully",
  "data": [
    {
      "industryId": 1,
      "industrySlug": "retail",
      "displayOrder": 1,
      "iconName": "shopping-cart",
      "isActive": true,
      "name": "Retail & E-commerce",
      "description": "Solusi lengkap untuk bisnis retail dan toko online",
      "heroTitle": "Kelola Toko Retail Anda dengan Mudah",
      "heroDescription": "Sistem terintegrasi untuk mengelola inventori, penjualan, dan pelanggan"
    }
  ]
}
```

---

### 14.2 Get Industry by Slug (Public)

Mendapatkan detail industri dengan problems, solutions, dan media.

**Endpoint:** `GET /api/industries/:slug`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Industry slug (e.g., retail) |

**Example Request:**

```http
GET /api/industries/retail?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Industry retrieved successfully",
  "data": {
    "industryId": 1,
    "industrySlug": "retail",
    "displayOrder": 1,
    "iconName": "shopping-cart",
    "isActive": true,
    "name": "Retail & E-commerce",
    "description": "Solusi lengkap untuk bisnis retail dan toko online",
    "heroTitle": "Kelola Toko Retail Anda dengan Mudah",
    "heroDescription": "Sistem terintegrasi untuk mengelola inventori, penjualan, dan pelanggan",
    "problems": [
      {
        "problemId": 1,
        "displayOrder": 1,
        "iconName": "box-open",
        "title": "Kesulitan Tracking Stok",
        "description": "Sulit memantau stok barang di berbagai cabang"
      }
    ],
    "solutions": [
      {
        "solutionId": 1,
        "displayOrder": 1,
        "iconName": "check-circle",
        "title": "Real-time Inventory Tracking",
        "description": "Monitor stok barang secara real-time di semua cabang"
      }
    ],
    "media": [
      {
        "mediaId": 1,
        "displayOrder": 1,
        "mediaType": "image",
        "mediaFile": {
          "mediaFileId": 30,
          "fileUrl": "https://example.com/images/retail-dashboard.png",
          "altText": "Dashboard Retail"
        },
        "caption": "Dashboard untuk mengelola toko retail"
      }
    ]
  }
}
```

---

### 14.3 Get All Industries (Admin)

Mendapatkan semua industri termasuk yang tidak aktif.

**Endpoint:** `GET /api/industries/admin/all`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 10) |
| `search` | string | ❌ | Cari di name, slug |
| `isActive` | boolean | ❌ | Filter status aktif |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Industries retrieved successfully",
  "data": [
    {
      "industryId": 1,
      "industrySlug": "retail",
      "displayOrder": 1,
      "iconName": "shopping-cart",
      "isActive": true,
      "translations": [
        {
          "locale": "id",
          "name": "Retail & E-commerce",
          "description": "Solusi lengkap untuk bisnis retail"
        },
        {
          "locale": "en",
          "name": "Retail & E-commerce",
          "description": "Complete solution for retail business"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### 14.4 Get Industry by ID (Admin)

Mendapatkan detail industri berdasarkan ID.

**Endpoint:** `GET /api/industries/admin/:id`

**Authentication:** ✅ Required (Admin, Editor)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Industry ID |

---

### 14.5 Create Industry (Admin)

Membuat industri baru.

**Endpoint:** `POST /api/industries/admin`

**Authentication:** ✅ Required (Admin only)

**Request Body:**

```json
{
  "industrySlug": "manufacturing",
  "iconName": "industry",
  "displayOrder": 5,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "name": "Manufaktur",
      "description": "Solusi untuk industri manufaktur",
      "heroTitle": "Optimalkan Produksi Manufaktur Anda",
      "heroDescription": "Kelola produksi, inventori, dan supply chain"
    },
    {
      "locale": "en",
      "name": "Manufacturing",
      "description": "Solution for manufacturing industry",
      "heroTitle": "Optimize Your Manufacturing Production",
      "heroDescription": "Manage production, inventory, and supply chain"
    }
  ]
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Industry created successfully",
  "data": {
    "industryId": 10,
    "industrySlug": "manufacturing",
    "iconName": "industry",
    "displayOrder": 5,
    "isActive": true
  }
}
```

---

### 14.6 Update Industry (Admin)

Update industri berdasarkan ID.

**Endpoint:** `PUT /api/industries/admin/:id`

**Authentication:** ✅ Required (Admin only)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Industry ID |

---

### 14.7 Delete Industry (Admin)

Menghapus industri (soft delete).

**Endpoint:** `DELETE /api/industries/admin/:id`

**Authentication:** ✅ Required (Admin only)

---

### 14.8 Industry Problems Management

#### Get Industry Problems

**Endpoint:** `GET /api/industries/admin/:industryId/problems`

**Authentication:** ✅ Required (Admin, Editor)

#### Create Problem

**Endpoint:** `POST /api/industries/admin/:industryId/problems`

**Authentication:** ✅ Required (Admin only)

**Request Body:**

```json
{
  "iconName": "alert-triangle",
  "displayOrder": 1,
  "translations": [
    {
      "locale": "id",
      "title": "Pencatatan Manual",
      "description": "Proses pencatatan masih manual dan rawan error"
    }
  ]
}
```

#### Update Problem

**Endpoint:** `PUT /api/industries/admin/problems/:problemId`

**Authentication:** ✅ Required (Admin only)

#### Delete Problem

**Endpoint:** `DELETE /api/industries/admin/problems/:problemId`

**Authentication:** ✅ Required (Admin only)

---

### 14.9 Industry Solutions Management

#### Get Industry Solutions

**Endpoint:** `GET /api/industries/admin/:industryId/solutions`

**Authentication:** ✅ Required (Admin, Editor)

#### Create Solution

**Endpoint:** `POST /api/industries/admin/:industryId/solutions`

**Authentication:** ✅ Required (Admin only)

**Request Body:**

```json
{
  "iconName": "check-circle",
  "displayOrder": 1,
  "translations": [
    {
      "locale": "id",
      "title": "Otomasi Pencatatan",
      "description": "Sistem otomatis mencatat semua transaksi"
    }
  ]
}
```

#### Update Solution

**Endpoint:** `PUT /api/industries/admin/solutions/:solutionId`

**Authentication:** ✅ Required (Admin only)

#### Delete Solution

**Endpoint:** `DELETE /api/industries/admin/solutions/:solutionId`

**Authentication:** ✅ Required (Admin only)

---

### 14.10 Industry Media Management

#### Get Industry Media

**Endpoint:** `GET /api/industries/admin/:industryId/media`

**Authentication:** ✅ Required (Admin, Editor)

#### Create Media

**Endpoint:** `POST /api/industries/admin/:industryId/media`

**Authentication:** ✅ Required (Admin only)

**Request Body:**

```json
{
  "mediaType": "image",
  "mediaFileId": 35,
  "displayOrder": 1,
  "translations": [
    {
      "locale": "id",
      "caption": "Dashboard untuk industri retail"
    }
  ]
}
```

**Media Types:**

- `image` - Gambar/screenshot
- `video` - Video demo
- `icon` - Icon/ilustrasi

#### Update Media

**Endpoint:** `PUT /api/industries/admin/media/:mediaId`

**Authentication:** ✅ Required (Admin only)

#### Delete Media

**Endpoint:** `DELETE /api/industries/admin/media/:mediaId`

**Authentication:** ✅ Required (Admin only)

---

## 15. Feature Pages

### 15.1 Get All Feature Pages (Public)

Mendapatkan daftar halaman fitur.

**Endpoint:** `GET /api/feature-pages`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Example Request:**

```http
GET /api/feature-pages?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature pages retrieved successfully",
  "data": [
    {
      "pageId": 1,
      "pageSlug": "inventory-management",
      "displayOrder": 1,
      "iconName": "warehouse",
      "isActive": true,
      "title": "Manajemen Inventori",
      "description": "Kelola stok barang dengan mudah dan efisien",
      "heroTitle": "Kontrol Inventori Anda dengan Sempurna",
      "heroDescription": "Sistem inventori real-time untuk bisnis modern"
    }
  ]
}
```

---

### 15.2 Get Feature Page by Slug (Public)

Mendapatkan detail halaman fitur dengan items.

**Endpoint:** `GET /api/feature-pages/:slug`

**Authentication:** ❌ Tidak diperlukan (Public)

**Locale:** ✅ Supported

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Page slug |

**Example Request:**

```http
GET /api/feature-pages/inventory-management?locale=id
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature page retrieved successfully",
  "data": {
    "pageId": 1,
    "pageSlug": "inventory-management",
    "displayOrder": 1,
    "iconName": "warehouse",
    "isActive": true,
    "title": "Manajemen Inventori",
    "description": "Kelola stok barang dengan mudah dan efisien",
    "heroTitle": "Kontrol Inventori Anda dengan Sempurna",
    "heroDescription": "Sistem inventori real-time untuk bisnis modern",
    "items": [
      {
        "itemId": 1,
        "displayOrder": 1,
        "iconName": "barcode",
        "title": "Barcode Scanning",
        "description": "Scan barcode untuk update stok secara cepat"
      },
      {
        "itemId": 2,
        "displayOrder": 2,
        "iconName": "bell",
        "title": "Low Stock Alert",
        "description": "Notifikasi otomatis saat stok menipis"
      }
    ]
  }
}
```

---

### 15.3 Get All Feature Pages (Admin)

Mendapatkan semua halaman fitur termasuk yang tidak aktif.

**Endpoint:** `GET /api/feature-pages/admin/all`

**Authentication:** ✅ Required (Admin, Editor)

**Response Success (200):**

```json
{
  "success": true,
  "message": "Feature pages retrieved successfully",
  "data": [
    {
      "pageId": 1,
      "pageSlug": "inventory-management",
      "displayOrder": 1,
      "iconName": "warehouse",
      "isActive": true,
      "translations": [...]
    }
  ]
}
```

---

### 15.4 Get Feature Page by ID (Admin)

**Endpoint:** `GET /api/feature-pages/admin/:id`

**Authentication:** ✅ Required (Admin, Editor)

---

### 15.5 Create Feature Page (Admin)

**Endpoint:** `POST /api/feature-pages/admin`

**Authentication:** ✅ Required (Admin only)

**Request Body:**

```json
{
  "pageSlug": "accounting",
  "iconName": "calculator",
  "displayOrder": 3,
  "isActive": true,
  "translations": [
    {
      "locale": "id",
      "title": "Akuntansi",
      "description": "Sistem akuntansi lengkap",
      "heroTitle": "Kelola Keuangan dengan Akurat",
      "heroDescription": "Laporan keuangan real-time dan akurat"
    }
  ]
}
```

---

### 15.6 Update Feature Page (Admin)

**Endpoint:** `PUT /api/feature-pages/admin/:id`

**Authentication:** ✅ Required (Admin only)

---

### 15.7 Delete Feature Page (Admin)

**Endpoint:** `DELETE /api/feature-pages/admin/:id`

**Authentication:** ✅ Required (Admin only)

---

### 15.8 Feature Page Items Management

#### Get Page Items

**Endpoint:** `GET /api/feature-pages/admin/:pageId/items`

**Authentication:** ✅ Required (Admin, Editor)

#### Create Item

**Endpoint:** `POST /api/feature-pages/admin/:pageId/items`

**Authentication:** ✅ Required (Admin only)

**Request Body:**

```json
{
  "iconName": "chart-bar",
  "displayOrder": 1,
  "translations": [
    {
      "locale": "id",
      "title": "Laporan Penjualan",
      "description": "Analisis penjualan secara detail"
    }
  ]
}
```

#### Update Item

**Endpoint:** `PUT /api/feature-pages/admin/items/:itemId`

**Authentication:** ✅ Required (Admin only)

#### Delete Item

**Endpoint:** `DELETE /api/feature-pages/admin/items/:itemId`

**Authentication:** ✅ Required (Admin only)

---

## 16. Analytics

### 16.1 Track Visitor (Public)

Mencatat pengunjung website (dipanggil otomatis oleh frontend).

**Endpoint:** `POST /api/analytics/visitors`

**Authentication:** ❌ Tidak diperlukan (Public)

**Request Body:**

```json
{
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "country": "Indonesia",
  "city": "Jakarta",
  "referrer": "https://google.com"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Visitor tracked successfully",
  "data": {
    "visitorId": 1000,
    "ipAddress": "192.168.1.1",
    "country": "Indonesia",
    "city": "Jakarta",
    "firstVisit": "2025-11-23T10:00:00.000Z"
  }
}
```

---

### 16.2 Track Page View (Public)

Mencatat page view (dipanggil otomatis oleh frontend).

**Endpoint:** `POST /api/analytics/page-views`

**Authentication:** ❌ Tidak diperlukan (Public)

**Request Body:**

```json
{
  "visitorId": 1000,
  "pagePath": "/pricing",
  "pageTitle": "Pricing - KelolaAja",
  "duration": 45
}
```

**Field Description:**

- `visitorId` - ID dari endpoint /visitors
- `pagePath` - Path halaman (e.g., /pricing)
- `pageTitle` - Judul halaman
- `duration` - Durasi dalam detik (opsional)

**Response Success (201):**

```json
{
  "success": true,
  "message": "Page view tracked successfully",
  "data": {
    "pageViewId": 5000,
    "visitorId": 1000,
    "pagePath": "/pricing",
    "viewedAt": "2025-11-23T10:05:00.000Z"
  }
}
```

---

### 16.3 Get Analytics Overview (Admin)

Mendapatkan overview statistik analytics.

**Endpoint:** `GET /api/analytics/admin/overview`

**Authentication:** ✅ Required (Admin, Editor)

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rangeDays` | number | ❌ | Rentang hari (default: 7) |

**Example Request:**

```http
GET /api/analytics/admin/overview?rangeDays=30
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Analytics overview retrieved successfully",
  "data": {
    "period": {
      "startDate": "2025-10-24T00:00:00.000Z",
      "endDate": "2025-11-23T23:59:59.000Z",
      "days": 30
    },
    "visitors": {
      "total": 5000,
      "unique": 3200,
      "returning": 1800
    },
    "pageViews": {
      "total": 15000,
      "averagePerVisitor": 3
    },
    "topPages": [
      {
        "pagePath": "/pricing",
        "views": 3500,
        "uniqueVisitors": 2000
      },
      {
        "pagePath": "/features",
        "views": 2800,
        "uniqueVisitors": 1800
      }
    ],
    "topCountries": [
      {
        "country": "Indonesia",
        "visitors": 4200
      },
      {
        "country": "Singapore",
        "visitors": 500
      }
    ],
    "topReferrers": [
      {
        "referrer": "google.com",
        "visitors": 2500
      },
      {
        "referrer": "facebook.com",
        "visitors": 1200
      }
    ]
  }
}
```

---

### 16.4 Get All Visitors (Admin)

Mendapatkan daftar pengunjung.

**Endpoint:** `GET /api/analytics/admin/visitors`

**Authentication:** ✅ Required (Admin, Editor)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 50) |
| `search` | string | ❌ | Cari di country, city, ipAddress |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Visitors retrieved successfully",
  "data": [
    {
      "visitorId": 1000,
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "country": "Indonesia",
      "city": "Jakarta",
      "referrer": "https://google.com",
      "firstVisit": "2025-11-23T10:00:00.000Z",
      "lastVisit": "2025-11-23T15:30:00.000Z",
      "visitCount": 5,
      "pageViewCount": 15
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 5000,
    "totalPages": 100
  }
}
```

---

### 16.5 Get Visitor by ID (Admin)

Mendapatkan detail pengunjung dengan semua page views.

**Endpoint:** `GET /api/analytics/admin/visitors/:id`

**Authentication:** ✅ Required (Admin, Editor)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Visitor ID |

**Response Success (200):**

```json
{
  "success": true,
  "message": "Visitor retrieved successfully",
  "data": {
    "visitorId": 1000,
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "country": "Indonesia",
    "city": "Jakarta",
    "referrer": "https://google.com",
    "firstVisit": "2025-11-23T10:00:00.000Z",
    "lastVisit": "2025-11-23T15:30:00.000Z",
    "visitCount": 5,
    "pageViews": [
      {
        "pageViewId": 5000,
        "pagePath": "/",
        "pageTitle": "Home - KelolaAja",
        "duration": 30,
        "viewedAt": "2025-11-23T10:00:00.000Z"
      },
      {
        "pageViewId": 5001,
        "pagePath": "/pricing",
        "pageTitle": "Pricing - KelolaAja",
        "duration": 45,
        "viewedAt": "2025-11-23T10:05:00.000Z"
      }
    ]
  }
}
```

---

### 16.6 Get Page Views (Admin)

Mendapatkan daftar page views dengan filter.

**Endpoint:** `GET /api/analytics/admin/page-views`

**Authentication:** ✅ Required (Admin, Editor)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | ❌ | Halaman (default: 1) |
| `limit` | number | ❌ | Jumlah per halaman (default: 50) |
| `pagePath` | string | ❌ | Filter by page path |
| `visitorId` | number | ❌ | Filter by visitor ID |

**Example Request:**

```http
GET /api/analytics/admin/page-views?pagePath=/pricing&page=1&limit=50
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Page views retrieved successfully",
  "data": [
    {
      "pageViewId": 5001,
      "pagePath": "/pricing",
      "pageTitle": "Pricing - KelolaAja",
      "duration": 45,
      "visitor": {
        "visitorId": 1000,
        "country": "Indonesia",
        "city": "Jakarta"
      },
      "viewedAt": "2025-11-23T10:05:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 3500,
    "totalPages": 70
  }
}
```

---

## 📊 Kesimpulan

Dokumentasi API lengkap ini mencakup **22 modul** dengan total **lebih dari 150 endpoints** yang terdiri dari:

### Modul Publik (Tanpa Autentikasi)

1. **Authentication** - Login, Refresh Token, Logout
2. **Pricing Plans** - Informasi paket harga dan fitur
3. **Features** - Daftar fitur produk
4. **Partners** - Partner dan klien
5. **Testimonials** - Testimoni pelanggan
6. **FAQs** - Pertanyaan yang sering diajukan
7. **Homepage Sections** - Konten untuk homepage (stats, steps, benefits)
8. **Content Sections** - Konten dinamis untuk halaman website
9. **Site Configuration** - Konfigurasi website (publik)
10. **Industries** - Solusi per industri
11. **Feature Pages** - Halaman detail fitur
12. **Contact Submissions** - Form kontak (submit only)
13. **Analytics** - Tracking visitor dan page views

### Modul Admin (Memerlukan Autentikasi)

1. **User Management** - Manajemen user dan permission
2. **Content Management** - Manajemen semua konten website
3. **Media Files** - Upload dan manajemen file
4. **Contact Management** - Manajemen submission kontak
5. **Audit Logs** - Log aktivitas sistem
6. **Analytics Dashboard** - Statistik dan laporan

### Catatan Penting untuk Frontend Developer

#### 🔐 Authentication Flow

1. Login dengan email & password → dapat `accessToken` dan `refreshToken`
2. Simpan `accessToken` di memory dan `refreshToken` di localStorage/cookie
3. Sertakan `accessToken` di header untuk setiap request protected: `Authorization: Bearer <token>`
4. Jika `accessToken` expired (401), gunakan `refreshToken` untuk mendapat token baru
5. Jika `refreshToken` juga expired, redirect ke halaman login

#### 🌍 Locale Management

1. Semua endpoint publik mendukung `locale` query parameter (`?locale=id` atau `?locale=en`)
2. Bisa juga menggunakan `Accept-Language` header
3. Default locale adalah `id` (Indonesian)

#### 📄 Pagination

1. Gunakan query parameter `page` dan `limit`
2. Response akan include `meta` object dengan informasi pagination
3. Default: `page=1`, `limit=10` atau `limit=20` tergantung endpoint

#### ⚠️ Error Handling

Semua error menggunakan format konsisten:

```json
{
  "success": false,
  "message": "Error message yang bisa ditampilkan ke user"
}
```

HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validasi gagal)
- `401` - Unauthorized (perlu login atau token invalid)
- `403` - Forbidden (tidak punya akses)
- `404` - Not Found
- `500` - Server Error

#### 🚀 Best Practices

1. **Gunakan debounce** untuk search/filter endpoints
2. **Cache data** yang jarang berubah (site config, pricing plans)
3. **Lazy load** untuk pagination dan infinite scroll
4. **Retry logic** untuk request yang gagal karena network
5. **Loading states** untuk semua API calls
6. **Optimistic updates** untuk better UX

---

**Dokumentasi lengkap siap digunakan!** 🎉

Jika ada pertanyaan atau butuh klarifikasi untuk endpoint tertentu, silakan hubungi tim backend.

**Last Updated:** November 23, 2025  
**API Version:** 1.0.0  
**Base URL:** `http://localhost:8080/api`
