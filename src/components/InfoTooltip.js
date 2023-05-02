import { useEffect } from 'react';

function InfoTooltip({ authStatus, isOpen, onClose, onCloseEsc, onCloseOverlay }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('page_type_hidden');
      document.addEventListener('keydown', onCloseEsc);
      document.addEventListener('mousedown', onCloseOverlay);
    } else {
      document.body.classList.remove('page_type_hidden');
      document.removeEventListener('keydown', onCloseEsc);
      document.removeEventListener('mousedown', onCloseOverlay);
    }
  }, [isOpen])

  return (
    <section className={`popup popup_type_infoTooltip ${isOpen && 'popup_opened'}`}>
      <figure className="popup__content">
        <button onClick={onClose} className="popup__close-button" type="button"></button>
        <img src={authStatus.image} alt={`Информационное сообщение: ${authStatus.message}`} className="popup__icon" />
        <figcaption className="popup__icon-caption">{authStatus.message}</figcaption>
      </figure>
    </section>
  );
};

export default InfoTooltip;
