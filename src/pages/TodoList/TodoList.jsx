import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoList.css';

function TodoItem({ id, todo, completed, toggleTodo, deleteTodo, modifyTodo }) {
  const [modifiedTodo, setModifiedTodo] = useState(todo);
  const [isEditing, setIsEditing] = useState(false);

  const handleCheckboxChange = () => {
    toggleTodo(id, !completed, todo);
  };

  const handleDelete = () => {
    deleteTodo(id);
  };

  const handleModify = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleSubmit = () => {
    console.log(modifiedTodo);
    modifyTodo(id, completed, modifiedTodo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setModifiedTodo(todo);
    setIsEditing(false); // Disable editing mode
  };

  return (
    <li className={`todo-item ${completed ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
        />
        {isEditing ? (
          <input
            type="text"
            value={modifiedTodo}
            data-testid="modify-input"
            onChange={(e) => setModifiedTodo(e.target.value)}
          />
        ) : (
          <span>{todo}</span>
        )}
      </label>
      {isEditing ? (
        <>
          <button data-testid="submit-button" onClick={handleSubmit}>
            제출
          </button>
          <button data-testid="cancel-button" onClick={handleCancel}>
            취소
          </button>
        </>
      ) : (
        <>
          <button data-testid="modify-button" onClick={handleModify}>
            수정
          </button>
          <button data-testid="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </>
      )}
    </li>
  );
}

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        const response = await fetch('/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            todo: newTodo,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTodos([...todos, data]);
          setNewTodo('');
        } else {
          console.error('Failed to add new TODO');
        }
      } catch (error) {
        console.error('Error during TODO creation:', error);
      }
    }
  };

  const handleToggleTodo = async (id, isCompleted, todo) => {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          todo,
          isCompleted,
        }),
      });

      if (response.ok) {
        const updatedTodos = todos.map((todoItem) =>
          todoItem.id === id ? { ...todoItem, isCompleted, todo } : todoItem
        );
        setTodos(updatedTodos);
      } else {
        console.error('Failed to update TODO');
      }
    } catch (error) {
      console.error('Error during TODO update:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      } else {
        console.error('Failed to delete TODO');
      }
    } catch (error) {
      console.error('Error during TODO deletion:', error);
    }
  };

  const handleModifyTodo = async (id, isCompleted, newTodo) => {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          todo: newTodo,
          isCompleted,
        }),
      });

      if (response.ok) {
        const updatedTodos = todos.map((todoItem) =>
          todoItem.id === id ? { ...todoItem, todo: newTodo } : todoItem
        );
        setTodos(updatedTodos);
      } else {
        console.error('Failed to update TODO');
      }
    } catch (error) {
      console.error('Error during TODO update:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch('/todos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        } else {
          console.error('Failed to fetch TODOs');
        }
      } catch (error) {
        console.error('Error during TODO fetching:', error);
      }
    }

    fetchTodos();
  }, []);

  return (
    <ul className="todo-list">
      <div className="input-container">
        <input
          data-testid="new-todo-input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button data-testid="new-todo-add-button" onClick={handleAddTodo}>
          추가
        </button>
      </div>
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            id={todo.id}
            todo={todo.todo}
            completed={todo.isCompleted}
            toggleTodo={handleToggleTodo}
            deleteTodo={handleDeleteTodo}
            modifyTodo={handleModifyTodo}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;
