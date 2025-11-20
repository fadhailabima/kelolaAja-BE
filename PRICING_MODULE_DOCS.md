# Pricing Plans Module - Multi-Language Implementation

## 📋 Overview

Module Pricing Plans telah diimplementasikan dengan full multi-language support (Indonesian & English) menggunakan best practices untuk internationalization (i18n).

## 🌐 Multi-Language Architecture

### 1. **Locale Enum**

```prisma
enum Locale {
  id  // Indonesian (default)
  en  // English
}
```

### 2. **Translation Pattern**

- **Main Table**: `PricingPlan` - Menyimpan data non-translatable (harga, user range, dll)
- **Translation Table**: `PricingTranslation` - Menyimpan data translatable (nama, deskripsi, dll)
- **Unique Constraint**: `@@unique([planId, locale])` - Mencegah duplikasi per locale

### 3. **Locale Detection Strategy**

Prioritas deteksi locale (dari middleware `detectLocale`):

1. **Query Parameter**: `?locale=en` (Highest priority)
2. **Accept-Language Header**: `Accept-Language: en-US`
3. **Default**: `id` (Indonesian)

## 📡 API Endpoints

### Public Endpoints (No Authentication)

#### 1. List All Pricing Plans

```http
GET /api/pricing-plans
GET /api/pricing-plans?locale=en
GET /api/pricing-plans?locale=id
```

**Response (Indonesian)**:

```json
{
  "success": true,
  "message": "Pricing plans retrieved successfully",
  "data": [
    {
      "planId": 1,
      "planCode": "STARTER",
      "pricePerUserMonth": 50000,
      "minUsers": 1,
      "maxUsers": 10,
      "displayOrder": 1,
      "badgeColor": "#3B82F6",
      "planName": "Paket Starter",
      "pricePeriod": "per pengguna/bulan",
      "userRange": "1-10 pengguna",
      "description": "Cocok untuk bisnis kecil yang baru memulai digitalisasi",
      "features": []
    }
  ]
}
```

**Response (English)**:

```json
{
  "success": true,
  "message": "Pricing plans retrieved successfully",
  "data": [
    {
      "planId": 1,
      "planCode": "STARTER",
      "pricePerUserMonth": 50000,
      "minUsers": 1,
      "maxUsers": 10,
      "displayOrder": 1,
      "badgeColor": "#3B82F6",
      "planName": "Starter Plan",
      "pricePeriod": "per user/month",
      "userRange": "1-10 users",
      "description": "Perfect for small businesses starting their digital journey",
      "features": []
    }
  ]
}
```

#### 2. Get Single Pricing Plan

```http
GET /api/pricing-plans/:id
GET /api/pricing-plans/:id?locale=en
```

### Admin Endpoints (Authentication Required)

#### 3. List All Plans (Admin View)

```http
GET /api/pricing-plans/admin/all
Authorization: Bearer {token}
```

**Features**:

- Returns ALL translations
- Pagination support (`?page=1&limit=10`)
- Search support (`?search=starter`)
- Filter by active status (`?isActive=true`)
- Shows creator/updater info

**Response**:

```json
{
  "success": true,
  "message": "Pricing plans retrieved successfully",
  "data": [
    {
      "planId": 1,
      "planCode": "STARTER",
      "pricePerUserMonth": 50000,
      "minUsers": 1,
      "maxUsers": 10,
      "displayOrder": 1,
      "badgeColor": "#3B82F6",
      "isActive": true,
      "createdAt": "2025-11-20T07:30:00.000Z",
      "updatedAt": "2025-11-20T07:30:00.000Z",
      "creator": {
        "userId": 1,
        "username": "superadmin",
        "email": "admin@kelolaaja.com"
      },
      "updater": {
        "userId": 1,
        "username": "superadmin",
        "email": "admin@kelolaaja.com"
      },
      "translations": {
        "id": {
          "planName": "Paket Starter",
          "pricePeriod": "per pengguna/bulan",
          "userRange": "1-10 pengguna",
          "description": "Cocok untuk bisnis kecil..."
        },
        "en": {
          "planName": "Starter Plan",
          "pricePeriod": "per user/month",
          "userRange": "1-10 users",
          "description": "Perfect for small businesses..."
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

#### 4. Create Pricing Plan (Admin Only)

```http
POST /api/pricing-plans/admin
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:

```json
{
  "planCode": "CUSTOM",
  "pricePerUserMonth": 45000,
  "minUsers": 5,
  "maxUsers": 20,
  "displayOrder": 4,
  "badgeColor": "#F59E0B",
  "translations": {
    "id": {
      "planName": "Paket Custom",
      "pricePeriod": "per pengguna/bulan",
      "userRange": "5-20 pengguna",
      "description": "Paket khusus untuk kebutuhan spesifik"
    },
    "en": {
      "planName": "Custom Plan",
      "pricePeriod": "per user/month",
      "userRange": "5-20 users",
      "description": "Special plan for specific needs"
    }
  }
}
```

**Validations**:

- ✅ `planCode` must be unique
- ✅ Indonesian translation (`id`) is **REQUIRED**
- ✅ English translation (`en`) is optional
- ✅ `pricePerUserMonth`, `minUsers`, `displayOrder` are required

#### 5. Update Pricing Plan (Admin Only)

```http
PUT /api/pricing-plans/admin/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (Update base fields)**:

```json
{
  "pricePerUserMonth": 55000,
  "badgeColor": "#EF4444",
  "isActive": true
}
```

**Request Body (Update translations)**:

```json
{
  "translations": {
    "id": {
      "planName": "Paket Starter Plus",
      "description": "Paket starter dengan fitur tambahan"
    },
    "en": {
      "planName": "Starter Plus Plan",
      "description": "Starter plan with additional features"
    }
  }
}
```

**Request Body (Update both)**:

```json
{
  "pricePerUserMonth": 55000,
  "badgeColor": "#EF4444",
  "translations": {
    "id": {
      "planName": "Paket Starter Plus"
    }
  }
}
```

#### 6. Delete Pricing Plan (Admin Only)

```http
DELETE /api/pricing-plans/admin/:id
Authorization: Bearer {token}
```

**Note**: Soft delete - sets `deletedAt` timestamp and `isActive = false`

## 🔐 Authorization Rules

| Endpoint               | Public | Viewer | Editor | Admin |
| ---------------------- | ------ | ------ | ------ | ----- |
| GET /pricing-plans     | ✅     | ✅     | ✅     | ✅    |
| GET /pricing-plans/:id | ✅     | ✅     | ✅     | ✅    |
| GET /admin/all         | ❌     | ❌     | ✅     | ✅    |
| POST /admin            | ❌     | ❌     | ❌     | ✅    |
| PUT /admin/:id         | ❌     | ❌     | ❌     | ✅    |
| DELETE /admin/:id      | ❌     | ❌     | ❌     | ✅    |

## 🛠️ Technical Implementation

### Files Structure

```
src/
├── controllers/
│   └── pricing.controller.ts       # All pricing plan logic
├── routes/
│   ├── pricing.routes.ts           # Pricing routes definition
│   └── index.ts                    # Route aggregator (updated)
├── middlewares/
│   ├── locale.middleware.ts        # Locale detection
│   └── auth.middleware.ts          # Authentication & authorization
├── utils/
│   └── translation.ts              # Translation helper functions
prisma/
├── schema.prisma                    # Updated with Locale enum
├── seed-pricing.ts                 # Pricing plans seeder
└── migrations/
    └── 20251120081815_add_locale_enum_to_translations/
        └── migration.sql
```

### Key Functions

**Translation Helper** (`src/utils/translation.ts`):

```typescript
// Extract single locale translation
extractTranslation(translations, locale);

// Transform array with locale
transformWithTranslation(items, locale);

// Merge all translations for admin view
mergeAllTranslations(translations);
```

**Locale Middleware** (`src/middlewares/locale.middleware.ts`):

```typescript
// Detects locale from query/header and sets req.locale
detectLocale(req, res, next);
```

## 📊 Database Schema

```prisma
model PricingPlan {
  planId            Int
  planCode          String @unique
  pricePerUserMonth Int
  minUsers          Int
  maxUsers          Int?
  displayOrder      Int
  badgeColor        String?
  isActive          Boolean @default(true)
  deletedAt         DateTime?

  translations      PricingTranslation[]
}

model PricingTranslation {
  translationId Int @id
  planId        Int
  locale        Locale @default(id)  // enum: id | en
  planName      String?
  pricePeriod   String?
  userRange     String?
  description   String?

  @@unique([planId, locale])
}
```

## 🧪 Sample Data

3 pricing plans telah di-seed dengan full translations:

1. **STARTER** - Rp 50,000/user (1-10 users)
2. **PROFESSIONAL** - Rp 40,000/user (11-50 users)
3. **ENTERPRISE** - Rp 30,000/user (51+ users)

Run seeder:

```bash
npx ts-node prisma/seed-pricing.ts
```

## 🚀 Usage Examples

### Frontend Integration

**React/Next.js Example**:

```typescript
// Get plans in user's language
const locale = router.locale; // 'id' or 'en'
const res = await fetch(`/api/pricing-plans?locale=${locale}`);
const { data: plans } = await res.json();

// Display
plans.forEach(plan => {
  console.log(plan.planName); // Already in correct language
  console.log(plan.description); // Already in correct language
});
```

**Admin Panel Example**:

```typescript
// Get all plans with all translations
const res = await fetch('/api/pricing-plans/admin/all', {
  headers: { Authorization: `Bearer ${token}` }
})
const { data: plans } = await res.json()

// Display both languages
plans.forEach(plan => {
  console.log('ID:', plan.translations.id.planName)
  console.log('EN:', plan.translations.en?.planName)
})
```

## ✅ Best Practices Applied

1. ✅ **Enum for Locale** - Type-safe locale handling
2. ✅ **Default Fallback** - Always falls back to Indonesian
3. ✅ **Flexible Detection** - Supports query params & headers
4. ✅ **Single Source of Truth** - Translations in separate table
5. ✅ **Unique Constraints** - Prevents duplicate translations
6. ✅ **Soft Delete** - Preserves data integrity
7. ✅ **Role-Based Access** - Proper authorization
8. ✅ **Pagination** - Efficient data loading
9. ✅ **Search & Filter** - Admin productivity
10. ✅ **Audit Trail** - Creator/updater tracking

## 🔄 Next Steps

Module ini bisa dijadikan template untuk module lain dengan translation:

- FeatureMaster & FeatureTranslation
- FeaturePage & FeaturePageTranslation
- Testimonial & TestimonialTranslation
- Partner & PartnerTranslation
- FAQ & FAQTranslation
- Dan seterusnya...

Pattern yang sama bisa di-reuse untuk semua module yang memiliki translation table! 🎉
