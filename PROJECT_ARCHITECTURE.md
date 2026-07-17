**Project Architecture — Online Lecture Scheduling Module**

This document summarizes the data model, roles, auth and approval flows, lecture scheduling rules, important business rules, and the public API endpoints implemented in this repository.

**Database Relationships**
- **User**: central authentication record. See [backend/models/User.js](backend/models/User.js).
- **Instructor**: profile referencing `User` via `userId` (one-to-one). See [backend/models/Instructor.js](backend/models/Instructor.js).
- **Student**: separate collection with `courseId` referencing `Course` (many students -> one course). See [backend/models/Student.js](backend/models/Student.js).
- **Course**: master data for courses; one course -> many lectures. See [backend/models/Course.js](backend/models/Course.js).
- **Lecture**: references `courseId` and optionally `instructorId`. One lecture -> one course; one instructor -> many lectures. See [backend/models/lecture.js](backend/models/lecture.js).

Notes:
- `Instructor.userId` is a reference to `User._id` (profile linking).
- `Student.courseId` and `Lecture.courseId` reference `Course._id`.
- `Lecture.instructorId` references `Instructor._id` and an index enforces uniqueness on `{ instructorId, date }` (see model).

**Roles**
- **admin**: full management — create/update/delete courses, create/update/delete lectures, manage instructors.
- **instructor**: view assigned lectures, update own instructor profile, can be assigned to lectures.
- **student**: attendee role (limited in current backend; student data stored separately).
- **pendingInstructor**: default candidate role when applying to be an instructor.
- **rejectedInstructor**: candidate explicitly rejected.

Role definitions are persisted on the `User.role` field. See [backend/models/User.js](backend/models/User.js).

**Auth Flow**
- Users register via `/api/auth/register` (creates a `User` and — if role indicates instructor — attempts to create an `Instructor` profile).
- Users login via `/api/auth/login` and receive a JWT token (signed with `process.env.JWT_SECRET`).
- Protected endpoints require header `Authorization: Bearer <token>`; `protect` middleware decodes the token and sets `req.user`.
- `restrictTo(...)` middleware enforces role-based access to routes.

See implementation in [backend/routes/auth.routes.js](backend/routes/auth.routes.js) and [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js).

**Instructor Approval Flow (intended)**
- Candidate applies by registering (role set to `pendingInstructor`).
- Admin reviews applications and approves by creating an `Instructor` profile linked to `User._id` and updating `User.role` to `instructor`.
- If rejected, `User.role` is set to `rejectedInstructor`.

Controller helpers for approve/reject exist in [backend/controller/instructorController.js](backend/controller/instructorController.js) (approve/reject logic), though the public admin endpoints for approve/reject may require routing additions if not exposed.

**Lecture Scheduling Flow**
- Admin creates a lecture (POST). A lecture can be created without an `instructorId` → status becomes `Pending`.
- If `instructorId` is provided, the controller validates the instructor exists and requires `date`, `startTime`, `endTime` and sets status to `Scheduled`.
- When assigning or updating an instructor for a lecture, the system checks time overlaps for that instructor on the same date; overlapping time ranges are rejected.
- `startTime` must be before `endTime`.
- `getMyLectures` returns lectures for the instructor profile associated with the authenticated user.

Key implementation details: lecture conflict checks and scheduling rules are in [backend/controller/lectureController.js](backend/controller/lectureController.js). The `lecture` schema also has a unique index on `{ instructorId, date }` (see [backend/models/lecture.js](backend/models/lecture.js)), which enforces one lecture per instructor per date at the DB index level — business logic handles intra-day time-slot conflicts.

**Important Business Rules**
- Only `admin` users may create/update/delete courses and create/delete/assign lectures (per route restrictions).
- A course cannot be deleted if it has lectures assigned (controller checks and refuses deletion).
- An instructor cannot be deleted while they have lectures assigned — lectures must be reassigned or deleted first.
- Lecture time validation: `startTime < endTime`; assignments must not overlap existing instructor lectures for the same date.
- Lecture `status` is `Scheduled` when an `instructorId` is present; otherwise `Pending`.
- Protected endpoints require a valid, active `User` (middleware checks `user.isActive`).

**API Endpoints (by prefix)**
Base path prefixes are defined in [backend/server.js](backend/server.js):
- `/api/auth`
- `/api/courses`
- `/api/lectures`
- `/api/instructors`

Auth (`/api/auth`)
- POST `/api/auth/register` — register a new user (public).
- POST `/api/auth/login` — login (public) -> returns JWT.
- POST `/api/auth/logout` — logout (protected).

Courses (`/api/courses`)
- GET `/api/courses/` — list all courses (protected).
- POST `/api/courses/` — create course (protected, restrictTo: admin). Validated by `validateCourse`.
- GET `/api/courses/:id` — get course by id (protected).
- PATCH `/api/courses/:id` — update course (protected, restrictTo: admin). Validated by `validateCourse`.
- DELETE `/api/courses/:id` — delete course (protected, restrictTo: admin). Fails if lectures exist for the course.

Instructors (`/api/instructors`)
- GET `/api/instructors/` — list instructors (protected).
- POST `/api/instructors/` — create instructor (protected, restrictTo: admin). Validated by `validatorInstructor`.
- DELETE `/api/instructors/:id` — delete instructor (protected, restrictTo: admin). Fails if instructor has assigned lectures.
- GET `/api/instructors/:id/details` — instructor details + lectures (protected).
- PATCH `/api/instructors/:id` — update instructor (protected, restrictTo: admin, instructor) — instructors may update own profile.

Lectures (`/api/lectures`)
- GET `/api/lectures/` — list all lectures (protected).
- POST `/api/lectures/` — create lecture (protected, restrictTo: admin). Validated by `validateLecture`. If `instructorId` present, `date`, `startTime`, `endTime` are required and scheduling conflict checks run.
- GET `/api/lectures/my-lectures` — list lectures for current instructor (protected, restrictTo: admin, instructor).
- GET `/api/lectures/:id` — get lecture by id (protected).
- PATCH `/api/lectures/:id` — update lecture (protected, restrictTo: admin). Assigning/changing instructor enforces conflict checks and requires date/time.
- DELETE `/api/lectures/:id` — delete lecture (protected, restrictTo: admin).

**Notes / Implementation Gaps**
- Some controller functions (approve/reject instructor) exist but are not currently exposed via route endpoints — consider adding admin routes like POST `/api/instructors/approve` and POST `/api/instructors/reject` that call these controllers.
- There are minor model/controller inconsistencies (e.g., some controllers reference `Instructor` fields such as `email`/`password` while the `Instructor` model stores `userId`). Review and align models/controllers if you plan to extend functionality.

If you want, I can:
- add the missing admin approve/reject instructor routes,
- or generate a simplified sequence diagram for the auth/approval/scheduling flows.
