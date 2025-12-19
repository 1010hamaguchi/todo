"use client";

import { useState, useMemo } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { FilterOptions } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getAllCategories,
    getAllTags,
  } = useTodos();

  const [filters, setFilters] = useState<FilterOptions>({});

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && todo.category !== filters.category) {
        return false;
      }

      // Priority filter
      if (filters.priority && todo.priority !== filters.priority) {
        return false;
      }

      // Completed filter
      if (filters.completed !== undefined && todo.completed !== filters.completed) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => todo.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [todos, filters]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const overdue = todos.filter(
      t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    return { total, completed, active, overdue };
  }, [todos]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            TODO App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            タスクを効率的に管理しましょう
          </p>
        </header>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">合計</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">完了</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">未完了</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.overdue}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">期限切れ</div>
          </div>
        </div>

        <TodoForm onSubmit={addTodo} />

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          categories={getAllCategories()}
          allTags={getAllTags()}
        />

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {todos.length === 0
                  ? 'TODOがありません。新しいTODOを追加してください。'
                  : 'フィルター条件に一致するTODOがありません。'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  TODOリスト
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredTodos.length}件 表示中
                </span>
              </div>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
