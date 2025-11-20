# DayCare With Codex

Complete daycare management platform with a joyful React front-end and an Express/Node back-end that stores data locally using JSON files.

## Project Overview

- **Front-end**: React + TypeScript + Vite, React Router, Axios, custom theme context with light/dark modes and pastel accent colors.
- **Back-end**: Express server with REST endpoints for staff, children, activities, and baby inventory resources. Data is kept in memory and persisted to JSON files on every mutation.
- **Persistence**: Local JSON files inside `backend/data/*.json` act as the database; each CRUD request updates both memory and the files via the Node `fs` module.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```
   (After the first run you can simply use `npm install` at the repository root thanks to the lockfiles inside each package.)

2. **Run the full stack**
   ```bash
   npm run dev
   ```
   This launches:
   - `npm run dev:server` → Express API on `http://localhost:4000`
   - `npm run dev:client` → Vite dev server on `http://localhost:5173` with hot reload

3. **Individual scripts**
   ```bash
   npm run dev:server   # only the API (nodemon)
   npm run dev:client   # only the React app
   cd frontend && npm run build   # type-check + production build
   ```

## API Summary

Base URL: `http://localhost:4000/api`

| Resource    | Routes                                   |
|-------------|-------------------------------------------|
| Staff       | `GET/POST /staff`, `GET/PUT/DELETE /staff/:id` |
| Children    | `GET/POST /children`, `GET/PUT/DELETE /children/:id` |
| Activities  | `GET/POST /activities`, `GET/PUT/DELETE /activities/:id` |
| Inventory   | `GET/POST /inventory`, `GET/PUT/DELETE /inventory/:id` |

Each route validates required fields, keeps a synchronized in-memory dataset, and writes to the matching JSON file inside `backend/data/` (`staff.json`, `children.json`, `activities.json`, `inventory.json`). The default JSON files are seeded with realistic demo data (6 staff members, 19 children, 6 activities, 8 inventory entries with expiration alerts).

## Front-end Highlights

- Playful, pastel UI with emojis, rounded widgets, and the **Nunito** font.
- Fixed sidebar navigation, responsive layout, and dedicated pages:
  - **Tableau de bord**: live stats, activities of the day, inventory alerts.
  - **Plannings**: weekly staff / children planning with CRUD forms and capacity warnings.
  - **Activités**: cards filterable (today / souvenirs / all) with photo galleries and CRUD.
  - **Inventaire bébés**: table with filters, expiration color-coding, and CRUD.
  - **Enfants**: list view with automatic age calculation and CRUD.
  - **Paramètres**: persistent theme + accent color choices stored in `localStorage`.
- Required inputs receive red borders and validation hints when missing.

## Data Persistence Notes

- JSON files are loaded once on server startup via `backend/src/services/storeRegistry.ts`.
- Every create/update/delete writes back to disk (`fs.promises.writeFile`) to simulate a local database.
- Because everything lives inside the repository, no external DB setup is needed. The JSON files can be inspected or edited manually if required; restarting the server will re-read the updated content.

Enjoy running Arc-en-Ciel! 🌈
