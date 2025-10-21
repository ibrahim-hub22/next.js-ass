"use client";
import { ITodo } from "@/utils/types";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { X, SquarePen, Trash2, Plus, Check } from "lucide-react";

import TodoForm from "@/components/todoform";
import DeleteModal from "@/components/deletemodal";
import { getCachedTodos, setCachedTodos } from "@/utils/localCache";

export default function TodoListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "completed" | "incomplete">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<ITodo | null>(null);

  const queryClient = useQueryClient();
  const itemsPerPage = 10;

  // ✅ Fetch todos
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery<ITodo[]>({
    queryKey: ["todos"],
    queryFn: async (): Promise<ITodo[]> => {
      const cached = await getCachedTodos<ITodo[]>();
      if (cached) return cached;

      const res = await axios.get<ITodo[]>(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = res.data.slice(0, 50);
      await setCachedTodos(data);
      return data;
    },
  });

  // ✅ Create Todo
  const createTodoMutation = useMutation<ITodo, Error, Omit<ITodo, "id">>({
    mutationFn: async (newTodo) => {
      const todoWithMeta: ITodo = {
        ...newTodo,
        id: Date.now(),
        isLocal: true,
        userId: 1,
      };

      const cached = (await getCachedTodos<ITodo[]>()) || [];
      await setCachedTodos([...cached, todoWithMeta]);
      return todoWithMeta;
    },
    onSuccess: async (newTodo) => {
      const prevTodos = (await getCachedTodos<ITodo[]>()) || [];
      const updated = [newTodo, ...prevTodos];
      await setCachedTodos(updated);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsCreating(false);
    },
  });

  // ✅ Update Todo
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
      const newTodos = (cached || []).map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      await setCachedTodos(newTodos);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingTodo(null);
    },
  });

  // ✅ Delete Todo
  const deleteTodoMutation = useMutation<number, Error, number>({
    mutationFn: async (id) => {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      return id;
    },
    onSuccess: async (deletedId) => {
      const cached = await getCachedTodos<ITodo[]>();
      const remaining = (cached || []).filter((todo) => todo.id !== deletedId);
      await setCachedTodos(remaining);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTodoToDelete(null);
    },
  });

  if (isLoading) return <div>Loading todos...</div>;
  if (isError) return <div className="p-6 text-red-600">Error loading todos.</div>;

  // ✅ Filtering
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      status === "all"
        ? true
        : status === "completed"
        ? todo.completed
        : !todo.completed;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Ibrahim's Todos</h1>

      <div className="flex w-full justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className="flex justify-end mb-4 px-4 py-2 bg-green-600 text-white rounded flex gap-1 hover:bg-green-800 hover:scale-90 transition-all duration-300 ease-in"
        >
          <Plus /> Add Todo
        </button>
      </div>

      {isCreating && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-30 backdrop-blur-lg z-40"
            onClick={() => setIsCreating(false)}
          />
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-2">Create New Todo</h2>
              <TodoForm
                onSubmit={(data) => createTodoMutation.mutate(data)}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          </div>
        </>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/2 px-3 py-2 border rounded flex-1"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | "completed" | "incomplete");
            setPage(1);
          }}
          className="w-full md:w-1/3 px-3 py-2 border rounded flex-1"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      <ul className="space-y-4 mb-6">
        {currentTodos.map((todo) => (
          <li
            key={todo.id}
            className={`border p-4 rounded shadow hover:shadow-md transition ${
              todo.completed
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }`}
          >
            <div className="flex justify-between">
              <Link
                href={`/todos/${todo.id}`}
                className="block text-lg font-medium hover:underline flex-1"
              >
                {todo.title}
              </Link>
              <div className="flex gap-3">
                <button onClick={() => setEditingTodo(todo)}>
                  <SquarePen />
                </button>
                <button
                  onClick={() => setTodoToDelete(todo)}
                  className="text-red-600"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 flex gap-1 items-center">
              {todo.completed ? (
                <>
                  <Check className="inline w-4 h-full text-green-500" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <X className="inline w-4 h-full text-red-500" />
                  <span>Not completed</span>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      {todoToDelete && (
        <DeleteModal
          onCancel={() => setTodoToDelete(null)}
          onConfirm={() => deleteTodoMutation.mutate(todoToDelete.id)}
        />
      )}

      {currentTodos.length === 0 && (
        <li className="text-gray-500 text-center py-8">
          No todos match your search or filter.
        </li>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
