import { Pool } from 'pg';
import { config } from '../config/config';

const MAX_RETRIES = 10
const RETRY_DELAY_MS = 2000

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
    });
  }

  async connectWithRetry(): Promise<void> {
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        const client = await this.pool.connect();
        client.release();
        console.log('Success: connected to Postgres');
        return;
      } catch (error) {
        attempts++;
        console.log(`Info: Attempt ${attempts}/${MAX_RETRIES}: DB not ready - retrying in 2s...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      }
    }

    throw new Error('Error: Could not connect to Postgres after max retries');
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async initializeSchema(): Promise<void> {
    const createTodosTable = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
        content TEXT NOT NULL,
        user_uuid UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_todos_user_uuid ON todos(user_uuid);
      CREATE INDEX IF NOT EXISTS idx_todos_uuid ON todos(uuid);
    `;

    await this.query(createTodosTable);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export const database = new Database();
