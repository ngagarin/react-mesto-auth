import { useEffect } from 'react';

function ConfirmationPopup({ card, onClose, onCloseEsc, onCloseOverlay, onCardDelete, isLoading }) {
  useEffect(() => {
    if (card) {
      document.body.classList.add('page_type_hidden');
      document.addEventListener('keydown', onCloseEsc);
      document.addEventListener('mousedown', onCloseOverlay);
    } else {
      document.body.classList.remove('page_type_hidden');
      document.removeEventListener('keydown', onCloseEsc);
      document.removeEventListener('mousedown', onCloseOverlay);
    }
  }, [card])

  function handleDeleteClick(e) {
    e.preventDefault();
    onCardDelete(card);
    onClose();
  }

  return (
    <div className={`popup popup_type_confirmation' ${card ? `popup_opened` : ""}`}>
      <div className="popup__content">
        <button onClick={onClose} className="popup__close-button" type="button" aria-label="Закрыть окно" />
        <h2 className="popup__header">Удалить карточку?</h2>
        <form name={`edit-confirmation-form`} className="form form_type_delete-card" noValidate >
          <button onClick={handleDeleteClick} className="form__submit" type="submit" aria-label="Удалить карточку">{isLoading ? "Удаление..." : "Да"}</button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
