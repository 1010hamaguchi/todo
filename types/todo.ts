export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;
  tags: string[];
  priority: Priority;
  dueDate?: string; // ISO string format
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}

export interface TodoFormData {
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  priority: Priority;
  dueDate?: string;
}

export interface FilterOptions {
  category?: string;
  tags?: string[];
  priority?: Priority;
  completed?: boolean;
  searchTerm?: string;
}
