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