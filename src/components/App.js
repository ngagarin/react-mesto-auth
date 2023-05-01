import React, { useState, useEffect } from "react";

import Main from './Main';
import Header from './Header';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import ImagePopup from './ImagePopup';

import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false)
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = React.useState(null)
  const [selectedCard, setSelectedCard] = React.useState(null)

  const [currentUser, setCurrentUser] = React.useState({})
  const [cards, setCards] = useState([]);

  const [isLoading, setLoading] = React.useState(false)

  useEffect(() => {
    Promise.all([
      api.getUserInfo(),
      api.getInitialCards()])
      .then((values) => {
        setCurrentUser(values[0]);
        setCards([...values[1]]);
      }).catch((err) => {
        console.error(err);
      })
  }, [])

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleConfimationClick(card) {
    setConfirmationPopupOpen(card);
  }

  function handleUpdateAvatar(data) {
    setLoading(true);
    api.updateProfileAvatar(data)
      .then(newAvatar => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      }).finally(() => { setLoading(false) });
  }

  function handleUpdateUser(data) {
    setLoading(true);
    api.updateUserInfo(data)
      .then(updatedUser => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      }).finally(() => { setLoading(false) });
  }

  function handleAddPlaceSubmit(data) {
    setLoading(true);
    api.addNewCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    }).finally(() => { setLoading(false) });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    (isLiked ? api.deleteCardLike(card._id) : api.addCardLike(card._id))
      .then((newCard) => setCards((state) => state.map((c) => (c._id === card._id ? newCard : c))))
      .catch((err) => console.error(err));
  }

  function handleCardDelete(card) {
    setLoading(true);
    api.removeCard(card._id)
      .then(res => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      }).finally(() => { setLoading(false) });
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setConfirmationPopupOpen(null);
  }

  function closePopupWithEsc(event) {
    if (event.key === 'Escape') {
      closeAllPopups();
    }
  }

  function closePopupWithClickOnOverlay(event) {
    if (event.target.classList.contains('popup_opened')) {
      closeAllPopups();
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

        <Main
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}

          cards={cards}
          onCardClick={handleCardClick}
          onConfirmCardDelete={handleConfimationClick}
          onCardLike={handleCardLike}
        />

        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onCloseEsc={closePopupWithEsc}
          onCloseOverlay={closePopupWithClickOnOverlay}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onCloseEsc={closePopupWithEsc}
          onCloseOverlay={closePopupWithClickOnOverlay}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onCloseEsc={closePopupWithEsc}
          onCloseOverlay={closePopupWithClickOnOverlay}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />

        <ConfirmationPopup
          card={isConfirmationPopupOpen}
          onClose={closeAllPopups}
          onCloseEsc={closePopupWithEsc}
          onCloseOverlay={closePopupWithClickOnOverlay}
          onCardDelete={handleCardDelete}
          isLoading={isLoading}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onCloseEsc={closePopupWithEsc}
          onCloseOverlay={closePopupWithClickOnOverlay}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
