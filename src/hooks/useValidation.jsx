import { useState } from 'react';

const useValidation = (setEmail, setPassword) => {
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    setEmailError(isValid ? '' : '유효한 이메일을 입력하세요.');
    return isValid;
  };

  const validatePassword = (password) => {
    const isValid = password.length >= 8;
    setPasswordError(isValid ? '' : '비밀번호는 8자 이상이어야 합니다.');
    return isValid;
  };

  const handleValidation = () => {
    if (emailError === '' && passwordError === '') {
      return true;
    }
    return false;
  };

  const onChangeEmail = (e) => {
    const typed_email = e.target.value;
    setEmail(typed_email);
    const validate_message = validateEmail(typed_email)
      ? ''
      : '이메일 형식이 올바르지 않습니다.';
    setEmailError(validate_message);
  };

  const onChangePassword = (e) => {
    const typed_password = e.target.value;
    setPassword(typed_password);
    const validate_message = validatePassword(typed_password)
      ? ''
      : '패스워드는 8자 이상이어야 합니다.';
    setPasswordError(validate_message);
  };

  return [
    onChangeEmail,
    onChangePassword,
    emailError,
    passwordError,
    handleValidation,
  ];
};

export default useValidation;
