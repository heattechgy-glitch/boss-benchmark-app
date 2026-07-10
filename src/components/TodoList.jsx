import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { useTodos } from '../context/TodoContext';

const TodoList = () => {
  const { todos, clearCompleted, deleteTodo } = useTodos();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  
  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setShowConfirmDialog(true);
  };
  
  const handleConfirmDelete = () => {
    if (todoToDelete) {
      deleteTodo(todoToDelete.id);
    }
    setShowConfirmDialog(false);
    setTodoToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setTodoToDelete(null);
  };
  
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }
  
  return (
    <div className="todo-list-container">
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <p>Are you sure you want to delete this todo?</p>
            {todoToDelete && (
              <p className="todo-to-delete">"{todoToDelete.text}"</p>
            )}
            <div className="confirm-dialog-buttons">
              <button 
                className="confirm-btn"
                onClick={handleConfirmDelete}
                aria-label="Confirm delete"
              >
                Delete
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancelDelete}
                aria-label="Cancel delete"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;