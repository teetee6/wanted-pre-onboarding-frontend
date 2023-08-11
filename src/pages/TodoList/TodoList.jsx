import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoList.css'; // Import your CSS file

function TodoItem({ id, todo, completed, updateTodo }) {
  const handleCheckboxChange = () => {
    updateTodo(id, !completed, todo);
  };

  return (
    <li className={`todo-item ${completed ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
        />
        <span>{todo}</span>
      </label>
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

  const handleUpdateTodo = async (id, isCompleted, todo) => {
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
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, isCompleted } : todo
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
        // console.log(todo);
        // todo.userId 활용해서 수정,삭제 권한 부여
        return (
          <TodoItem
            key={todo.id}
            id={todo.id}
            todo={todo.todo}
            completed={todo.isCompleted}
            updateTodo={handleUpdateTodo}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;
