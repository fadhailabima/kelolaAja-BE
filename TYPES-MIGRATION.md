# Migration Guide: Menggunakan Types

## 🔄 How to Refactor Existing Code to Use Types

### Before (Tanpa Types) vs After (Dengan Types)

---

## Example 1: Controller

### ❌ Before (Tidak Type-Safe)
```typescript
export class PricingController {
  static async createPlan(req: any, res: any, next: any) {
    try {
      const data = req.body;  // ❌ Any type
      const userId = req.user.userId;  // ❌ Could be undefined
      
      const result = await PricingService.createPlan(data, userId);
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### ✅ After (Type-Safe)
```typescript
import { Request, Response, NextFunction } from 'express';
import { CreatePricingPlanInput } from '../types';

export class PricingController {
  static async createPlan(
    req: Request,           // ✅ Typed
    res: Response,          // ✅ Typed
    next: NextFunction      // ✅ Typed
  ): Promise<void> {        // ✅ Return type
    try {
      // ✅ TypeScript validates structure
      const input: CreatePricingPlanInput = req.body;
      
      // ✅ TypeScript knows user exists (from express.d.ts)
      const userId = req.user!.userId;
      
      const result = await PricingService.createPlan(input, userId);
      
      ResponseUtil.created(res, 'Plan created', result);
    } catch (error) {
      next(error);
    }
  }
}
```

**Benefits:**
- ✅ IDE autocomplete untuk req, res, next
- ✅ Compile error jika missing fields di input
- ✅ Type checking untuk req.user
- ✅ Self-documenting code

---

## Example 2: Service Method

### ❌ Before
```typescript
export class PricingService {
  static async createPlan(data: any, userId: number) {
    // ❌ Don't know what's in data
    const planCode = data.planCode;
    const translations = data.translations;
    
    // ❌ Could miss required fields
    if (!planCode) {
      throw new Error('Plan code required');
    }
    
    // Runtime validation needed for everything
    if (!translations || !translations.id) {
      throw new Error('Indonesian translation required');
    }
    
    // ...create plan
  }
}
```

### ✅ After
```typescript
import { CreatePricingPlanInput } from '../types';

export class PricingService {
  static async createPlan(
    input: CreatePricingPlanInput,  // ✅ Exact structure known
    userId: number
  ) {
    // ✅ TypeScript validates required fields at compile time
    const { 
      planCode,           // ✅ Required
      pricePerUserMonth,  // ✅ Required
      minUsers,           // ✅ Required
      displayOrder,       // ✅ Required
      translations        // ✅ Required with correct structure
    } = input;
    
    // ✅ Only need runtime validation for business rules
    if (!translations.id) {
      throw new ValidationError('Indonesian translation required');
    }
    
    // ...create plan
  }
}
```

**Benefits:**
- ✅ No need to validate field existence (TypeScript does it)
- ✅ IDE shows all available fields
- ✅ Refactoring is safe
- ✅ Less runtime errors

---

## Example 3: API Response

### ❌ Before
```typescript
// Service returns any
static async getPlans(locale: string) {
  const plans = await prisma.pricingPlan.findMany({...});
  
  // ❌ Unknown structure
  return plans.map(plan => ({
    planId: plan.planId,
    planName: plan.translations[0]?.planName,
    // Could miss fields, typos, etc
  }));
}

// Controller
static async listPlans(req: any, res: any) {
  const plans = await PricingService.getPlans('id');
  
  // ❌ Don't know response structure
  res.json({
    success: true,
    data: plans
  });
}
```

### ✅ After
```typescript
import { Locale } from '@prisma/client';

// Define return type
interface PublicPricingPlan {
  planId: number;
  planCode: string;
  planName: string;
  description: string;
  pricePerUserMonth: number;
  displayOrder: number;
}

// Service with return type
static async getPlans(locale: Locale): Promise<PublicPricingPlan[]> {
  const plans: any = await prisma.pricingPlan.findMany({...});
  
  // ✅ TypeScript validates return matches interface
  return plans.map((plan: any) => ({
    planId: plan.planId,
    planCode: plan.planCode,
    planName: plan.translations[0]?.planName || '',
    description: plan.translations[0]?.description || '',
    pricePerUserMonth: plan.pricePerUserMonth,
    displayOrder: plan.displayOrder,
    // ✅ Error if missing field from interface
  }));
}

// Controller with typed response
static async listPlans(req: Request, res: Response, next: NextFunction) {
  const locale = req.locale || Locale.id;
  const plans: PublicPricingPlan[] = await PricingService.getPlans(locale);
  
  ResponseUtil.success(res, 'Plans retrieved', plans);
}
```

**Benefits:**
- ✅ Know exact response structure
- ✅ Frontend can use same types
- ✅ Can't forget required fields
- ✅ Easier to maintain

---

## Example 4: Request Validation

### ❌ Before
```typescript
static async createPlan(req: any, res: any) {
  // ❌ Manual validation for every field
  if (!req.body.planCode) {
    return res.status(400).json({ error: 'Plan code required' });
  }
  
  if (typeof req.body.pricePerUserMonth !== 'number') {
    return res.status(400).json({ error: 'Price must be number' });
  }
  
  if (!req.body.translations) {
    return res.status(400).json({ error: 'Translations required' });
  }
  
  if (!req.body.translations.id) {
    return res.status(400).json({ error: 'Indonesian translation required' });
  }
  
  // ...20 more validations
  
  const result = await PricingService.createPlan(req.body, req.user.userId);
  res.json(result);
}
```

### ✅ After (with Types + Validation Library)
```typescript
import { CreatePricingPlanInput } from '../types';
import { validate } from 'class-validator';  // Optional

static async createPlan(req: Request, res: Response, next: NextFunction) {
  try {
    // ✅ Type assertion + validation in service
    const input: CreatePricingPlanInput = req.body;
    
    // ✅ Business validation only
    const result = await PricingService.createPlan(input, req.user!.userId);
    
    ResponseUtil.created(res, 'Plan created', result);
  } catch (error) {
    next(error);  // ✅ Centralized error handling
  }
}
```

**Benefits:**
- ✅ Less boilerplate code
- ✅ TypeScript catches type errors
- ✅ Centralized error handling
- ✅ Cleaner code

---

## Example 5: Multi-language with Types

### ❌ Before
```typescript
// ❌ Don't know translation structure
const translations = req.body.translations;

await prisma.pricingTranslation.create({
  data: {
    locale: 'id',
    planName: translations.id.planName,  // Could be undefined
    description: translations.id.description,
    // Could miss fields
  }
});
```

### ✅ After
```typescript
import { TranslationInput, PricingTranslationData } from '../types';

interface CreatePlanData {
  planCode: string;
  translations: TranslationInput<PricingTranslationData>;
}

const { translations }: CreatePlanData = req.body;

// ✅ TypeScript knows exact structure
const idTranslation: PricingTranslationData = translations.id;
const enTranslation: PricingTranslationData | undefined = translations.en;

await prisma.pricingTranslation.create({
  data: {
    locale: Locale.id,
    planName: idTranslation.planName,      // ✅ Required
    pricePeriod: idTranslation.pricePeriod || null,  // ✅ Optional
    userRange: idTranslation.userRange || null,      // ✅ Optional
    description: idTranslation.description || null,  // ✅ Optional
  }
});
```

---

## 🎯 Step-by-Step Migration

### Step 1: Add Type Definitions
```bash
# Already done! ✅
src/types/
├── express.d.ts
├── api.ts
├── auth.ts
├── translation.ts
└── service.ts
```

### Step 2: Update Controllers
```typescript
// Before
export class MyController {
  static async method(req: any, res: any, next: any) { ... }
}

// After
import { Request, Response, NextFunction } from 'express';

export class MyController {
  static async method(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Your code with types
    } catch (error) {
      next(error);
    }
  }
}
```

### Step 3: Update Services
```typescript
// Before
static async createSomething(data: any, userId: number) { ... }

// After
import { CreateSomethingInput } from '../types';

static async createSomething(
  input: CreateSomethingInput,
  userId: number
): Promise<Something> {
  const { field1, field2 } = input;  // ✅ Type-safe destructuring
  // ...
}
```

### Step 4: Use in Frontend
```typescript
// Share types with frontend!
// types/api.ts (shared package or copy)
export interface ApiResponse<T> { ... }
export interface PricingPlan { ... }

// Frontend React/Next.js
import { ApiResponse, PricingPlan } from '@/types/api';

const [plans, setPlans] = useState<PricingPlan[]>([]);

async function loadPlans() {
  const res = await fetch('/api/pricing-plans');
  const data: ApiResponse<PricingPlan[]> = await res.json();
  setPlans(data.data || []);
}
```

---

## 🚀 Quick Wins

### 1. Immediate Benefits
- ✅ IDE autocomplete works everywhere
- ✅ Catch errors before running code
- ✅ Refactoring is safe
- ✅ Self-documenting code

### 2. Long-term Benefits
- ✅ Easier onboarding for new developers
- ✅ Fewer bugs in production
- ✅ Faster development
- ✅ Better code quality

### 3. Team Benefits
- ✅ Clear contracts between modules
- ✅ Less communication overhead
- ✅ Consistent patterns
- ✅ Easier code reviews

---

## 💡 Pro Tips

1. **Start with most-used types first**
   - Request/Response types
   - User types
   - Common DTOs

2. **Use generics for reusable patterns**
   ```typescript
   interface ApiResponse<T> { data: T }  // ✅ Reusable
   ```

3. **Export types from service files**
   ```typescript
   // pricing.service.ts
   export interface PricingPlan { ... }
   export class PricingService { ... }
   ```

4. **Document complex types**
   ```typescript
   /**
    * Translation input requires Indonesian (id) and optionally English (en)
    */
   interface TranslationInput<T> {
     id: T;    // Required
     en?: T;   // Optional
   }
   ```

5. **Use type guards for runtime checks**
   ```typescript
   function isPricingPlan(obj: any): obj is PricingPlan {
     return typeof obj.planCode === 'string';
   }
   ```

---

## 📊 Impact Summary

| Metric | Before Types | After Types |
|--------|-------------|-------------|
| **Bugs in Production** | High | Low |
| **Development Speed** | Slow (runtime debugging) | Fast (compile checks) |
| **Code Quality** | Variable | Consistent |
| **Onboarding Time** | Long | Short |
| **Refactoring Risk** | High | Low |
| **Documentation** | Separate docs | Self-documenting |

**ROI:** Time spent adding types = 10x saved in debugging + maintenance! 🎯
