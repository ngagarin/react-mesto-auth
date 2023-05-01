import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

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

import { signUp, signIn, checkToken } from '../utils/apiAuth';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

import checkmarkImg from '../images/auth/checkmark.svg'
import crossImg from '../images/auth/cross.svg'


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)

  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([]);

  const [isLoading, setLoading] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailValue, setEmailValue] = useState(null);
  const [popupStatus, setPopupStatus] = useState({ image: '', message: '' });
  const [infoTooltip, setInfoTooltip] = useState(false);
  const navigate = useNavigate();

  function handleLogin(email, password) {
    setLoading(true);
    signIn(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setIsLoggedIn(true);
        setEmailValue(email);
        navigate("/");
      })
      .catch(() => {
        setPopupStatus({ image: crossImg, message: 'Что-то пошло не так! Попробуйте еще раз.' });
        handleInfoTooltip();
      }).finally(() => { setLoading(false) });
  };

  function handleRegister(email, password) {
    setLoading(true);
    signUp(email, password)
      .then(() => {
        setPopupStatus({ image: checkmarkImg, message: 'Вы успешно зарегистрировались!' });
        navigate("/signin");
      })
      .catch(() => {
        setPopupStatus({ image: crossImg, message: 'Что-то пошло не так! Попробуйте еще раз.' });
      })
      .finally(() => {
        setLoading(false);
        handleInfoTooltip();
      });
  };

  function handleLogOut() {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    setEmailValue(null);
    navigate("/signin");
  };

  function handleInfoTooltip() {
    setInfoTooltip(true);
  };

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      checkToken(jwt)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setEmailValue(res.data.email);
            navigate('/');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

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
    setInfoTooltip(false);
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

        <Routes>
          <Route exact path='/'
            element={
              <>
                <Header
                  title='Выйти'
                  route=''
                  email={emailValue}
                  onClick={handleLogOut}
                />
                <ProtectedRoute
                  component={Main}
                  isLoggedIn={isLoggedIn}

                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}

                  cards={cards}
                  onCardClick={handleCardClick}
                  onConfirmCardDelete={handleConfimationClick}
                  onCardLike={handleCardLike}
                />
              </>
            }
          />

          <Route path='/signup'
            element={
              <>
                <Header
                  title='Войти'
                  route='/signin'
                />
                <Register
                  onRegister={handleRegister}
                  isLoading={isLoading}
                />
              </>
            }
          />

          <Route path='/signin'
            element={
              <>
                <Header
                  title='Регистрация'
                  route='/signup'
                />
                <Login
                  onLogin={handleLogin}
                  isLoading={isLoading}
                />
              </>
            }
          />

          <Route exact path="*"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />
            }
          />
        </Routes>

        <Footer />

        <InfoTooltip
          popupStatus={popupStatus}
          isOpen={infoTooltip}
          onClose={closeAllPopups}
          onCloseEsc={closePopupWithEsc}
          onCloseOverlay={closePopupWithClickOnOverlay}
        />

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
