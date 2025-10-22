# Wishes Frontend

This React + Vite app talks to a backend API. Configure the backend base URL via a Vite env var:

- Create a `.env` file in `frontend/` (or use `.env.production` / `.env.development`).
- Set `VITE_API_URL` to your backend root URL (without the trailing slash). The app will auto-append `/api`.

Example:

```
VITE_API_URL=https://wishes-rhvh.onrender.com
```

If not set, the app uses `http://localhost:3000` in development and `https://wishes-rhvh.onrender.com` in production by default.

---

# React + Vite

## Deploying to Render

This repository includes a `render.yaml` with a static site service for the frontend.

What it does:
- Builds the app from `frontend/` with `npm ci && npm run build`
- Publishes the static site from `frontend/dist`
- Adds SPA rewrite (`/* -> /index.html`) so client-side routes work
- Sets `VITE_API_URL` to your backend URL (edit if needed)

Steps:
1. Commit and push to GitHub.
2. In Render, create a “Blueprint” from this repo; it will detect `render.yaml`.
3. In the backend service, set `CLIENT_URL` to your frontend’s Render URL (required in production for CORS).
4. Deploy. The frontend will build and point to your backend automatically.

Environment variables:
- Frontend: `VITE_API_URL` (non-secret). Defaults are already sensible; override if needed.
- Backend: `CLIENT_URL` must include your frontend origin (e.g., `https://wishes-frontend.onrender.com`).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
