// src/types.ts
export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
  isLocal?: boolean;
}
