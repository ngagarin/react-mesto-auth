import React from "react";
import PopupWithForm from './PopupWithForm';
import { useInput } from '../hooks/FormValidator.js';

function AddPlacePopup({ isOpen, onAddPlace, isLoading, ...commonProps }) {

  const place = useInput('', { isEmpty: true, minLength: 2 })
  const picture = useInput('', { isEmpty: true, isUrl: true });

  const [title, setTitle] = React.useState('');
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setLink('');
      place.resetValidation();
      picture.resetValidation();
    }
  }, [isOpen])

  function handleTitleChange(event, onChange) {
    setTitle(event.target.value);
    onChange(event);
  }

  function handleLinkChange(event, onChange) {
    setLink(event.target.value);
    onChange(event);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: title,
      link: link
    });
  }


  return (
    <PopupWithForm
      isOpen={isOpen}
      {...commonProps}

      name={'add-card'}
      title={'Новое место'}

      inputValid={place.inputValid && picture.inputValid}
      isLoading={isLoading}
      submitText='Сохранить'
      submitTextLoading='Сохранение...'
      onSubmit={handleSubmit}
    >
      <label className="form__item">
        <input
          onChange={(event) => handleTitleChange(event, place.onChange)}
          onFocus={place.onFocus}
          value={title}
          type="text"
          className={`form__input ${place.isDirty && (place.isEmpty || place.minLengthError || place.maxLengthError) ? "form__input_type_error" : ""}`}
          placeholder="Название места"
          name="place"
          id="place-input"
          minLength="2"
          maxLength="30"
          required
        />
        {place.isDirty &&
          (place.isEmpty
            ? <span className="form__input-error">Это обязательное поле</span>
            : ((place.minLengthError || place.maxLengthError) && <span className="form__input-error">Должно быть от 2 до 30 символов</span>)
          )
        }
      </label>

      <label className="form__item">
        <input
          onChange={(event) => handleLinkChange(event, picture.onChange)}
          onFocus={picture.onFocus}
          value={link}
          type="text"
          className={`form__input ${picture.isDirty && (picture.isEmpty || picture.urlError) ? "form__input_type_error" : ""}`}
          placeholder="Ссылка на картинку"
          name="picture"
          id="picture-input"
          required
        />
        {picture.isDirty &&
          (picture.isEmpty
            ? <span className="form__input-error">Это обязательное поле</span>
            : (picture.urlError && <span className="form__input-error">Здесь должна быть ссылка</span>)
          )
        }
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
