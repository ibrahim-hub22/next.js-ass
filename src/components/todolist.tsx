import React from "react";
import {ITodo} from "@/utils/types"
import TodoItem from "@/components/todoitem"
interface TodoListProps {
  todos: ITodo[];
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoList({
  todos,
  toggleComplete,
  deleteTodo,
}: TodoListProps) {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
}

