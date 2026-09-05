# GEMINI.md - Project Mandates: LOVETRAE

This file defines the foundational mandates and standards for Gemini CLI's behavior in the LOVETRAE workspace.

## 1. Project-Specific Tech Stack
- **Frontend/Mobile:** React Native (Expo) with TypeScript, React Navigation, and Tailwind CSS.
- **Backend:** Python (FastAPI) using Uvicorn as the ASGI server.
- **Database & Services:** Firebase (Authentication, Firestore, Hosting, Cloud Functions).
- **Tooling:** npm (frontend), pip/venv (backend), Redis (caching/rate-limiting), Jest (JS tests), Pytest (Python tests).

## 2. Coding Style & Conventions
- **General:**
    - Adhere to the existing monorepo structure: `app/` for the Expo application and `backend/` for the FastAPI service.
    - Use strict TypeScript types and Pydantic models for data validation.
- **Frontend (`app/`):**
    - **Components:** Prefer functional components with Hooks.
    - **Naming:** PascalCase for component files and names; camelCase for variables, props, and functions.
    - **Styling:** Use Tailwind CSS for layouts and the centralized theme in `src/theme` for consistent UI elements.
- **Backend (`backend/`):**
    - **Standards:** Follow PEP 8 guidelines.
    - **Documentation:** Include docstrings for all modules, classes, and public functions.
    - **API Design:** Use FastAPI's dependency injection and Pydantic models for request/response schemas.

## 3. Testing Requirements
- **Mandate:** No feature is complete without accompanying tests.
- **Frontend:**
    - Use **Jest** for unit and component testing (located in `__tests__` directories).
    - Use **Cypress** for end-to-end (E2E) testing.
- **Backend:**
    - Use **Pytest** for testing endpoints and business logic.
- **Validation:** Always run existing tests before and after making changes to ensure zero regressions.

## 4. Security Protocols
- **Authentication:** Use JWT-based authentication (HS256) integrated with Firebase Auth.
- **Rate Limiting:** Implement and respect Redis-based rate limiting for sensitive endpoints.
- **Input Validation:** Rigorously validate all incoming data using Pydantic (backend) and Zod/TypeScript (frontend).
- **Secrets:** Never hardcode credentials. Use environment variables (.env) and secure secret management.
- **Headers:** Ensure strict security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) are maintained.
- **CORS:** Only allow authorized origins defined in the production configuration.
