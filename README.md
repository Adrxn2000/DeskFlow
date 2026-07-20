# DeskFlow Internal IT Service Request Portal

Ticketing system where Employees submit IT tickets and Admins triage and resolve them.

Stack: React (Vite) · Node.js/Express · PostgreSQL (Neon) + Prisma · Postman for API testing.

## Backend setup
```bash
cd backend
npm install
cp .env.example .env   # fill in your own PostgreSQL connection string + JWT secret
npx prisma migrate dev --name init
npm run seed
npm run dev
```
Runs at `http://localhost:5000`.

Seeded logins:
| Role     | Email                  | Password    |
|----------|-------------------------|-------------|
| Employee | employee@deskflow.com   | password123 |
| Admin    | admin@deskflow.com      | password123 |

## Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Log in with the seeded credentials above.

## API testing
Import `DeskFlow.postman_collection.json` into Postman. Run "Login - Employee" and "Login - Admin" first — tokens auto-save for every other request.

## Endpoints
| Method | Route | Access | Notes |
|---|---|---|---|
| POST | /api/auth/login | Public | Returns JWT + role |
| POST | /api/tickets | Employee only | Create a ticket |
| GET | /api/tickets | Employee/Admin | Employees see own only; Admins see all |
| PUT | /api/tickets/:id | Admin only | Update status |

## Live Demo
- Frontend: https://deskflowportal.netlify.app
- Backend API: https://deskflow-backend-kojt.onrender.com
- Swagger docs: https://deskflow-backend-kojt.onrender.com/api-docs

Note: the backend is on Render's free tier and spins down after inactivity — the first request may take 30-60 seconds to wake up.
