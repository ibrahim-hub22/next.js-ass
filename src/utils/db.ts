import Dexie, { Table } from "dexie";
import { ITodo } from "@/utils/types";

export class TodoDB extends Dexie {
  // ✅ Declare todos table with type
  todos!: Table<ITodo, number>;

  constructor() {
    super("TodoDB");

    this.version(1).stores({
      todos: "++id, title, completed", // Primary key and indexed fields
    });
  }
}

// ✅ Export an instance
export const db = new TodoDB();
