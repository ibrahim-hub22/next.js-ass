"use client"
import React from "react";
import {ITodo} from"@/utils/types";
// Define the shape of a Todo item
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: ITodo;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoItem({
  todo,
  toggleComplete,
  deleteTodo,
}: TodoItemProps) {
  return (
    <li className="flex justify-between items-center p-2 border rounded">
      <span
        className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}
        onClick={() => toggleComplete(todo.id)}
      >
        {todo.title}
      </span>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="ml-4 text-red-500"
      >
        Delete
      </button>
    </li>
  );
}

