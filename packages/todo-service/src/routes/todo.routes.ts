import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { 
  createTodoValidation, 
  updateTodoValidation, 
  todoIdValidation 
} from '../middleware/validation.middleware';
import { authenticateToken, extractUserUuid } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and UUID extraction
router.use(authenticateToken);
router.use(extractUserUuid);

// Todo CRUD routes
router.post('/', createTodoValidation, todoController.createTodo);
router.get('/', todoController.getTodos);
router.get('/stats', todoController.getTodoStats);
router.get('/:id', todoIdValidation, todoController.getTodoById);
router.put('/:id', updateTodoValidation, todoController.updateTodo);
router.delete('/:id', todoIdValidation, todoController.deleteTodo);

export default router;
