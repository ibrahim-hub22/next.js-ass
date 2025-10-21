"use client"
import localforage from "localforage";
import { ITodo } from "@/utils/types";

const TODOS_KEY = "cached_todos";

// ✅ Get cached todos (generic typing supported)
export const getCachedTodos = async <T = ITodo[]>(): Promise<T | null> => {
  const data = await localforage.getItem<T>(TODOS_KEY);
  return data || null;
};

// ✅ Set cached todos
export const setCachedTodos = async (todos: ITodo[]): Promise<void> => {
  await localforage.setItem(TODOS_KEY, todos);
};
