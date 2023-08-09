import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Todo() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Todo</h1>
    </div>
  );
}

export default Todo;
