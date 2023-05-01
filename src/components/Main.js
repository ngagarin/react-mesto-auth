import React, { useEffect } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import profileAvatar from '../images/profile/programmist.jpeg';

function Main({ onEditProfile, onEditAvatar, onAddPlace, cards, onCardClick, onCardLike, onConfirmCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>

      <section className="profile content__media">
        <button onClick={onEditAvatar} className="profile__avatar-edit-button" type="button">
          <img src={currentUser.avatar ? currentUser.avatar : profileAvatar} alt="Аватар для профайла" className="profile__avatar" />
        </button>
        <div className="profile__info">
          <div className="profile__name-info">
            <h1 className="profile__name">{currentUser.name ? currentUser.name : 'Николай Гагарин'}</h1>
            <button onClick={onEditProfile} className="profile__button profile__button_type_edit" type="button"></button>
          </div>
          <p className="profile__about">{currentUser.about ? currentUser.about : 'Студент Яндекс.Практикум'}</p>
        </div>
        <button onClick={onAddPlace} className="profile__button profile__button_type_add" type="button"></button>
      </section>

      <section className="cards content__media">
        <ul className="cards__element">
          {
            cards.map((card) =>
              <Card
                card={card}
                key={card._id}
                name={card.name}
                link={card.link}
                likes={card.likes.length}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onConfirmCardDelete={onConfirmCardDelete}
              />
            )
          }
        </ul>
      </section>

    </main>
  )
};

export default Main;
