# DevFlow Code Quality & Architecture Patterns

> Extracted from `/home/samuel/Desktop/sewAfri/dev-flow` — a Next.js Q&A platform.
> Apply these patterns to the sewafri-frontend (LMS) project.

---

## 1. Folder Structure Design Principles

```
app/
├── (root)/          ← Main app route group (authenticated)
│   ├── layout.tsx   ← Navbar + LeftSidebar + RightSidebar + children
│   ├── page.tsx     ← Home page
│   ├── ask-question/
│   ├── collection/
│   ├── community/
│   ├── jobs/
│   ├── profile/[id]/
│   ├── questions/[id]/
│   │   └── edit/
│   └── tags/
├── (auth)/          ← Auth route group
│   ├── layout.tsx
│   ├── sign-in/
│   └── sign-up/
├── api/             ← API routes (route.ts files)
│   ├── accounts/
│   ├── ai/
│   ├── auth/[...nextauth]/
│   └── users/
├── layout.tsx       ← Root layout (fonts, providers, theme)
├── providers.tsx    ← Client-side providers wrapper
└── globals.css

components/
├── ui/              ← shadcn/ui primitives
├── cards/           ← Data display cards (QuestionCard, TagCard, etc.)
├── forms/           ← Composed form components
├── navigation/      ← Navbar (sub-components), LeftSidebar, RightSidebar
├── filters/         ← Filter components
├── search/          ← Search components
├── editor/          ← Rich text editor components
├── Metric.tsx       ← Reusable metric display
├── UserAvatar.tsx   ← Reusable user avatar
└── DataRenderer.tsx ← Generic data fetching state renderer (loading/empty/error/data)

lib/
├── actions/         ← Server Actions (one file per domain)
│   ├── answer.action.ts
│   ├── auth.action.ts
│   ├── question.action.ts
│   └── tag.action.ts
├── handlers/        ← Reusable handler utilities
│   ├── action.ts    ← Server Action wrapper (validation + auth + db connect)
│   ├── error.ts     ← Unified error formatter (API + Server responses)
│   └── fetch.ts     ← Fetch wrapper with timeout/error handling
├── api.ts           ← Client-side API call functions (grouped by domain)
├── utils.ts         ← Utility functions (cn, getTimeStamp, getDeviconClassName)
├── validations.ts   ← All Zod schemas in one file
├── http-error.ts    ← Custom error classes
├── logger.ts        ← Pino logger setup
├── mongoose.ts      ← DB connection singleton
├── url.ts           ← URL query param helpers
└── db/              ← DB client (Prisma / Drizzle singleton)

constants/
├── index.ts         ← Static data arrays (sidebar links, etc.)
├── routes.ts        ← Route path constants (with dynamic param helpers)
└── states.ts        ← Empty/error state configs for DataRenderer

types/
├── global.d.ts      ← Shared types (ActionResponse, interfaces, route params)
└── action.d.ts      ← Server Action param types

database/            ← Mongoose models (one file per model)
├── index.ts         ← Re-export all models
├── question.model.ts
├── user.model.ts
├── tag.model.ts
└── ...
```

### Key Design Rules:

1. **Route groups `()`** separate concerns without adding URL segments
2. **Server Actions** live in `lib/actions/` NOT alongside components
3. **Database models** are fully isolated in `database/` with TypeScript interfaces
4. **Constants** are centralized — never hardcode routes or strings in components
5. **Types** are split: `global.d.ts` for shared interfaces, `action.d.ts` for action params
6. **Components** organized by domain (cards, forms, navigation) not by generic folders

---

## 2. Server Action Pattern (lib/handlers/action.ts)

Every server action follows this pattern:

```typescript
"use server";

import action from "../handlers/action";
import { SomeSchema } from "../validations";
import handleError from "../handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";

export async function someAction(
  params: SomeParams
): Promise<ActionResponse<SomeInterface>> {
  // 1. Validate + auth + DB connect via action wrapper
  const validationResult = await action({
    params,
    schema: SomeSchema,   // Zod schema
    authorize: true,       // Requires auth?
  });

  // 2. Early return on validation/auth error
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 3. Access validated params & session
  const { field1, field2 } = validationResult.params!;
  const email = validationResult.session?.user?.email;

  try {
    // 4. Business logic
    const result = await SomeModel.find(...)
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
```

### Action Wrapper (lib/handlers/action.ts):

```typescript
type ActionOption<T> = {
  params?: T;
  schema?: z.ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({ params, schema, authorize = false }: ActionOption<T>) {
  // 1. Zod validation
  if (schema && params) {
    parsedParams = schema.parse(params); // throws ZodError on failure
  }
  // 2. Auth check
  if (authorize) {
    session = await auth();
    if (!session) return new UnauthorizedError();
  }
  // 3. DB connection
  await dbConnect();
  return { params: parsedParams, session };
}
```

**Rules:**
- Every action returns `ActionResponse<T>` — never throw, always return `{ success, data }` or `{ success: false, error }`
- Use `JSON.parse(JSON.stringify(result))` to serialize Mongoose documents
- Transactions use `mongoose.startSession()` + `commitTransaction`/`abortTransaction`

---

## 3. Error Handling Pattern (lib/handlers/error.ts + lib/http-error.ts)

### Custom Error Classes:

```typescript
class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
}

class ValidationError extends RequestError { /* 400 */ }
class NotFoundError extends RequestError { /* 404 */ }
class ForbiddenError extends RequestError { /* 403 */ }
class UnauthorizedError extends RequestError { /* 401 */ }
```

### Unified Error Handler:

```typescript
const handleError = (error: unknown, responseType: "api" | "server" = "server") => {
  if (error instanceof RequestError) {
    return formatResponse(responseType, error.statusCode, error.message, error.errors);
  }
  if (error instanceof ZodError) {
    return formatResponse(responseType, 400, validationError.message, validationError.errors);
  }
  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message);
  }
  return formatResponse(responseType, 500, "An unexpected error occurred!");
};
```

- Returns `NextResponse` for API routes, or `{ status, success, error }` for Server Actions
- Always logged via `logger.error()`

---

## 4. Validation Pattern (lib/validations.ts)

All Zod schemas in ONE file, organized by feature:

```typescript
// 1. Auth schemas
export const SignInSchema = z.object({ ... });
export const SignUpSchema = z.object({ ... });

// 2. Domain schemas
export const AskQuestionSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  tags: z.array(z.string().min(1).max(3)).min(1).max(3),
});

// 3. Extend existing schemas
export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1),
});

// 4. Reusable pagination
export const paginatedSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
});
```

---

## 5. Response Type Pattern

```typescript
// types/global.d.ts
type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
```

**Usage convention:**
- Server Actions return `ActionResponse<T>`
- On success: `{ success: true, data: result }`
- On error: `{ success: false, error: { message: "...", details: {...} } }`

---

## 6. Database Model Pattern

```typescript
// database/question.model.ts
import { Schema, models, model, Types, Document } from "mongoose";

// Interface for the raw data
export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  author: Types.ObjectId;
}

// Document type (includes Mongoose Document methods)
export interface IQuestionDoc extends IQuestion, Document {}

// Schema
const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    upvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Export with model caching (prevents hot-reload duplicates)
const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
```

---

## 7. API Route Pattern (lib/api.ts)

Centralized API client using the `fetchHandler` wrapper:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  users: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    create: (userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
  },
  // ... grouped by domain
};
```

### Fetch Handler (lib/handlers/fetch.ts):

```typescript
interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchHandler<T>(
  url: string, options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...config, signal: controller.signal });
    if (!response.ok) throw new RequestError(response.status, `HTTP error:${response.status}`);
    return await response.json();
  } catch (err) {
    return handleError(error) as ActionResponse<T>;
  }
}
```

---

## 8. Component Patterns

### Generic Data Renderer (DataRenderer.tsx):

```typescript
const DataRenderer = <T,>({
  success, error, data,
  empty = DEFAULT_EMPTY,   // from constants/states.ts
  render,
}: Props<T>) => {
  if (!success) return <StateSkeleton image={...} title={error?.message} />;
  if (!data || data.length === 0) return <StateSkeleton {...empty} />;
  return <div>{render(data)}</div>;
};
```

### Component Rules:
- **Destructure props** at the component signature
- **One component per file** (except tightly-coupled sub-components)
- **Components are async** when they need `auth()` or data fetching
- **Server components by default**, add `"use client"` only when needed
- **Named exports** for types/interfaces, **default export** for components

---

## 9. Constants & Config Pattern

```typescript
// constants/routes.ts
const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
};
export default ROUTES;

// constants/states.ts — Empty/error state definitions for DataRenderer
export const EMPTY_QUESTION = {
  title: "Ahh, No Questions Yet!",
  message: "The question board is empty...",
  button: { text: "Ask a Question", href: ROUTES.ASK_QUESTION },
};
```

---

## 10. Middleware Pattern

```typescript
// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/protected/:path*"],
};
```

---

## 11. Logger Pattern (lib/logger.ts)

Uses `pino` with pretty-printing in development:

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: !isEdge && !isProduction
    ? { target: "pino-pretty", options: { colorize: true, ignore: "pid,hostname" } }
    : undefined,
});
```

---

## 12. Naming Conventions Summary

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `question.action.ts`, `auth.config.ts` |
| Components | PascalCase | `QuestionCard.tsx`, `SocialAuthForm.tsx` |
| Server Actions | camelCase | `createQuestion`, `getAllQuestions` |
| Types/Interfaces | PascalCase prefixed `I` | `IQuestion`, `IQuestionDoc` |
| Response Types | PascalCase suffixed | `ActionResponse<T>`, `ErrorResponse` |
| Constants | UPPER_SNAKE | `DEFAULT_EMPTY`, `API_BASE_URL` |
| Routes object | UPPER_SNAKE keys | `HOME`, `SIGN_IN`, `PROFILE(id)` |
| Zod schemas | PascalCase | `AskQuestionSchema`, `SignUpSchema` |
| Action params | PascalCase suffixed `Params` | `CreateQuestionParams` |
| DB models | camelCase model name | `Question`, `User`, `TagQuestion` |

---

## 13. Key Dependencies

```json
{
  "next": "16.x",
  "react": "19.x",
  "mongoose": "^8.x",
  "zod": "^3.x",
  "next-auth": "^5.x",
  "pino": "^9.x",
  "pino-pretty": "^11.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "lucide-react": "^0.x",
  "query-string": "^9.x",
  "shadcn/ui": "latest"
}
```
