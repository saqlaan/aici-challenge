import { Todo } from "@/types";
import { useState } from "react";

type TodoItemProps = {
  todo: Todo;
  onUpdate: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);

  const handleSave = () => {
    if (editContent.trim() && editContent !== todo.content) {
      onUpdate(todo.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(todo.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input-field h-20 resize-none"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 whitespace-pre-wrap">{todo.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(todo.created_at).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};