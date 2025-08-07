
import { todoService } from '@/services/todo';
import { Todo, CreateTodoData } from '@/types';
import { useState } from 'react';


interface AddTodoFormProps {
  onAdd: (todo: Todo) => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [newTodo, setNewTodo] = useState<CreateTodoData>({ content: '' });
  const [loading, setLoading] = useState(false);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.content.trim()) return;

    try {
      setLoading(true);
      const response = await todoService.createTodo(newTodo);
      onAdd(response.todo);
      setNewTodo({ content: '' });
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateTodo} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="space-y-4">
        <div>
          <textarea
            placeholder="What do you need to do?"
            value={newTodo.content}
            onChange={(e) => setNewTodo({ content: e.target.value })}
            className="input-field h-20 resize-none"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
};
