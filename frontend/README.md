# Frontend (React + Vite)

UI du tableau de bord Arc-en-Ciel (React + TypeScript + Vite).

## Démarrer le client

```bash
npm install
npm run dev   # http://localhost:5173
```

Le client attend une API sur `http://localhost:4000/api` (configurable via `VITE_API_URL`).

## Comptes de test

- Direction (accès complet) : `direction@creche.fr` / `arcenciel` via `/login`
- Parents (lecture seule) : `/parents`
  - `parent.elise@demo.fr` / `parent123`
  - `parent.noah@demo.fr` / `parent123`

## Scripts utiles

```bash
npm run build   # build de production + type-check
npm test        # tests front (vitest) si ajoutés
```
