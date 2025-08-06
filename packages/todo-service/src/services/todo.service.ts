import { database } from '../database/database';
import { CreateTodoDto, UpdateTodoDto, Todo, TodoResponse } from '../types/todo.types';

export class TodoService {
  async createTodo(userUuid: string, todoData: CreateTodoDto): Promise<TodoResponse> {
    const { content } = todoData;

    const query = `
      INSERT INTO todos (content, user_uuid)
      VALUES ($1, $2)
      RETURNING id, uuid, content, user_uuid, created_at, updated_at
    `;

    const result = await database.query(query, [content, userUuid]);
    const todo = result.rows[0];

    return {
      id: todo.id,
      uuid: todo.uuid,
      content: todo.content,
      user_uuid: todo.user_uuid,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    };
  }

  async getTodosByUserUuid(userUuid: string): Promise<TodoResponse[]> {
    const query = 'SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC';
    const result = await database.query(query, [userUuid]);

    return result.rows.map((todo: any) => ({
      id: todo.id,
      uuid: todo.uuid,
      content: todo.content,
      user_uuid: todo.user_uuid,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    }));
  }

  async getTodoById(id: number, userUuid: string): Promise<TodoResponse | null> {
    const query = 'SELECT * FROM todos WHERE id = $1 AND user_uuid = $2';
    const result = await database.query(query, [id, userUuid]);

    if (result.rows.length === 0) {
      return null;
    }

    const todo = result.rows[0];
    return {
      id: todo.id,
      uuid: todo.uuid,
      content: todo.content,
      user_uuid: todo.user_uuid,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    };
  }

  async updateTodo(id: number, userUuid: string, updateData: UpdateTodoDto): Promise<TodoResponse | null> {
    const existingTodo = await this.getTodoById(id, userUuid);
    if (!existingTodo) {
      return null;
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(updateData.content);
    }

    if (fields.length === 0) {
      return existingTodo; // No updates
    }

    fields.push(`updated_at = NOW()`);
    values.push(id, userUuid);

    const query = `
      UPDATE todos 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount++} AND user_uuid = $${paramCount++}
      RETURNING id, uuid, content, user_uuid, created_at, updated_at
    `;

    const result = await database.query(query, values);
    const todo = result.rows[0];

    return {
      id: todo.id,
      uuid: todo.uuid,
      content: todo.content,
      user_uuid: todo.user_uuid,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    };
  }

  async deleteTodo(id: number, userUuid: string): Promise<boolean> {
    const query = 'DELETE FROM todos WHERE id = $1 AND user_uuid = $2';
    const result = await database.query(query, [id, userUuid]);

    return result.rowCount > 0;
  }

  async getTodoStats(userUuid: string): Promise<{ total: number }> {
    const query = `
      SELECT COUNT(*) as total
      FROM todos 
      WHERE user_uuid = $1
    `;

    const result = await database.query(query, [userUuid]);
    const stats = result.rows[0];

    return {
      total: parseInt(stats.total),
    };
  }
}

export const todoService = new TodoService();
