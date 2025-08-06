import request from 'supertest';
import express from 'express';
import { todoController } from '../src/controllers/todo.controller';
import { todoService } from '../src/services/todo.service';
import { authenticateToken } from '../src/middleware/auth.middleware';

// Mock the services and middleware
jest.mock('../src/services/todo.service');
jest.mock('../src/middleware/auth.middleware');

const app = express();
app.use(express.json());

// Mock middleware to set user
app.use((req: any, res, next) => {
  req.user = { userId: 1, email: 'test@example.com' };
  next();
});

app.post('/todos', todoController.createTodo);
app.get('/todos', todoController.getTodos);
app.get('/todos/:id', todoController.getTodoById);
app.put('/todos/:id', todoController.updateTodo);
app.delete('/todos/:id', todoController.deleteTodo);

describe('Todo Controller', () => {
  describe('POST /todos', () => {
    it('should create a new todo successfully', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (todoService.createTodo as jest.Mock).mockResolvedValue(mockTodo);

      const response = await request(app)
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        });

      expect(response.status).toBe(201);
      expect(response.body.todo).toEqual(mockTodo);
    });
  });

  describe('GET /todos', () => {
    it('should get all todos for user', async () => {
      const mockTodos = [
        {
          id: 1,
          title: 'Test Todo 1',
          description: 'Test Description 1',
          completed: false,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Todo 2',
          description: 'Test Description 2',
          completed: true,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (todoService.getTodosByUserId as jest.Mock).mockResolvedValue(mockTodos);

      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body.todos).toEqual(mockTodos);
      expect(response.body.count).toBe(2);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo successfully', async () => {
      const mockUpdatedTodo = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (todoService.updateTodo as jest.Mock).mockResolvedValue(mockUpdatedTodo);

      const response = await request(app)
        .put('/todos/1')
        .send({
          title: 'Updated Todo',
          completed: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.todo).toEqual(mockUpdatedTodo);
    });

    it('should return 404 if todo not found', async () => {
      (todoService.updateTodo as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/todos/999')
        .send({
          title: 'Updated Todo',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo successfully', async () => {
      (todoService.deleteTodo as jest.Mock).mockResolvedValue(true);

      const response = await request(app).delete('/todos/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo deleted successfully');
    });

    it('should return 404 if todo not found', async () => {
      (todoService.deleteTodo as jest.Mock).mockResolvedValue(false);

      const response = await request(app).delete('/todos/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });
  });
});
