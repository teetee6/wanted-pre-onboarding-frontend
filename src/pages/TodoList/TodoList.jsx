import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoList.css'; // Import your CSS file

function TodoItem({ text, completed }) {
  return (
    <li className={`todo-item ${completed ? 'completed' : ''}`}>
      <label>
        <input type="checkbox" checked={completed} readOnly />
        <span>{text}</span>
      </label>
    </li>
  );
}

function TodoList() {
  const navigate = useNavigate();
  const todos = [
    { id: 1, text: 'TODO 1', completed: false },
    { id: 2, text: 'TODO 2', completed: true },
    { id: 3, text: 'TODO 3', completed: false },
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} text={todo.text} completed={todo.completed} />
      ))}
    </ul>
  );
}

export default TodoList;
