# DeskFlow Test Plan

## 1. Scope
Automated testing of the DeskFlow REST API (Node/Express, Prisma, JWT). The React frontend is covered by manual smoke tests only (section 7).

## 2. Strategy
| Level | Tool | What it covers |
|---|---|---|
| Unit | Jest | auth middleware (`authenticate`, `authorize`) in isolation |
| Integration | Jest + Supertest | every HTTP route through the real Express app |
| Manual | Browser | login, dashboards, status change, dark mode |

Prisma is mocked with `jest.mock`, so tests run without a database. This keeps them fast and lets CI (Day 7) run with no Postgres service.

## 3. Environment
- Node 20, Jest, Supertest
- `JWT_SECRET` set to a test value in the Jest setup
- Command: `npm test` and `npm test -- --coverage`

## 4. Test cases
| ID | Area | Scenario | Expected |
|---|---|---|---|
| AUTH-01 | Register | Valid name, email, password | 201, token, role EMPLOYEE |
| AUTH-02 | Register | Body contains `role: "ADMIN"` | 201, role is still EMPLOYEE |
| AUTH-03 | Register | Missing a required field | 400 |
| AUTH-04 | Register | Password under 6 characters | 400 |
| AUTH-05 | Register | Email already registered | 400 |
| AUTH-06 | Login | Valid credentials | 200, token, user payload |
| AUTH-07 | Login | Wrong password | 401 |
| AUTH-08 | Login | Unknown email | 401 |
| AUTH-09 | Login | Missing email or password | 400 |
| TKT-01 | Tickets | Any route with no token | 401 |
| TKT-02 | Tickets | Malformed or expired token | 401 |
| TKT-03 | Create | Employee, valid body | 201 |
| TKT-04 | Create | Missing title, description or priority | 400 |
| TKT-05 | Create | Admin token | 403 |
| TKT-06 | List | Employee token | Only own tickets returned |
| TKT-07 | List | Admin token | All tickets returned |
| TKT-08 | Update | Admin, valid status | 200, status changed |
| TKT-09 | Update | Employee token | 403 |
| TKT-10 | Update | Ticket id does not exist | 404 |
| TKT-11 | Update | Non-numeric id | 400 |
| TKT-12 | Update | Missing status | 400 |
| TKT-13 | Update | Invalid status value | 400 |
| TKT-14 | Create | Invalid priority value | 400 |
| SYS-01 | Health | GET /api/health | 200, status ok |
| SYS-02 | Routing | Unknown route | 404 |

## 5. Known defects (to fix test-first on Days 3 and 4)
- TKT-13 and TKT-14: invalid `status` or `priority` values reach Prisma and return 500 instead of 400. Fix: validate against the enum lists before the query.

## 6. Entry and exit criteria
- Entry: API starts, Prisma schema generated, dependencies installed.
- Exit: all cases above pass, line coverage of 70% or more on `src/controllers` and `src/middleware`, lint and build green.

## 7. Manual smoke tests (frontend)
1. Employee logs in, creates a ticket, sees it in the list.
2. Admin logs in, sees all tickets, changes a status.
3. Employee sees the updated status.
4. Employee cannot open `/admin`; Admin cannot open `/dashboard`.
5. Dark and light mode both keep input text readable.