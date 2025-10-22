# Wishes - Birthday Wishes Application

A full-stack application for managing birthday wishes.

## Project Structure

```
Wishes/
├── server/          # Backend Express server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── config/
│   ├── server.js    # Main server file
│   └── package.json
├── package.json     # Root package.json (workspace config)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/ritesh5001/Wishes.git
cd Wishes
```

2. Install server dependencies
```bash
npm run install-server
```

3. Set up environment variables
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

## Deploying to Render

You can deploy the backend with the included `render.yaml` or by creating a Web Service manually.

### Option A: Blueprint (render.yaml)
1. Push this repo to GitHub.
2. In Render, click New > Blueprint and select the repo.
3. Render will create a Web Service for `backend/server` using:
	- Build: `npm ci --omit=dev` (fallback `npm install`)
	- Start: `npm start`
	- Health check path: `/health`
4. Set environment variables in the Render dashboard:
	- `NODE_ENV=production`
	- `MONGO_URI`
	- `JWT_SECRET`
	- `CLIENT_URL` (comma-separated list of allowed origins, e.g., `https://your-frontend.onrender.com`)
	- `REMINDER_WINDOW_DAYS` (optional)
	- `PORT` is provided by Render automatically

### Option B: Manual Web Service
1. New > Web Service > Connect the repo
2. Root Directory: `backend/server`
3. Environment: Node
4. Build Command: `npm ci --omit=dev` (or `npm install`)
5. Start Command: `npm start`
6. Health Check Path: `/health`
7. Add the same environment variables as above

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.