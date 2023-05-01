import React, { useEffect }  from "react";
import PopupWithForm from './PopupWithForm';
import { useInput } from '../hooks/FormValidator.js';

function EditAvatarPopup({ isOpen, onUpdateAvatar, isLoading, ...commonProps }) {
  const ref = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: ref.current.value
    });
  }

  const avatar = useInput('', { isEmpty: false, isUrl: true });

  useEffect(() => {
    if (isOpen) {
      avatar.onChange({ target: { value: '' }});
      avatar.resetValidation();
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      {...commonProps}

      name="edit-avatar"
      title="Обновить аватар"

      inputValid={avatar.inputValid}
      isLoading={isLoading}
      submitText="Обновить"
      submitTextLoading="Обновление..."
      onSubmit={handleSubmit}
    >
      <label className="form__item">
        <input
          ref={ref}
          onChange={e => avatar.onChange(e)}
          onFocus={e => avatar.onFocus(e)}
          value={avatar.value}
          type="text"
          className={`form__input ${avatar.isDirty && (avatar.isEmpty || avatar.urlError) ? "form__input_type_error" : ""}`}
          placeholder="Ссылка на аватар"
          name="avatar"
          id="avatar-input"
          required
        />
        {avatar.isDirty &&
          (avatar.isEmpty
            ? <span className="form__input-error">Это обязательное поле</span>
            : (avatar.urlError && <span className="form__input-error">Здесь должна быть ссылка</span>)
          )
        }
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
