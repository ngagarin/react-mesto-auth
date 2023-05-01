import React from "react";
import PopupWithForm from './PopupWithForm';
import { useInput } from '../hooks/FormValidator.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function EditProfilePopup({ isOpen, onUpdateUser, isLoading, ...commonProps }) {

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const currentUser = React.useContext(CurrentUserContext);


  React.useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
      login.resetValidation();
      about.resetValidation();
    }
  }, [currentUser, isOpen]);

  function handleNameChange(event, onChange) {
    setName(event.target.value);
    onChange(event); // вызываем onChange из useInput
  }

  function handleDescriptionChange(event, onChange) {
    setDescription(event.target.value);
    onChange(event);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      about: description
    });
  }

  const login = useInput('', { isEmpty: true, minLength: 2 })
  const about = useInput('', { isEmpty: true, minLength: 2 })

  return (
    <PopupWithForm
      isOpen={isOpen}
      {...commonProps}

      name='edit-profile'
      title='Редактировать профиль'

      inputValid={login.inputValid && about.inputValid}
      isLoading={isLoading}
      submitText='Сохранить'
      submitTextLoading='Сохранение...'
      onSubmit={handleSubmit}

    >
      <label className="form__item">
        <input
          onChange={(event) => handleNameChange(event, login.onChange)}
          onFocus={login.onFocus}
          value={name}
          type="text"
          className={`form__input ${login.isDirty && (login.isEmpty || login.minLengthError || login.maxLengthError) ? "form__input_type_error" : ""}`}
          placeholder='Имя'
          name="login"
          id="name-input"
          minLength="2"
          maxLength="40"
          required
        />
        {login.isDirty &&
          (login.isEmpty
            ? <span className="form__input-error">Это обязательное поле</span>
            : ((login.minLengthError || login.maxLengthError) && <span className="form__input-error">Должно быть от 2 до 40 символов</span>)
          )
        }
      </label>

      <label className="form__item">
        <input
          onChange={(event) => handleDescriptionChange(event, about.onChange)}
          onFocus={about.onFocus}
          value={description}
          type="text"
          className={`form__input ${about.isDirty && (about.isEmpty || about.minLengthError || about.maxLengthError) ? "form__input_type_error" : ""}`}
          placeholder='О себе'
          name="about"
          id="about-input"
          minLength="2"
          maxLength="200"
          required
        />
        {about.isDirty &&
          (about.isEmpty
            ? <span className="form__input-error">Это обязательное поле</span>
            : ((about.minLengthError || about.maxLengthError) && <span className="form__input-error">Должно быть от 2 до 200 символов</span>)
          )
        }
      </label>
    </PopupWithForm>
  )
}

export default EditProfilePopup;
