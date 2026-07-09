# API Migration Status

> **Last merge update (2026-07-08):** Backend `main` now includes Google OAuth (`feat/google-oauth`) and smart-contract certificate anchoring (`features/smart-contract`). Messaging and subscription modules removed from backend. API response shape (`{ success: true, data: T }`) confirmed compatible — no breaking changes to existing wired endpoints.

## Wired (API Connected)
| Page/Module | Endpoint | Notes |
|---|---|---|
| Auth (sign-in, sign-up) | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/google` | Full auth flow with JWT, persisted refresh. Google OAuth available but no frontend button yet. |
| Course catalog (`/courses`) | `GET /courses` | `BackendCourseCard` renders backend schema |
| Course detail (`/courses/[slug]`) | `GET /courses/:id`, `GET /courses/:id/lessons` | Enroll button calls `POST /courses/:id/enroll` |
| My Learning curriculum (`/my-learning/[courseId]`) | `GET /courses/:id/lessons`, `POST /lessons/:id/complete` | Lesson completion wired; quiz data still mock |
| Wallet (`/wallet`, `/wallet/[userId]`) | `GET /wallet/me`, `GET /wallet/:publicUrl` | |
| Verify certificate (`/verify/[id]`) | `GET /verify/:certificateId` | |
| Quiz submit | `POST /quizzes/:id/submit` | Questions are mock; only submit action wired |
| My Courses (instructor) | `GET /courses/mine` | Fallback to mock on error |
| Admin users | `GET /admin/users` | Fallback to mock on error |
| Admin courses | `GET /courses` (via `getAdminCourses`) | Fallback to mock on error |
| Edit course (instructor) | `GET /courses/:id` | Fallback to not-found |

## Still Using Mock Data (no API available)
| Page/Module | Values | Reason |
|---|---|---|
| Admin dashboard (`/admin`) | `ADMIN_STATS`, `RECENT_ACTIVITY` | `GET /admin/dashboard` may be stub |
| Admin analytics (`/admin/analytics`) | `TOP_INSTRUCTORS` | No analytics endpoint |
| Instructor dashboard (`/instructor`) | `INSTRUCTOR_STATS`, `COURSE_PERFORMANCE`, `RECENT_REVIEWS`, `PENDING_TASKS` | No instructor dashboard endpoint |
| My Learning dashboard (`/my-learning`) | `STUDENT_STATS`, `UPCOMING_DEADLINES`, `LEARNING_STREAK` | No stats/deadlines/streak endpoints |
| Student certificates (`/certificates`) | `ALL_CERTIFICATES` | `GET /certificates` does not exist |
| Admin certificates (`/admin/certificates`) | `ALL_CERTIFICATES` | `GET /admin/certificates` does not exist |
| Quiz questions (`/my-learning/[id]/quiz/[id]`) | `QUIZ_DATA` (inline) | `GET /quizzes/:id` does not exist |

## Blocked (Backend Gap)
| Feature | Missing Endpoint | Workaround |
|---|---|---|
| Quiz question display | `GET /quizzes/:id` | Inline hardcoded data |
| User certificates list | `GET /certificates` or `GET /certificates/mine` | Mock data |
| Instructor dashboard stats | `GET /instructor/dashboard` | Mock data |
| Student learning streak | Learning streak/activity endpoint | Mock data |
| Admin analytics | Analytics endpoints | Chart placeholders + mock |
| Instructor application review system | `GET /admin/applications` flow | Static page |
| Notifications | `GET /notifications` | Data module exists, no page wired |
| Forum | Forum endpoints | Static pages |
| Messages | Messaging endpoints | **Backend module removed** — `/messages` page will 404 on fetch |
| Subscriptions | `GET /subscriptions` | **Backend module removed** — data module still exists but no endpoint |
