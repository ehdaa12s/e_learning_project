# Clean Architecture Overview

This project applies a services-first architecture. Page scripts focus on UI and delegate data and side effects to domain services.

## Principles
- Keep UI scripts thin: render and wire events only.
- Encapsulate Firestore and external APIs inside services.
- Favor small, clear service methods with stable interfaces.
- Centralize cross-cutting concerns (auth, errors, environment).

## Services
- `js/services/courseService.js`: Fetch courses (`getAll`, `getById`).
- `js/services/playlistService.js`: Manage course modules (`listModules`, `addModule`, `deleteModule`).
- `js/services/userService.js`: List students; future user ops.
- `js/services/categoryService.js`: Fetch categories.
- `js/enrollement.js`: Enrollment operations (`enroll`, `isEnrolled`, `getCoursesByUser`).
- `js/services/paymentService.js`: Record payments in Firestore.

## Firebase
- Initialize in `js/firebase.js` and export `db`.
- Services import `db` and Firestore functions; UI never touches Firestore directly.

## PayPal
- Provide `client_id` via `.env` and load in `js/payment.js`.
- Do not expose or rely on REST `access_token` in the browser.

## Refactoring Plan
- Gradually replace direct Firestore calls in page scripts with service calls.
- Keep services page-agnostic; return plain data structures.
- Add tests for services where feasible.