// src/App.js
import React, { useState } from 'react';
import './Todo.css';

const Todo = ({ todo, onUpdate, onDelete, onComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(todo.content);

  const handleUpdate = () => {
    onUpdate(todo.id, updatedTodo);
    setIsEditing(false);
  };

  return (
    <li className="todo-item">
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {isEditing ? (
          <input
            type="text"
            value={updatedTodo}
            onChange={(e) => setUpdatedTodo(e.target.value)}
          />
        ) : (
          todo.content
        )}
      </span>
      {isEditing ? (
        <button onClick={handleUpdate}>Sauvegarder</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Modifier</button>
      )}
      <button onClick={() => onComplete(todo.id, {completed: !todo.completed})}>
        {todo.completed ? 'Annuler' : 'Terminer'}
      </button>
      <button onClick={() => onDelete(todo.id)}>Supprimer</button>
    </li>
  );
};

export default Todo;
