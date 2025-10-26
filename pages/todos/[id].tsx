import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ITodo } from "@/utils/types";
import { getCachedTodos, setCachedTodos } from "@/utils/localCache";
import { useState } from "react";
import { Check, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TodoDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  const queryClient = useQueryClient();

  const { data: todo, isLoading, isError } = useQuery<ITodo>({
    queryKey: ["todo", id],
    queryFn: async (): Promise<ITodo> => {
      const cached = await getCachedTodos<ITodo[]>();
      const foundTodo = cached?.find((t) => t.id === Number(id));
      if (foundTodo) return foundTodo;

      const res = await axios.get<ITodo>(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  });

  const updateTodoMutation = useMutation<ITodo, Error, ITodo>({
    mutationFn: async (updatedTodo) => {
      const res = await axios.put<ITodo>(
        `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
        updatedTodo
      );
      return res.data;
    },
    onSuccess: async (updatedTodo) => {
      const cached = await getCachedTodos<ITodo[]>();
      const newTodos = (cached || []).map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      );
      await setCachedTodos(newTodos);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    if (todo) {
      setEditTitle(todo.title);
      setEditCompleted(todo.completed);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (todo) {
      updateTodoMutation.mutate({
        ...todo,
        title: editTitle,
        completed: editCompleted,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !todo) return <div className="p-6 text-red-600">Todo not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Todos
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">Todo Details</h1>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="completed"
                checked={editCompleted}
                onChange={(e) => setEditCompleted(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="completed" className="text-sm font-medium">
                Completed
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={updateTodoMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updateTodoMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Title</h2>
              <p className="text-gray-700">{todo.title}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Status</h2>
              <div className="flex items-center gap-2">
                {todo.completed ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">Completed</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">Not Completed</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">User ID</h2>
              <p className="text-gray-700">{todo.userId}</p>
            </div>
            {todo.isLocal && (
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded">
                <span className="text-sm font-medium">Local Todo</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
