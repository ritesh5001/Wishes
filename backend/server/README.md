# Birthday Wishes Server

This folder contains the API service that powers the application.

- Entry: `server.js`
- Env: copy `.env.example` to `.env` and update the values
- Source folders under `src/` for config, controllers, models, routes, middlewares, utils.

### Local scripts

- Install deps: `npm install`
- Dev mode (auto-reload): `npm run dev`
- Prod mode: `npm start`

### Required environment values

- `NODE_ENV` (`development` | `production`)
- `PORT` (defaults to 3000 when omitted)
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (comma separated list of allowed origins)
- `REMINDER_WINDOW_DAYS` (optional window for reminders)

### Health check

- `GET /` basic status
- `GET /health` deployment probe
