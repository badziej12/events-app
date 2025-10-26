# Events App Documentation

## Project Overview

Simple events app with:

- **Backend:** Express API storing events in a local JSON file (`backend/events.json`).
- **Frontend:** React app (Create React App) using React Router v6+ loaders/actions to fetch and mutate events.

Backend listens on port 8080. Frontend runs with CRA (default port 3000).

## Prerequisites

- Node.js and npm installed (macOS zsh shell).
- From workspace root, run commands in zsh.

## Start (Development)

**Backend**

- Install and start:
  ```sh
  cd backend
  npm install
  npm start
  ```
- Server URL: http://localhost:8080

**Frontend**

- Install and start:
  ```sh
  cd frontend
  npm install
  npm start
  ```
- App URL: http://localhost:3000

## API

Base: `http://localhost:8080/events`

Endpoints:

- `GET /events` — Returns `{ events: [...] }`, 500 on error
- `GET /events/:id` — Returns `{ event: {...} }`, 404 if not found
- `POST /events` — Body: `{ title, image, date, description }`, 201 on success, 422 on validation errors
- `PATCH /events/:id` — Body same as POST, 200 on success, 422/404 on error
- `DELETE /events/:id` — 200 on success

CORS: backend sets `Access-Control-Allow-Origin: *`.

Data persistence: `backend/events.json` updated on add/replace/delete. IDs generated with uuid v4.

## Data Model (Event)

- `id`: string
- `title`: string
- `image`: string (URL)
- `date`: string (YYYY-MM-DD)
- `description`: string

## Validation Rules (Backend)

Implemented in `backend/util/validation.js`:

- `title`, `description`: non-empty trimmed text
- `date`: parsed with `new Date(value)` (see Known Issues)
- `image`: must start with 'http'

## Frontend Architecture / Important Files

- Router setup: `frontend/src/App.jsx` using `createBrowserRouter` with nested routes and route-level loaders/actions.
- Pages:
  - `frontend/src/pages/Home.jsx` — landing page
  - `frontend/src/pages/Events.jsx` — events list page (uses loader + Suspense + Await)
  - `frontend/src/pages/EventDetail.jsx` — event detail + list sidebar
  - `frontend/src/pages/NewEvent.jsx` — renders `EventForm` with method="post"
  - `frontend/src/pages/EditEvent.jsx` — renders `EventForm` with method="patch" and event data from loader
  - `frontend/src/pages/Newsletter.jsx` — newsletter signup page
- Components:
  - `frontend/src/components/EventForm.jsx` — shared form component and form action
  - `EventsList.jsx`, `EventItem.jsx` — list and item UI
  - `MainNavigation.jsx`, `EventsNavigation.jsx`, `NewsletterSignup.jsx`, `PageContent.jsx`
- Loaders / actions:
  - `loadEvents` and `loadEvent` fetch from backend
  - Form actions perform POST / PATCH requests and redirect to /events on success
  - Delete action issues DELETE and redirects

## File Map (Top-Level of Interest)

- `backend/`
  - `app.js` — Express server and error middleware
  - `routes/events.js` — routing + validation + handlers
  - `data/event.js` — read/write JSON, CRUD helpers
  - `events.json` — seed data
  - `util/validation.js`, `util/errors.js`
- `frontend/`
  - `src/App.jsx` — router config, route loaders/actions mapping
  - `src/pages/*` — route pages
  - `src/components/*` — UI and form handling

## How to Add/Reset Seed Data

Edit `backend/events.json` directly. The server reads/writes this file. Keep JSON structure: `{ "events": [...] }`.

## Error Handling

- Backend sends JSON error responses; error middleware returns status and message.
- Frontend handles 422 responses from backend by returning the Response directly to the form (React Router handles and shows validation errors in `EventForm`).

## Testing & Build

- Frontend: `cd frontend && npm run build` produces production build.
- Backend: no build step; run `node app.js`.
- No unit tests provided.

## Maintenance Notes

- For production, replace JSON storage with a DB (SQLite/Postgres).
- Improve validation and error propagation.
- Add authentication/authorization if needed.
