import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, name, link, likes, onCardClick, onCardLike, onConfirmCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleConfirmClick() {
    onConfirmCardDelete(card);
  }

  return (
    <li className="card">
      <img onClick={handleClick} src={link} alt={name} className="card__picture" />

      <div className="card__info">
        <h2 className="card__title">{name}</h2>
        <div>
          <button className={`card__like-button ${isLiked && 'card__like-button_active'}`} type="button" onClick={handleLikeClick}></button>
          <p className="card__likes-counter">{likes}</p>
        </div>
      </div>
      <button className={`${isOwn && 'card__delete'}`} type="button" onClick={handleConfirmClick}></button>
    </li>
  )
}

export default Card;
