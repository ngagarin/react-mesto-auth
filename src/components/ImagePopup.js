import { useEffect } from 'react';

function ImagePopup({ card, onClose, onCloseEsc, onCloseOverlay }) {
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

  return (
    <section className={`popup popup_type_image ${card ? 'popup_opened' : ""}`} >
      <figure className="popup__image-conteiner">
        <button onClick={onClose} className="popup__close-button popup__close-button_type_image" type="button"></button>
        <img src={card ? card.link : ''} alt={card ? `Фотография. ${card.name}` : ''} className="popup__image" />
        <figcaption className="popup__image-caption">{card ? card.name : ''}</figcaption>
      </figure>
    </section>
  );
};

export default ImagePopup;

