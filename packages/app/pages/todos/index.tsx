import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { todoService } from '../../services/todo';
import { Todo } from '../../types';
import { useRouter } from 'next/router';
import { TodoItem } from './_components/TodoItem';
import { AddTodoForm } from './_components/AddTodoForm';

const Todos = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      loadTodos();
    } else {
      setLoading(false);
      router.push('/login');
    }
  }, [user]);

  const loadTodos = async () => {
    try {
      const response = await todoService.getTodos();
      setTodos(response.todos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = (todo: Todo) => {
    setTodos([todo, ...todos]);
  };

  const handleUpdateTodo = async (id: number, content: string) => {
    if (!content.trim()) return;

    try {
      const response = await todoService.updateTodo(id, { content });
      setTodos(todos.map(todo =>
        todo.id === id ? response.todo : todo
      ));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const stats = {
    total: todos.length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
        <div className="text-sm text-gray-600">
          {stats.total} total todos
        </div>
      </div>

      <AddTodoForm onAdd={handleAddTodo} />

      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No todos found. Add your first todo above!
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Todos;
