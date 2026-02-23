## Workout Planner – Root

This `Muscle.WebSite` directory is the **root of the Workout Planner project**.
The main app is a **React 18 + Vite** frontend living in the `frontend/` folder.

## Tech stack

- React 18
- Vite
- JavaScript (ES modules)

## Structure

- `frontend/` — React (Vite) app
  - `index.html` — Vite HTML entry
  - `src/main.jsx` — React bootstrap
  - `src/components/Header.jsx` — main header/navigation component

## Run the app

From this project root (`Muscle.WebSite`):

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at **http://localhost:5173**.

## Build for production

From this project root (`Muscle.WebSite`):

```bash
cd frontend
npm run build
```

The production-ready files are emitted into `frontend/dist/` (already ignored by `.gitignore`).
