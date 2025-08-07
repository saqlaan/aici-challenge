import request from 'supertest';
import express from 'express';
import { todoController } from '../controllers/todo.controller';
import { todoService } from '../services/todo.service';

jest.mock('../services/todo.service');

const mockedTodoService = todoService as jest.Mocked<typeof todoService>;

let app: express.Application;

describe('Todo Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    app = express();
    app.use(express.json());

    // Mock middleware to set user
    app.use((req: any, res, next) => {
      req.user = { userId: 1, userUuid: '123e4567-e89b-12d3-a456-426614174000', user_email: 'test@example.com' };
      req.userUuid = '123e4567-e89b-12d3-a456-426614174000';
      next();
    });

    app.post('/todos', todoController.createTodo);
    app.get('/todos', todoController.getTodos);
    app.get('/todos/:id', todoController.getTodoById);
    app.put('/todos/:id', todoController.updateTodo);
    app.delete('/todos/:id', todoController.deleteTodo);
  });

  describe('POST /todos: Create Todo', () => {
    it('should create a new todo successfully', async () => {
      const mockTodo = {
        id: 1,
        uuid: '456e7890-e89b-12d3-a456-426614174001',
        content: 'Test Todo',
        user_uuid: '123e4567-e89b-12d3-a456-426614174000',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedTodoService.createTodo.mockResolvedValue(mockTodo);

      const response = await request(app)
        .post('/todos')
        .send({
          content: 'Test Todo'
        });

      expect(response.status).toBe(201);
      expect(response.body.todo).toEqual({
        ...mockTodo,
        created_at: mockTodo.created_at.toISOString(),
        updated_at: mockTodo.updated_at.toISOString(),
      });
    });

    it('should return 401 if JWT is missing', async () => {
      // Create a separate app without the auth middleware for this test
      const unauthorizedApp = express();
      unauthorizedApp.use(express.json());
      unauthorizedApp.post('/todos', todoController.createTodo);

      const response = await request(unauthorizedApp)
        .post('/todos')
        .send({
          content: 'Test Todo'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not authenticated');
    });
  });

  describe('GET /todos', () => {
    it('should get all todos for user', async () => {
      const mockTodos = [
        {
          id: 1,
          uuid: '456e7890-e89b-12d3-a456-426614174001',
          content: 'Test Todo 1',
          user_uuid: '123e4567-e89b-12d3-a456-426614174000',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          uuid: '456e7890-e89b-12d3-a456-426614174002',
          content: 'Test Todo 2',
          user_uuid: '123e4567-e89b-12d3-a456-426614174000',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockedTodoService.getTodosByUserUuid.mockResolvedValue(mockTodos);

      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body.todos).toEqual(mockTodos.map(todo => ({
        ...todo,
        created_at: todo.created_at.toISOString(),
        updated_at: todo.updated_at.toISOString(),
      })));
      // Ensure all todos belong to the authenticated user
      response.body.todos.forEach((todo: any) => {
        expect(todo.user_uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
      });
    });

    it('should return an empty array if there are no todos', async () => {
      mockedTodoService.getTodosByUserUuid.mockResolvedValue([]);

      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body.todos).toEqual([]);
    });

    it('should return 404 if todo not found', async () => {
      mockedTodoService.getTodoById.mockResolvedValue(null);

      const response = await request(app).get('/todos/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 401 if JWT is missing', async () => {
      // Create a separate app without the auth middleware for this test
      const unauthorizedApp = express();
      unauthorizedApp.use(express.json());
      unauthorizedApp.get('/todos', todoController.getTodos);

      const response = await request(unauthorizedApp).get('/todos');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not authenticated');
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo successfully', async () => {
      const mockUpdatedTodo = {
        id: 1,
        uuid: '456e7890-e89b-12d3-a456-426614174001',
        content: 'Updated Todo',
        user_uuid: '123e4567-e89b-12d3-a456-426614174000',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedTodoService.updateTodo.mockResolvedValue(mockUpdatedTodo);

      const response = await request(app)
        .put('/todos/1')
        .send({
          content: 'Updated Todo'
        });

      expect(response.status).toBe(200);
      expect(response.body.todo).toEqual({
        ...mockUpdatedTodo,
        created_at: mockUpdatedTodo.created_at.toISOString(),
        updated_at: mockUpdatedTodo.updated_at.toISOString(),
      });
    });

    it('should return 404 if todo not found', async () => {
      mockedTodoService.updateTodo.mockResolvedValue(null);

      const response = await request(app)
        .put('/todos/999')
        .send({
          content: 'Updated Todo'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 404 if user is not the owner of the todo', async () => {
      // The service layer returns null when todo doesn't exist or user doesn't own it
      mockedTodoService.updateTodo.mockResolvedValue(null);

      const response = await request(app)
        .put('/todos/1')
        .send({ content: 'Updated Todo' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 401 if JWT is missing', async () => {
      // Create a separate app without the auth middleware for this test
      const unauthorizedApp = express();
      unauthorizedApp.use(express.json());
      unauthorizedApp.put('/todos/:id', todoController.updateTodo);

      const response = await request(unauthorizedApp)
        .put('/todos/1')
        .send({ content: 'Updated Todo' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not authenticated');
    });

    it('should update the todo if user is the owner', async () => {
      const mockUpdatedTodo = {
        id: 1,
        uuid: '456e7890-e89b-12d3-a456-426614174001',
        content: 'Updated Todo',
        user_uuid: '123e4567-e89b-12d3-a456-426614174000',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedTodoService.updateTodo.mockResolvedValue(mockUpdatedTodo);

      const response = await request(app)
        .put('/todos/1')
        .send({ content: 'Updated again' });

      expect(response.status).toBe(200);
      expect(response.body.todo).toEqual({
        ...mockUpdatedTodo,
        created_at: mockUpdatedTodo.created_at.toISOString(),
        updated_at: mockUpdatedTodo.updated_at.toISOString(),
      });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo successfully', async () => {
      mockedTodoService.deleteTodo.mockResolvedValue(true);

      const response = await request(app).delete('/todos/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo deleted successfully');
    });

    it('should return 404 if user is not the owner of the todo', async () => {
      // The service layer returns false when todo doesn't exist or user doesn't own it
      mockedTodoService.deleteTodo.mockResolvedValue(false);

      const response = await request(app).delete('/todos/1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 404 if todo not found', async () => {
      mockedTodoService.deleteTodo.mockResolvedValue(false);

      const response = await request(app).delete('/todos/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 401 if JWT is missing', async () => {
      // Create a separate app without the auth middleware for this test
      const unauthorizedApp = express();
      unauthorizedApp.use(express.json());
      unauthorizedApp.delete('/todos/:id', todoController.deleteTodo);

      const response = await request(unauthorizedApp)
        .delete('/todos/1');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not authenticated');
    });
  });
});
