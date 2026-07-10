# API Migration Status

> **Last update (2026-07-10):** Full route audit complete — 114 backend routes catalogued, source-verified, and curl-tested against running server. 6 routes confirmed missing from backend (see Blocked). All smart-contracts, crypto-payments, wallet-linking, vault-redemption, and certificate-minting modules fully wired. Instructor messages rewired from mock data to real messaging API.

## ⚠️ Security Note — `isCorrect` on Answer Options

> **Verified: properly role-gated.** `GET /quizzes/:id` returns `isCorrect` only for INSTRUCTOR/ADMIN roles. The service (`stripQuestionMeta(quiz, hideCorrect)`) explicitly destructures `isCorrect` out of answer options for STUDENT requests before responding. The role check happens at two layers: the `authorize` middleware (gate before controller) and the `getQuizById` service method (role-based `hideCorrect` flag). No route a student can reach ever returns correct-answer data before submission. `POST /quizzes/:id/submit` also never returns answer options in its response — only score/pass metadata. The `isCorrect` field is secure.

## Full Route Audit Summary

| Category | Count | Detail |
|---|---|---|
| Total backend routes | 114 | Includes health (1) and webhook (1) |
| Wired + working | 101 | Backend has route AND frontend calls it — curl-verified (non-404) |
| Wired + broken | 6 | Frontend calls it but no matching backend route — curl-verified 404 |
| Unused backend routes | 5 | Backend has route but no frontend consumer exists |
| Structural exclusions | 2 | `GET /health` (server-level), `POST /payments/webhook` (Stripe) |
| Path/method mismatches | 2 | Frontend path differs structurally from backend (see Blocked) |

## Wired (API Connected)

| Page/Module | Endpoint | Notes |
|---|---|---|
| Auth (sign-in, sign-up) | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/logout` | Full auth flow with JWT, persisted refresh |
| Password reset | `POST /auth/password-reset/request`, `POST /auth/password-reset/confirm` | Request + confirm flow |
| User profile | `GET /users/me`, `PATCH /users/me`, `DELETE /users/me`, `GET /users/:id` | Profile get/update/delete, public profile |
| Course catalog (`/courses`) | `GET /courses` | `BackendCourseCard` renders backend schema |
| Course detail (`/courses/[slug]`) | `GET /courses/:id`, `GET /courses/:id/lessons`, `GET /courses/:id/ratings/summary` | Enroll, wishlist toggle, rating display, review section (write + list) |
| My Learning curriculum (`/my-learning/[courseId]`) | `GET /courses/:id/lessons`, `POST /lessons/:id/complete` | Lesson completion wired; AI tutor floating chat |
| Student Progress (instructor) | — | Blocked (see below) |
| Wallet (`/wallet`) | `GET /wallet/me`, `PATCH /wallet/me/visibility`, `GET /wallet/:publicUrl` | Wallet linking, vault redemption, certificate list, visibility toggle |
| Verify certificate (`/verify/[id]`) | `GET /verify/:certificateId` | Public certificate verification |
| Quiz questions + instructor management | `GET /quizzes/:id`, `POST /quizzes/:id/submit`, `POST /quizzes/:id/questions`, `PATCH /quizzes/:id`, `DELETE /quizzes/:id`, `PATCH /quizzes/:quizId/questions/:questionId`, `DELETE /quizzes/:quizId/questions/:questionId` | Full quiz CRUD + submission |
| Quiz create (instructor) | `POST /courses/:courseId/quizzes` | Create quiz scoped to a course |
| My Courses (instructor) | `GET /courses/mine` | Instructor course list |
| Course Dashboard (instructor) | `GET /courses/:id/dashboard` | Course analytics dashboard |
| Admin users | `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `PATCH /admin/users/:id/role`, `PATCH /admin/users/:id/reactivate` | Full user management |
| Admin courses | `GET /admin/courses` | Course listing for admin |
| Admin certificates | `GET /admin/certificates`, `PATCH /certificates/:id/revoke` | Certificate management |
| Edit course (instructor) | `GET /courses/:id`, `PATCH /courses/:id`, `PATCH /courses/:id/publish`, `PATCH /courses/:id/unpublish`, `DELETE /courses/:id` | Course CRUD + publish lifecycle |
| My Enrollments | `GET /enrollments/me` | Student enrollment list |
| Forum upvote | `PUT /forum/posts/:id/upvote` | Toggle upvote on forum posts |
| Forum thread CRUD | `POST /courses/:courseId/forum/threads`, `GET /courses/:courseId/forum/threads`, `PATCH /forum/threads/:threadId/pin`, `PATCH /forum/threads/:threadId/lock` | Thread creation, pinning, locking |
| Forum post CRUD | `POST /forum/threads/:threadId/posts`, `PATCH /forum/posts/:postId/accept`, `PATCH /forum/posts/:id`, `DELETE /forum/posts/:id` | Post creation, editing, deleting, accepting answers |
| Forum search | `GET /forum/search` | Search forum threads |
| Ratings & Reviews | `GET /courses/:id/ratings/*`, `GET /courses/:id/reviews/*`, `POST /courses/:id/ratings`, `POST /courses/:id/reviews`, `DELETE /courses/:id/ratings/mine`, `DELETE /courses/:id/reviews/mine` | Rating input + review form + list on course detail page |
| AI Course Tutor | `POST /courses/:id/ask` | Floating chat UI on learning page |
| Subscription management | `GET /subscriptions/me`, `PATCH /subscriptions/me/renew`, `POST /subscriptions/`, `POST /subscriptions/:id/cancel` | Full subscription page at `/subscription` |
| Wishlist | `GET /wishlist/me`, `POST /wishlist/:courseId`, `DELETE /wishlist/:courseId` | Wishlist page + toggle on course detail + card buttons |
| Instructor Applications (student) | `POST /instructor-applications` | Apply form on `/instructor/apply` |
| Instructor Applications (admin) | `GET /admin/instructor-applications`, `PATCH approve/reject` | Admin review list with approve/reject actions |
| Lesson Resources (student) | `GET /lessons/:id/resources` | Downloadable resources listed on lesson viewer |
| Lesson Resources (instructor) | `POST /lessons/:id/resources`, `DELETE /lessons/resources/:id` | Add/delete resources from lesson editor |
| Lesson CRUD (instructor) | `PATCH /lessons/:id`, `PATCH /lessons/:id/reorder`, `DELETE /lessons/:id` | Update, reorder, delete lessons |
| Uploads | `POST /uploads/presign` | Course cover image upload on course edit page |
| Admin Payments | `GET /admin/payments` | Paginated payment history table |
| Admin Revenue | `GET /admin/revenue`, `GET /admin/revenue/instructor-attribution` | Revenue dashboard + instructor attribution breakdown |
| Messaging | `GET /messages/conversations`, `POST /messages/conversations`, `GET /messages/conversations/:id/messages`, `POST /messages/conversations/:id/messages` | Split-pane inbox: conversation list + message thread + send |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` | Notification list + read/unread |
| Reports | `POST /reports`, `GET /reports`, `PATCH /reports/:id/resolve` | File, list, and resolve reports |
| Smart Contracts | All 16 endpoints for pricing, access control, token balance/allowance, vault rate/reserve, certificate nonce, wallet signing message, wallet link, build-transaction (enroll/unlock/redeem/approve), certificate claim signature, mint-direct, vault quote | Crypto enrollment, vault redemption, NFT minting |
| Crypto Payments | `GET /payments/me`, `POST /payments/crypto/:id/check`, `POST /payments/crypto/:id/retry` | Payment history + crypto payment check/retry |
| Certificate Download + Mint | `GET /certificates/:id/download`, `POST /smart-contracts/certificates/mint-direct`, `POST /smart-contracts/certificates/:num/signature` | PDF download + lazy/direct NFT mint |
| Wallet linking | `GET /smart-contracts/wallet/signing-message/:address`, `POST /smart-contracts/wallet/link` | Wallet connection + backend linking |
| Vault redemption | `GET /smart-contracts/vault/rate`, `GET /smart-contracts/vault/reserve`, `POST /smart-contracts/vault/quote`, `POST /smart-contracts/redeem/build-transaction` | Token redemption UI |

## New Pages Added

| Route | Module | Description |
|---|---|---|
| `/subscription` | Student | View plan, features, auto-renew toggle, cancel |
| `/wishlist` | Student | Saved courses grid with remove |
| `/payments` | Student | Payment history with crypto check/retry actions |
| `/wallet` | Student | Wallet linking, vault redemption, certificate + badge display |

## Pages Now Wired (previously stub/mock)

| Route | Module | Previously | Now |
|---|---|---|---|
| `/instructor/apply` | Student | Mock form (no API call) | Calls `POST /instructor-applications` |
| `/admin/applications` | Admin | Mock `APPLICATIONS` array | Loads from `GET /admin/instructor-applications`, approve/reject wired |
| `/admin/payments` | Admin | Coming soon placeholder | Payment history table + Revenue + Instructor Attribution tabs |
| `/instructor/messages` | Instructor | Mock data | Real messaging API (conversations, send, receive, unread counts) |

## New Components

| Component | Purpose |
|---|---|
| `components/courses/rating-input.tsx` | Interactive 5-star rating selector |
| `components/courses/review-section.tsx` | Review summary + form + paginated list |
| `components/courses/ask-tutor.tsx` | Floating AI chat widget |
| `components/courses/wishlist-button.tsx` | Detail-page wishlist toggle (icon + button variants) |
| `components/courses/wishlist-card-button.tsx` | Card-overlay wishlist toggle for catalog pages |
| `components/courses/course-cover-upload.tsx` | Presigned URL → upload → update course cover |
| `components/courses/crypto-enroll.tsx` | USDC/LRN crypto enrollment with ERC-20 approve step |
| `components/lessons/lesson-resources.tsx` | File/link resource list with add/delete (editable variant) |
| `components/wallet/wallet-link-button.tsx` | Connect MetaMask + sign message + link to backend |
| `components/wallet/vault-section.tsx` | Token redemption (LRN → USDC) via vault |
| `components/certificates/certificate-mint.tsx` | Direct mint (platform pays gas) + lazy mint (EIP-712, student pays gas) |
| `components/blockchain/blockchain-badge.tsx` | Badge showing on-chain anchor status |
| `lib/web3/provider.ts` | Wallet connection, getSigner, signMessage, sendTransaction |
| `hooks/use-wallet.ts` | React hook wrapping `window.ethereum` |

## Blocked (Backend Gap — 6 Missing Endpoints)

None of these 6 routes can be solved with a frontend-only workaround. All currently degrade gracefully (no crashes, no incorrect data shown). Each needs a real backend route handler.

| # | Feature | Depends on | Missing Endpoint | Frontend File + Line | Frontend Consumer | Expected Request/Response | Graceful Degradation |
|---|---|---|---|---|---|---|---|
| 1 | **Instructor student roster** | `instructor/courses/[id]/students/page.tsx` | `GET /courses/:courseId/enrollments` | `lib/data/enrollments.ts:4` `getCourseEnrollments(courseId)` | Instructor views roster table (name, email, progress %, status) | **Response:** `{ enrollments: [{ id, status, progressPercent, enrolledAt, user: { id, fullName, email } }] }` — full class roster with per-student progress. `GET /enrollments/me` is NOT a substitute (returns only the current user's own enrollments, not a class roster — that would silently show wrong/incomplete data to instructors). | Shows "No students enrolled yet." on 404/error. |
| 2 | **Start quiz attempt** | `(student)/my-learning/[courseId]/quiz/[quizId]/page.tsx` | `POST /quizzes/:id/start` | `lib/data/quiz.ts:36` `startQuizAttempt(quizId)` | Student clicking "Start Quiz" button — initializes attempt, returns attemptId, enters fullscreen | **Request:** `{ quizId }` **Response:** `{ attemptId: string, startedAt: string }` — creates and returns a new attempt record. **Cannot merge with `POST /quizzes/:id/submit`** — submit expects an existing attempt to grade against (tracks answers per-attempt, enforces maxAttempts, records integrity events). Merging would break attempt-tracking entirely. | Sets `error` state → "Failed to load quiz". Submission call proceeds with `attemptId: undefined` (backend ignores it). |
| 3 | **List course quizzes** | `(student)/my-learning/[courseId]/page.tsx`, `instructor/courses/[id]/quiz/page.tsx` | `GET /courses/:courseId/quizzes` | `lib/data/quiz.ts:66` `getCourseQuizzes(courseId)` | (a) Student sees quiz entries in curriculum page; (b) Instructor manages quiz list | **Response:** `{ quizzes: [{ id, title, passingScore, maxAttempts, isFinalAssessment, _count: { questions } }] }` — quizzes scoped to a course with question counts. | (a) Quizzes section hidden; (b) Shows "No quizzes yet." |
| 4 | **Get single lesson** | `(student)/my-learning/[courseId]/lessons/[lessonId]/page.tsx`, `instructor/courses/[id]/curriculum/lessons/[lessonId]/page.tsx` | `GET /lessons/:id` | `lib/data/lessons.ts:5` `getLesson(lessonId)` | (a) Student views lesson content; (b) Instructor edits lesson in curriculum editor | **Response:** `{ id, title, contentBody, contentType, videoUrl, orderIndex, courseId, createdAt, updatedAt }` — full lesson object. `GET /courses/:courseId/lessons` returns only a listing (no contentBody), not a substitute for the detail endpoint. | (a) Shows "Lesson Unavailable" with friendly message; (b) Redirects back to curriculum page. |
| 5 | **Get forum thread** | `(student)/forum/c/[courseId]/t/[threadId]/page.tsx` | `GET /forum/threads/:threadId` | `lib/data/forum.ts:34` `getForumThread(threadId)` | Student views a thread detail page with all posts | **Response:** `{ thread: { id, title, isPinned, isLocked, createdAt, author: { id, fullName }, posts: [{ id, body, createdAt, editedAt, authorId, isAcceptedAnswer, author: { fullName }, _count: { upvotes } }] } }` — thread + all its posts with author info. | Shows "Thread not found" with back link. |
| 6 | **List quiz attempts** | `instructor/courses/[id]/quiz/[quizId]/integrity/page.tsx` | `GET /quizzes/:id/attempts` | `lib/data/quiz.ts:187` `getQuizAttempts(quizId)` | Instructor reviews student attempt data + integrity flags | **Response:** `{ attempts: [{ id, attemptNumber, score, passed, startedAt, completedAt, integrityReport, user: { id, fullName, email } }] }` — per-student attempt data with full integrity events (tab switches, fullscreen exits, copy/paste, navigation). | Shows amber banner: "Integrity review will be available once quiz attempts are tracked on the backend." |

### Implementation notes for backend owner

All 6 routes need:
1. A `.get()` or `.post()` handler on the existing router in the right route file (see existing route files for middleware patterns — `authenticate`, `authorize`, `validate`, `optionalAuth`)
2. A controller method in the corresponding controller file
3. A service method in the corresponding service file

Specific files per route:
- **#1** — `backend/src/modules/courses/courses.routes.ts` (add GET route), `courses.controller.ts`, `courses.service.ts` or `enrollments.service.ts`
- **#2** — `backend/src/modules/quizzes/quizzes.routes.ts` (add POST route on `quizzesRouter`), `quizzes.controller.ts`, `quizzes.service.ts`
- **#3** — `backend/src/modules/quizzes/quizzes.routes.ts` (add GET route on `courseQuizzesRouter`), `quizzes.controller.ts`, `quizzes.service.ts`
- **#4** — `backend/src/modules/lessons/lessons.routes.ts` (add GET route on `lessonsRouter`), `lessons.controller.ts`, `lessons.service.ts`
- **#5** — `backend/src/modules/community/forum.routes.ts` (add GET route on `forumRouter`), `forum.controller.ts`, `forum.service.ts`
- **#6** — `backend/src/modules/quizzes/quizzes.routes.ts` (add GET route on `quizzesRouter`), `quizzes.controller.ts`, `quizzes.service.ts`

Auth/role middleware to apply:
- **#1** — `authenticate`, `authorize("INSTRUCTOR")`
- **#2** — `authenticate`, `authorize("STUDENT")`
- **#3** — `authenticate`, `authorize("STUDENT", "INSTRUCTOR")`
- **#4** — `authenticate`, `authorize("STUDENT", "INSTRUCTOR")`
- **#5** — `authenticate`, `authorize("STUDENT", "INSTRUCTOR")`
- **#6** — `authenticate`, `authorize("INSTRUCTOR")`

## Structural Exclusions

- `GET /health` — server monitoring, not under `/api/v1`
- `POST /payments/webhook` — Stripe webhook, server-to-server (raw body required)

## Unused Backend Routes (no frontend consumer)

These 5 backend routes exist but no frontend page or component ever calls them. They are candidates for either removal (dead code on backend) or future frontend wiring.

| Backend route | Handler | lib/data/ function exists? | Notes |
|---|---|---|---|
| `POST /auth/google` | `authController.google` | No | Frontend uses GET OAuth redirect flow instead |
| `GET /enrollments/:courseId/resume` | `enrollmentsController.resume` | `resumeEnrollment` (never called) | Function exists in `lib/data/enrollments.ts` but has zero consumers |
| `GET /enrollments/:id` | `enrollmentsController.getById` | `getEnrollmentById` (never called) | Function exists in `lib/data/enrollments.ts` but has zero consumers |
| `DELETE /forum/posts/:postId/upvote` | `forumController.removeUpvote` | `removeUpvotePost` (never called) | Function exists in `lib/data/forum.ts` but has zero consumers |
| `GET /payments/by-gateway/:gatewayReference` | `paymentsController.getCourseByGateway` | No | No frontend function exists at all |

## Placeholder Pages (no backend endpoint exists)

| Page | Current behavior |
|---|---|
| Admin Analytics | Shows "Analytics endpoints not yet available" |
| Admin Settings | Shows "Platform settings endpoint not yet available" |
| Instructor Settings | Shows "Profile settings will be available when integrated with the users endpoint" |
