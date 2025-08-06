import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { todoService } from '../services/todo.service';
import { CreateTodoDto, UpdateTodoDto } from '../types/todo.types';
import { AuthRequest } from '../middleware/auth.middleware';

export class TodoController {
  async createTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.userUuid) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const todoData: CreateTodoDto = req.body;
      const todo = await todoService.createTodo(req.userUuid, todoData);

      res.status(201).json({
        message: 'Todo created successfully',
        todo,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTodos(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userUuid) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const todos = await todoService.getTodosByUserUuid(req.userUuid);

      res.json({
        todos,
        count: todos.length,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTodoById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.userUuid) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const todoId = parseInt(req.params.id);
      const todo = await todoService.getTodoById(todoId, req.userUuid);

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json({ todo });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.userUuid) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const todoId = parseInt(req.params.id);
      const updateData: UpdateTodoDto = req.body;

      const todo = await todoService.updateTodo(todoId, req.userUuid, updateData);

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json({
        message: 'Todo updated successfully',
        todo,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.userUuid) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const todoId = parseInt(req.params.id);
      const deleted = await todoService.deleteTodo(todoId, req.userUuid);

      if (!deleted) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTodoStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userUuid) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const stats = await todoService.getTodoStats(req.userUuid);
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const todoController = new TodoController();
