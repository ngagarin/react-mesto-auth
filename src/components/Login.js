import { useState } from 'react';
import { useInput } from '../hooks/FormValidator.js';

import showPasswordImage from '../images/password/show_pass.svg';
import hidePasswordImage from '../images/password/hide_pass.svg';

function Login({ onLogin, isLoading }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handlePasswordInput(event, onChange) {
    setPassword(event.target.value);
    onChange(event);
  };

  function handleEmailInput(event, onChange) {
    setEmail(event.target.value);
    onChange(event);
  };

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  };

  const mail = useInput('', {
    isEmpty: false,
    isEmail: true
  });

  const pass = useInput('', {
    isEmpty: true,
    minLength: 6
  });

  const inputValid = mail.inputValid && pass.inputValid;

  return (
    <section className='auth'>
      <h3 className='auth__title'>Вход</h3>

      <form
        className='auth__form'
        onSubmit={handleSubmit}
      >

        <label className="auth__item">
          <input
            className={`auth__input ${mail.isDirty && (mail.isEmpty || mail.emailError) ? "auth__input_type_error" : ""}`}
            type='email'
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

        <label className='auth__item  auth__password'>
          <input
            className={`auth__input ${pass.isDirty && (pass.isEmpty || pass.minLengthError) ? "auth__input_type_error" : ""}`}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='Пароль'
            name='password'
            value={password}
            onChange={(event) => handlePasswordInput(event, pass.onChange)}
            onFocus={pass.onFocus}
            minLength="6"
            autoComplete="off"
            required
          />
          <div className='auth__password-icon' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            <img
              className='auth__password-image'
              src={isPasswordVisible ? hidePasswordImage : showPasswordImage}
              alt={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            />
          </div>
          {pass.isDirty &&
            (pass.isEmpty
              ? <span className="auth__input-error">Это обязательное поле</span>
              : (pass.minLengthError && <span className="auth__input-error">Должно быть не менее 6 символов</span>)
            )
          }
        </label>

        <button
          className={`auth__submit ${!inputValid ? "auth__submit_disabled" : ""}`}
          type="submit"
          disabled={!inputValid}
        >
          {isLoading ? "Авторизация..." : "Войти"}
        </button>

      </form>

    </section>
  );
}

export default Login;
