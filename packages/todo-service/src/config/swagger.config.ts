import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './app.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo Service API',
      version: '1.0.0',
      description: 'Todo list management service with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Todo ID',
              example: 1,
            },
            uuid: {
              type: 'string',
              format: 'uuid',
              description: 'Todo UUID',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            content: {
              type: 'string',
              description: 'Todo content',
              example: 'Complete the project documentation',
            },
            user_uuid: {
              type: 'string',
              format: 'uuid',
              description: 'Owner user UUID',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Todo creation timestamp',
              example: '2023-08-06T10:30:00Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Todo last update timestamp',
              example: '2023-08-06T10:30:00Z',
            },
          },
        },
        CreateTodoDto: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Todo content',
              example: 'Complete the project documentation',
            },
          },
        },
        UpdateTodoDto: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Updated todo content',
              example: 'Updated: Complete the project documentation',
            },
          },
        },
        TodoResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Todo created successfully',
            },
            todo: {
              $ref: '#/components/schemas/Todo',
            },
          },
        },
        TodosResponse: {
          type: 'object',
          properties: {
            todos: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Todo',
              },
            },
            count: {
              type: 'integer',
              description: 'Number of todos returned',
              example: 5,
            },
          },
        },
        TodoStats: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of todos',
                  example: 10,
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Something went wrong',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'content',
                  },
                  message: {
                    type: 'string',
                    example: 'Content is required',
                  },
                },
              },
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-06T10:30:00Z',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

export const specs = swaggerJsdoc(options);
export const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
};
