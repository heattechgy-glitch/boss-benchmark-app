import React from 'react';
import TodoItem from './TodoItem';
import { useTodos } from '../context/TodoContext';

const TodoList = () => {
  const { todos, clearCompleted } = useTodos();
  
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }
  
  return (
    <div className="todo-list-container">
      <div className="todo-stats">
        <span className="completed-count">
          {completedCount} of {totalCount} completed
        </span>
        {completedCount > 0 && (
          <button 
            className="clear-completed-btn"
            onClick={clearCompleted}
            aria-label="Clear completed todos"
          >
            Clear Completed
          </button>
        )}
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;