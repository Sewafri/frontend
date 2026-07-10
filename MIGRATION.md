# API Migration Status

> **Last update (2026-07-10):** All Priority 1–3 modules wired. Part 1 fixed 2 path/method mismatches. Part 2 added frontend UI for 9 previously backend-only modules (ratings & reviews, AI tutor, subscriptions, wishlist, instructor applications, lesson resources, uploads, admin revenue/payments, messaging). Previous gaps (quiz start, quiz attempts, lesson by ID) remain blocked server-side.

## ⚠️ Security Note — `isCorrect` on Answer Options

> **Verified: properly role-gated.** `GET /quizzes/:id` returns `isCorrect` only for INSTRUCTOR/ADMIN roles. The service (`stripQuestionMeta(quiz, hideCorrect)`) explicitly destructures `isCorrect` out of answer options for STUDENT requests before responding. The role check happens at two layers: the `authorize` middleware (gate before controller) and the `getQuizById` service method (role-based `hideCorrect` flag). No route a student can reach ever returns correct-answer data before submission. `POST /quizzes/:id/submit` also never returns answer options in its response — only score/pass metadata. The `isCorrect` field is secure.

## Wired (API Connected)
| Page/Module | Endpoint | Notes |
|---|---|---|
| Auth (sign-in, sign-up) | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/google` | Full auth flow with JWT, persisted refresh. Google OAuth available but no frontend button yet. |
| Course catalog (`/courses`) | `GET /courses` | `BackendCourseCard` renders backend schema |
| Course detail (`/courses/[slug]`) | `GET /courses/:id`, `GET /courses/:id/lessons`, `GET /courses/:id/ratings/summary` | Enroll, wishlist toggle, rating display, review section (write + list) |
| My Learning curriculum (`/my-learning/[courseId]`) | `GET /courses/:id/lessons`, `POST /lessons/:id/complete` | Lesson completion wired; AI tutor floating chat |
| Wallet (`/wallet`, `/wallet/[userId]`) | `GET /wallet/me`, `GET /wallet/:publicUrl` | |
| Verify certificate (`/verify/[id]`) | `GET /verify/:certificateId` | |
| Quiz questions + instructor management | `GET /quizzes/:id` | Returns `isCorrect` for instructors; stripped for students. `getQuizManage` uses this endpoint (previously called `/manage` alias which didn't exist — frontend path fixed). |
| Quiz submit | `POST /quizzes/:id/submit` | Grading + attempt creation |
| My Courses (instructor) | `GET /courses/mine` | Fallback to mock on error |
| Admin users | `GET /admin/users` | Fallback to mock on error |
| Admin courses | `GET /courses` (via `getAdminCourses`) | Fallback to mock on error |
| Edit course (instructor) | `GET /courses/:id` | Fallback to not-found |
| My Enrollments | `GET /enrollments/me` | Path fixed from `/enrollments` to `/enrollments/me` |
| Forum upvote | `PUT /forum/posts/:id/upvote` | Method fixed from POST to PUT |
| Ratings & Reviews | `GET /courses/:id/ratings/*`, `GET /courses/:id/reviews/*`, `POST /courses/:id/reviews`, `DELETE /courses/:id/reviews/mine` | Rating input + review form + list on course detail page |
| AI Course Tutor | `POST /courses/:id/ask` | Floating chat UI on learning page |
| Subscription management | `GET /subscriptions/me`, `PATCH /subscriptions/me/renew`, `POST /subscriptions/:id/cancel` | Full subscription page at `/subscription` |
| Wishlist | `GET /wishlist/me`, `POST /wishlist/:courseId`, `DELETE /wishlist/:courseId` | Wishlist page + toggle on course detail + card buttons |
| Instructor Applications (student) | `POST /instructor-applications` | Apply form on `/instructor/apply` |
| Instructor Applications (admin) | `GET /admin/instructor-applications`, `PATCH approve/reject` | Admin review list with approve/reject actions |
| Lesson Resources (student) | `GET /lessons/:id/resources` | Downloadable resources listed on lesson viewer |
| Lesson Resources (instructor) | `POST /lessons/:id/resources`, `DELETE /lessons/resources/:id` | Add/delete resources from lesson editor |
| Uploads | `POST /uploads/presign` | Course cover image upload on course edit page |
| Admin Payments | `GET /admin/payments` | Paginated payment history table |
| Admin Revenue | `GET /admin/revenue`, `GET /admin/revenue/instructor-attribution` | Revenue dashboard + instructor attribution breakdown |
| Messaging | `GET /messages/conversations`, `POST /messages/conversations`, `GET /messages/conversations/:id/messages`, `POST /messages/conversations/:id/messages` | Split-pane inbox: conversation list + message thread + send |

## New Pages Added
| Route | Module | Description |
|---|---|---|
| `/subscription` | Student | View plan, features, auto-renew toggle, cancel |
| `/wishlist` | Student | Saved courses grid with remove |

## Pages Now Wired (previously stub/mock)
| Route | Module | Previously | Now |
|---|---|---|---|
| `/instructor/apply` | Student | Mock form (no API call) | Calls `POST /instructor-applications` |
| `/admin/applications` | Admin | Mock `APPLICATIONS` array | Loads from `GET /admin/instructor-applications`, approve/reject wired |
| `/admin/payments` | Admin | Coming soon placeholder | Payment history table + Revenue + Instructor Attribution tabs |

## New Components
| Component | Purpose |
|---|---|
| `components/courses/rating-input.tsx` | Interactive 5-star rating selector |
| `components/courses/review-section.tsx` | Review summary + form + paginated list |
| `components/courses/ask-tutor.tsx` | Floating AI chat widget |
| `components/courses/wishlist-button.tsx` | Detail-page wishlist toggle (icon + button variants) |
| `components/courses/wishlist-card-button.tsx` | Card-overlay wishlist toggle for catalog pages |
| `components/courses/course-cover-upload.tsx` | Presigned URL → upload → update course cover |
| `components/lessons/lesson-resources.tsx` | File/link resource list with add/delete (editable variant) |

## Still Using Mock Data (no API available)
| Page/Module | Values | Reason |
|---|---|---|
| Admin dashboard (`/admin`) | `ADMIN_STATS`, `RECENT_ACTIVITY` | `GET /admin/dashboard` may be stub |
| Admin analytics (`/admin/analytics`) | `TOP_INSTRUCTORS` | No analytics endpoint |
| Instructor dashboard (`/instructor`) | `INSTRUCTOR_STATS`, `COURSE_PERFORMANCE`, `RECENT_REVIEWS`, `PENDING_TASKS` | No instructor dashboard endpoint |
| My Learning dashboard (`/my-learning`) | `STUDENT_STATS`, `UPCOMING_DEADLINES`, `LEARNING_STREAK` | No stats/deadlines/streak endpoints |
| Student certificates (`/certificates`) | `ALL_CERTIFICATES` | `GET /certificates` does not exist |
| Admin certificates (`/admin/certificates`) | `ALL_CERTIFICATES` | `GET /admin/certificates` does not exist |

## Blocked (Backend Gap)
| Feature | Missing Endpoint | Workaround |
|---|---|---|
| Quiz attempt start (student) | `POST /quizzes/:id/start` | 404 silently handled — quiz flows without `attemptId` (submit creates its own). Friendly console warning. |
| Quiz integrity review (instructor) | `GET /quizzes/:id/attempts` | 404 shows amber "coming soon" message instead of error banner |
| Lesson content viewer (student) | `GET /lessons/:id` | 404 shows "Lesson Unavailable" with helpful note; lesson page core content cannot load without this route. **Highest-priority gap — breaks every lesson.** |
| Lesson content editor (instructor) | `GET /lessons/:id` | 404 redirects to curriculum page |
| User certificates list | `GET /certificates` or `GET /certificates/mine` | Mock data |
| Instructor dashboard stats | `GET /instructor/dashboard` | Mock data |
| Student learning streak | Learning streak/activity endpoint | Mock data |
| Admin analytics | Analytics endpoints | Chart placeholders + mock |
| Notifications | `GET /notifications` | Data module exists, no page wired |
| Forum | Forum endpoints | Static pages |

## Remaining Backend-Only Routes (no frontend consumer)
- `GET /notifications`, `PATCH /notifications/:id/read`
- `GET /courses/:id/ratings/mine` (DELETE also exists)
- `GET /courses/:id/reviews/mine` (DELETE also exists)
