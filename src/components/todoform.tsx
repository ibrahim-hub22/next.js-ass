 "use client";
 import React, { useState, useEffect } from "react";
import { ITodo } from "@/utils/types";

interface TodoFormProps {
  initialData?: ITodo;
  onSubmit: (todo: Omit<ITodo, "id">) => void;
  onCancel: () => void;
}

export default function TodoForm({
  initialData,
  onSubmit,
  onCancel,
}: TodoFormProps) {
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [completed, setCompleted] = useState<boolean>(
    initialData?.completed || false
  );

  // Update state if initialData changes (for editing mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCompleted(initialData.completed);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      userId: 1, // or dynamic if needed
      title,
      completed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter todo title"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="completed"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="completed">Completed</label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
