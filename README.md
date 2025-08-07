# 🧩 AICI Challenge – Todo Microservices System

## 📋 Overview

This is a full-stack containerized system composed of:

- **User Service**: Handles user registration & login.
- **Todo Service**: Handles CRUD operations for a user’s personal todo list.
- **Frontend** : Basic interface to test user login and todo interaction.

All components are built with **Node.js + TypeScript**, containerized using **Docker**, and orchestrated using **Docker Compose**.

---

## 🚀 Features

- User registration & JWT-based authentication
- Secure password hashing
- JWT validation across services
- CRUD operations for todos (Create, Read, Update, Delete)
- PostgreSQL for persistent storage
- Fully containerized microservices architecture

---

## 🧱 Tech Stack

- **Backend**: Node.js + TypeScript
- **Frontend**: NextJS
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Token)
- **DevOps**: Docker, Docker Compose
- **API Docs**: Postman / OpenAPI
- **Tests**: Unit tests for all endpoints

---

## 📁 Project Structure

```

├── docker-compose.yml
├── packages/
│   ├── user-service/
│   │   ├── Dockerfile
│   │   └── src/
│   ├── todo-service/
│   │   ├── Dockerfile
│   │   └── src/
│   └── app/
└── docs/
```

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/aici-challenge.git
cd aici-challenge
```

### 2. Create environment files
Copy the example environment files for each service:
```bash
cp packages/user-service/.env.example packages/user-service/.env
cp packages/todo-service/.env.example packages/todo-service/.env
cp packages/app/.env.example packages/app/.env
cp .env.example .env
```

### 3. Create environment files
Add JWT secret to the root env
```bash
JWT_SECRET=YOUR_SECRET_KEY_HERE
```

### 4. Run the system

```bash
docker-compose up --build
```

> All services should be accessible at:
> - `user-service`: http://localhost:4000
> - `todo-service`: http://localhost:4001
> - `frontend`: http://localhost:3000
---

## 🔐 Flow

- Register/Login on the app
- CRUD todo items

---

## 📚 API Documentation

- User Service: http://localhost:4000/api-docs
- Todo Service: http://localhost:4001/api-docs

---

## 🧪 Testing

To run unit tests:

```bash
# From each service directory
npm run test
```
---


## 📬 Contact

For any questions, feel free to reach out or raise an issue in the repository.
