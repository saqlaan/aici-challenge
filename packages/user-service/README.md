# User Service

A RESTful API service for user authentication and management with JWT tokens.

## Features

- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- PostgreSQL database integration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | User login |
| `GET` | `/profile` | Get user profile (requires auth) |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=user_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your-jwt-secret
   PORT=4000
   ```

3. Run the service:
   ```bash
   npm start
   ```

## Testing

```bash
npm test
```

## Authentication

After login, include the JWT token in requests:
```
Authorization: Bearer <your-jwt-token>
```