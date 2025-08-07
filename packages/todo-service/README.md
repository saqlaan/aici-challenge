# Todo Service

A RESTful API service for managing todo items with JWT authentication.

## Features

- Create, read, update, and delete todos
- User authentication and authorization
- PostgreSQL database integration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/todos` | Create a new todo |
| `GET` | `/todos` | Get all user's todos |
| `GET` | `/todos/:id` | Get specific todo |
| `PUT` | `/todos/:id` | Update todo |
| `DELETE` | `/todos/:id` | Delete todo |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=todo_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your-jwt-secret
   PORT=4001
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

All endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```