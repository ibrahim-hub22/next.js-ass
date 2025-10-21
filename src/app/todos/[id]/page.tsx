'use client';
import { useRouter,useParams } from 'next/navigation';
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the shape of a Todo
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoDetailPage() {
  const { id } = useParams<{ id: string }>(); // id will be string from URL
  const router =useRouter();

  const {
    data: todo,
    isLoading,
    isError,
  } = useQuery<Todo>({
    queryKey: ["todo", id],
    queryFn: async () => {
      const res = await axios.get<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      return res.data;
    },
    enabled: !!id, // only run if id exists
  });

  if (isLoading) return <div className="p-6 text-lg">Loading...</div>;
  if (isError || !todo)
    return <div className="p-6 text-red-500">Error loading todo</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo Detail</h1>
      <div className="bg-white shadow-md rounded p-4 border">
        <p>
          <span className="font-semibold">ID:</span> {todo.id}
        </p>
        <p>
          <span className="font-semibold">Title:</span> {todo.title}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          {todo.completed ? "✅ Completed" : "❌ Not completed"}
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back to List
      </button>
    </div>
  );
}
