import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInput, isPasswordMatch } from '../hooks/FormValidator.js';

import showPasswordImage from '../images/password/show_pass.svg';
import hidePasswordImage from '../images/password/hide_pass.svg';

function Register({ onRegister, isLoading }) {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  function handleEmailInput(event, onChange) {
    setEmail(event.target.value);
    onChange(event);
  };

  function handlePasswordInput(event, onChange) {
    setPassword(event.target.value);
    onChange(event);
  };

  function handleConfirmPasswordInput(event, onChange) {
    setConfirmPassword(event.target.value);
    onChange(event);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (mail.inputValid && pass.inputValid && confpass.inputValid) {
      onRegister(email, password);
    } else {
      console.log('Что-то пошло не так! Попробуйте еще раз.');
    }
  };

  const mail = useInput('', {
    isEmpty: false,
    isEmail: true
  });

  const pass = useInput('', {
    isEmpty: true,
    minLength: 6,
    isPasswordMatch: confirmPassword,
    togglePasswordVisibility: () => setIsPasswordVisible(!isPasswordVisible)
  }, password);

  const confpass = useInput('', {
    isEmpty: true,
    minLength: 6,
    isPasswordMatch: password,
    toggleConfirmPasswordVisibility: () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  });

  return (
    <section className='auth'>
      <h3 className='auth__title'>Регистрация</h3>
      <form
        className='auth__form'
        onSubmit={handleSubmit}
      >

        <label className="auth__item">
          <input
            className={`auth__input ${mail.isDirty && (mail.isEmpty || mail.emailError) ? "auth__input_type_error" : ""}`}
            type='email'
            name="mail"
            placeholder='Email'
            value={email}
            onChange={(event) => handleEmailInput(event, mail.onChange)}
            onFocus={mail.onFocus}
            autoComplete="off"
            required
          />
          {mail.isDirty &&
            (mail.isEmpty
              ? <span className="auth__input-error">Это обязательное поле</span>
              : (mail.emailError && <span className="auth__input-error">Введите корректный email</span>)
            )
          }
        </label>

        <label className="auth__item auth__password">
          <input
            className={`auth__input ${pass.isDirty && (pass.isEmpty || pass.minLengthError || !isPasswordMatch(password, confirmPassword)) ? "auth__input_type_error" : ""}`}
            type={isPasswordVisible ? "text" : "password"}
            name="pass"
            placeholder='Пароль'
            value={password}
            onChange={(event) => handlePasswordInput(event, pass.onChange)}
            onFocus={pass.onFocus}
            minLength="6"
            autoComplete="off"
            required
          />
          <div className="auth__password-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            <img
              className="auth__password-image"
              src={isPasswordVisible ? hidePasswordImage : showPasswordImage}
              alt={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            />
          </div>
          {pass.isDirty &&
            (pass.isEmpty
              ? <span className="auth__input-error">Это обязательное поле</span>
              : (pass.minLengthError && <span className="auth__input-error">Должно быть не менее 6 символов</span>)
              || (!isPasswordMatch(password, confirmPassword) && <span className="auth__input-error">Пароль не совпадает</span>)
            )
          }
        </label>

        <label className="auth__item auth__password">
          <input
            className={`auth__input ${confpass.isDirty && (confpass.isEmpty || confpass.minLengthError || !isPasswordMatch(password, confirmPassword)) ? "auth__input_type_error" : ""}`}
            type={isConfirmPasswordVisible ? "text" : "password"}
            name="confpass"
            placeholder='Повторите пароль'
            value={confirmPassword}
            onChange={(event) => handleConfirmPasswordInput(event, confpass.onChange)}
            onFocus={confpass.onFocus}
            minLength="6"
            autoComplete="off"
            required
          />
          <div className="auth__password-icon" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
            <img
              className="auth__password-image"
              src={isConfirmPasswordVisible ? hidePasswordImage : showPasswordImage}
              alt={isConfirmPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            />
          </div>
          {confpass.isDirty &&
            (confpass.isEmpty
              ? <span className="auth__input-error">Это обязательное поле</span>
              : (confpass.minLengthError && <span className="auth__input-error">Должно быть не менее 6 символов</span>)
              || (!isPasswordMatch(password, confirmPassword) && <span className="auth__input-error">Пароль не совпадает</span>)
            )
          }
        </label>

        <button
        className='auth__submit'
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

      </form>
      <p className='auth__btn-caption'>Уже зарегистрированы? <Link to="/signin" className='auth__link'>Войти</Link></p>
    </section>
  );
};

export default Register;
