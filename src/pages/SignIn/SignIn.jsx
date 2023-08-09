import React, { useState } from 'react';
import useValidation from '../../hooks/useValidation';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
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

  return (
    <div className="signin-container">
      <h2>로그인</h2>
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
        className="login-button"
        data-testid="signin-button"
        onClick={() => {
          console.log('abled');
        }}
        disabled={!handleValidation()}
      >
        로그인
      </button>
      <button className="signup-button" onClick={() => navigate('/signup')}>
        회원가입하러 가기
      </button>
    </div>
  );
}

export default SignIn;
