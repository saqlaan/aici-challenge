# Todo App

A Next.js frontend application for managing todo items with user authentication.

## Features

- User registration and login
- Create, read, update, and delete todos
- Responsive design with Tailwind CSS
- JWT-based authentication
- Real-time todo management

## Tech Stack

- **Framework**: Next.js 13+
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens
- **API Integration**: REST API calls
- **Language**: TypeScript

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:4000
   NEXT_PUBLIC_TODO_SERVICE_URL=http://localhost:4001
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

## Pages

- `/` - Home page with todo list (requires login)
- `/login` - User login
- `/register` - User registration