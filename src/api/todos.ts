"use client"
import axios from "axios";
import { ITodo } from "@/utils/types"; // This is fine to import if needed elsewhere

const API_URL = "https://jsonplaceholder.typicode.com";

// Response type for paginated todos
export interface TodoResponse {
  data: ITodo[];
  total: number;
}

// Fetch all todos with pagination
export const fetchTodos = async (
  page: number = 1,
  limit: number = 10
): Promise<TodoResponse> => {
  const response = await axios.get<ITodo[]>(`${API_URL}/todos`, {
    params: { _page: page, _limit: limit },
  });

  return {
    data: response.data,
    total: Number(response.headers["x-total-count"]),
  };
};

// Fetch a single todo by ID
export const fetchTodoById = async (id: number): Promise<ITodo> => {
  const response = await axios.get<ITodo>(`${API_URL}/todos/${id}`);
  return response.data;
};
