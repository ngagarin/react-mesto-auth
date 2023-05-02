import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Main from './Main';
import Header from './Header';
import NavMenu from './NavMenu';
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

  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailValue, setEmailValue] = useState(null);
  const [authStatus, setAuthStatus] = useState({ image: '', message: '' });
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
        setAuthStatus({ image: crossImg, message: 'Что-то пошло не так! Попробуйте еще раз.' });
        handleInfoTooltip();
      }).finally(() => { setLoading(false) });
  };

  function handleRegister(email, password) {
    setLoading(true);
    signUp(email, password)
      .then(() => {
        setAuthStatus({ image: checkmarkImg, message: 'Вы успешно зарегистрировались!' });
        navigate("/sign-in");
      })
      .catch(() => {
        setAuthStatus({ image: crossImg, message: 'Что-то пошло не так! Попробуйте еще раз.' });
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
    navigate("/sign-in");
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

  const handleNavMenuOpen = () => {
    setIsNavMenuOpen(!isNavMenuOpen);
    ;
  }

  document.body.classList.add('page');

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>

        <Routes>

          <Route exact path='/'
            element={
              <>
                <NavMenu
                  isNavMenuOpen={isNavMenuOpen}
                  userEmail={emailValue}
                  onClick={handleLogOut}
                />
                <Header
                  buttonText='Выйти'
                  userEmail={emailValue}
                  handleLogOut={handleLogOut}
                  isNavMenuOpen={isNavMenuOpen}
                  handleNavMenuOpen={handleNavMenuOpen}
                  hideNavLink={true}
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
                <Footer />
              </>
            }
          />

          <Route path='/sign-up'
            element={
              <>
                <Header
                  isNavMenuOpen={isNavMenuOpen}
                  title='Войти'
                  route='/sign-in'
                  hideNavItem={true}
                />
                <Register
                  onRegister={handleRegister}
                  isLoading={isLoading}
                />
              </>
            }
          />

          <Route path='/sign-in'
            element={
              <>
                <Header
                  isNavMenuOpen={isNavMenuOpen}
                  title='Регистрация'
                  route='/sign-up'
                  hideNavItem={true}
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
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />

        </Routes>

        <InfoTooltip
          authStatus={authStatus}
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

      </>
    </CurrentUserContext.Provider>
  );
}

export default App;
