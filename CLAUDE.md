# Slotly

Slotly is a booking and business-management platform for solo professionals,
salons, teams, and multi-location service businesses.

## Stack

- Backend: Node.js, Express 5, PostgreSQL
- Frontend: React, TypeScript, Tailwind CSS
- Authentication: JWT, bcrypt

## Architecture

The backend should grow as a modular monolith organized by business domain.

Business modules will live under:

`backend/src/modules/<domain>/`

Typical module flow:

```text
Route
→ Controller
→ Service
→ Repository
→ PostgreSQL
```
