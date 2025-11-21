# Architecture Documentation

## Project Structure

Proyek ini menggunakan **Layered Architecture** dengan pemisahan tanggung jawab yang jelas:

```
src/
├── controllers/      # HTTP request handling & response
├── services/         # Business logic & data processing
├── middlewares/      # Request interceptors (auth, locale, etc)
├── routes/          # API endpoint definitions
├── utils/           # Helper functions & utilities
└── types/           # TypeScript type definitions
```

## Architecture Pattern

### 3-Layer Architecture

```
Client Request
     ↓
Routes (API Endpoints)
     ↓
Controllers (HTTP Layer)
     ↓
Services (Business Logic Layer)
     ↓
Prisma ORM (Data Access Layer)
     ↓
PostgreSQL Database
```

### Layer Responsibilities

#### 1. **Routes** (`src/routes/`)

- Define API endpoints
- Apply middlewares (authentication, locale detection)
- Map HTTP methods to controller actions
- Separate public and admin routes

**Example:**

```typescript
// Public routes
router.get("/", detectLocale, PricingController.listPublicPlans);

// Admin routes
router.post("/", authenticate, authorize(["Admin"]), PricingController.createPlan);
```

#### 2. **Controllers** (`src/controllers/`)

- Handle HTTP requests and responses
- Validate request parameters
- Call appropriate service methods
- Format responses using ResponseUtil
- Catch and forward errors to error handler

**Responsibilities:**

- ✅ Request parsing (params, query, body)
- ✅ Response formatting
- ✅ Error handling delegation
- ❌ NO business logic
- ❌ NO database queries

**Example:**

```typescript
export class PricingController {
  static async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PricingService.createPlan(req.body, req.user!.userId);
      ResponseUtil.created(res, "Pricing plan created successfully", result);
    } catch (error) {
      next(error);
    }
  }
}
```

#### 3. **Services** (`src/services/`)

- Implement business logic
- Interact with database via Prisma
- Handle data validation and transformation
- Apply business rules
- Reusable across different controllers

**Responsibilities:**

- ✅ Business logic implementation
- ✅ Data validation
- ✅ Database operations (CRUD)
- ✅ Data transformation
- ✅ Throwing custom errors (ValidationError, NotFoundError)
- ❌ NO HTTP concerns (req, res objects)

**Example:**

```typescript
export class PricingService {
  static async createPlan(data: any, userId: number) {
    // Validation
    if (!data.planCode) {
      throw new ValidationError("Plan code is required");
    }

    // Business logic
    const existingPlan = await prisma.pricingPlan.findUnique({
      where: { planCode: data.planCode }
    });

    if (existingPlan) {
      throw new ValidationError("Plan code already exists");
    }

    // Database operation
    return await prisma.pricingPlan.create({
      data: { ...data, createdBy: userId }
    });
  }
}
```

#### 4. **Middlewares** (`src/middlewares/`)

- Process requests before reaching controllers
- Authentication & authorization
- Locale detection
- Request logging
- Error handling

#### 5. **Utils** (`src/utils/`)

- Reusable helper functions
- Response formatting
- JWT utilities
- Translation helpers
- Custom error classes

## Data Flow Examples

### Public Endpoint (Locale-Aware)

```
GET /api/pricing-plans?locale=en
     ↓
detectLocale middleware → sets req.locale = 'en'
     ↓
PricingController.listPublicPlans
     ↓
PricingService.getPublicPlans(locale: 'en')
     ↓
Prisma query with locale filter
     ↓
Return plans with merged English translations
     ↓
ResponseUtil.success(...)
     ↓
JSON response to client
```

### Admin Endpoint (Protected)

```
POST /api/admin/pricing-plans
Headers: { Authorization: "Bearer <token>" }
Body: { planCode: "STARTER", translations: {...} }
     ↓
authenticate middleware → verify JWT → set req.user
     ↓
authorize(['Admin']) → check user role
     ↓
PricingController.createPlan
     ↓
PricingService.createPlan(req.body, req.user.userId)
     ↓
- Validate required fields
- Check duplicate planCode
- Create plan with translations
     ↓
ResponseUtil.created(...)
     ↓
JSON response with status 201
```

## Multi-Language Pattern

### Translation Tables

Semua entity yang memiliki konten multi-bahasa memiliki tabel translation terpisah:

```prisma
model PricingPlan {
  planId       Int
  planCode     String
  translations PricingTranslation[]
}

model PricingTranslation {
  planId      Int
  locale      Locale  // enum: id, en
  planName    String
  description String

  @@unique([planId, locale])
}
```

### Service Layer Handling

**Public API (Single Locale):**

```typescript
// Returns: { planId, planCode, planName, description, ... }
const plans = await prisma.pricingPlan.findMany({
  include: {
    translations: {
      where: { locale: 'id' }  // Filter by requested locale
    }
  }
});

// Merge translation to root object
return plans.map(plan => ({
  ...plan,
  planName: plan.translations[0]?.planName || '',
  description: plan.translations[0]?.description || ''
}));
```

**Admin API (All Locales):**

```typescript
// Returns: { planId, planCode, translations: { id: {...}, en: {...} } }
const plans = await prisma.pricingPlan.findMany({
  include: {
    translations: true // Get all locales
  }
});

return plans.map(plan => ({
  ...plan,
  translations: mergeAllTranslations(plan.translations)
}));
```

## Error Handling

### Custom Error Classes

```typescript
export class ValidationError extends Error {
  statusCode = 400;
}

export class NotFoundError extends Error {
  statusCode = 404;
}

export class UnauthorizedError extends Error {
  statusCode = 401;
}
```

### Service Layer

Services throw custom errors:

```typescript
if (!plan) {
  throw new NotFoundError("Pricing plan not found");
}

if (existingCode) {
  throw new ValidationError("Plan code already exists");
}
```

### Controller Layer

Controllers catch and forward to error handler:

```typescript
try {
  const result = await Service.method();
  ResponseUtil.success(res, "Success", result);
} catch (error) {
  next(error); // Forward to global error handler
}
```

### Global Error Handler

Centralized error handling in `src/middlewares/errorHandler.ts`:

```typescript
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
```

## Benefits of This Architecture

### 1. **Separation of Concerns**

- Each layer has single responsibility
- Easy to understand and maintain
- Changes in one layer don't affect others

### 2. **Reusability**

- Services can be called from multiple controllers
- Same business logic for different endpoints
- Utility functions shared across codebase

### 3. **Testability**

- Services can be unit tested independently
- Mock database calls easily
- Test business logic without HTTP layer

### 4. **Scalability**

- Easy to add new features
- Can extract services to microservices later
- Clear boundaries for team collaboration

### 5. **Type Safety**

- TypeScript throughout the stack
- Prisma generates types from schema
- Compile-time error detection

## Existing Modules

### Implemented with Services Layer:

1. **Pricing Plans** (`pricing.service.ts`)

   - Public: List plans, Get single plan
   - Admin: CRUD operations with all translations

2. **Features** (`feature.service.ts`)

   - Public: List features, Filter by category, Get categories
   - Admin: CRUD operations with all translations

3. **Plan Features** (`plan-feature.service.ts`)

   - Public: List features for specific plan
   - Admin: Add/Update/Remove features, Bulk operations

4. **Partners** (`partner.service.ts`)
   - Public: List active partners
   - Admin: CRUD operations with logo management

### Pattern for New Modules:

When creating new modules, follow this structure:

1. Create service: `src/services/<module>.service.ts`
2. Create controller: `src/controllers/<module>.controller.ts`
3. Create routes: `src/routes/<module>.routes.ts`
4. Register routes in `src/routes/index.ts`

## Best Practices

### DO ✅

- Keep controllers thin (HTTP only)
- Put all business logic in services
- Use TypeScript types for better IDE support
- Handle errors appropriately at each layer
- Use async/await for asynchronous operations
- Validate data in services before database operations
- Use Prisma's type safety features

### DON'T ❌

- Don't put business logic in controllers
- Don't access database directly from controllers
- Don't use `any` type unless necessary for Prisma complex types
- Don't expose internal errors to clients
- Don't forget to handle edge cases
- Don't skip validation in services

## Future Improvements

1. **Add Repository Layer** (Optional)

   - Separate data access from business logic
   - Easier to switch databases

2. **Add DTOs (Data Transfer Objects)**

   - Strong typing for request/response
   - Validation decorators

3. **Add Unit Tests**

   - Test services independently
   - Mock Prisma client

4. **Add API Documentation**

   - Swagger/OpenAPI
   - Auto-generated from code

5. **Add Caching Layer**
   - Redis for frequently accessed data
   - Improve performance
