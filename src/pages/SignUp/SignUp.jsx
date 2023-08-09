import React, { useState, useEffect } from 'react';
import useValidation from '../../hooks/useValidation';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [
    onChangeEmail,
    onChangePassword,
    emailError,
    passwordError,
    handleValidation,
  ] = useValidation(setEmail, setPassword);

  const handleSignUp = async () => {
    if (handleValidation()) {
      try {
        const response = await fetch('/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (response.status === 201) {
          console.log('Signup successful!');
          navigate('/signin');
        } else {
          console.error('Signup failed.');
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      navigate('/todo');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <div className="input-container">
        <label>Email:</label>
        <input
          type="text"
          data-testid="email-input"
          value={email}
          onChange={onChangeEmail}
        />
        <p className="error-message">{emailError}</p>
      </div>
      <div className="input-container">
        <label>Password:</label>
        <input
          type="password"
          data-testid="password-input"
          value={password}
          onChange={onChangePassword}
        />
        <p className="error-message">{passwordError}</p>
      </div>
      <button
        className="signup-button"
        data-testid="signup-button"
        onClick={handleSignUp}
        disabled={!handleValidation()}
      >
        회원가입
      </button>
      <button className="login-link" onClick={() => navigate('/signin')}>
        로그인하러 가기
      </button>
    </div>
  );
}

export default SignUp;
