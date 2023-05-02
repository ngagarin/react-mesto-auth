import React from 'react';
import headerLogo from '../images/header/header__logo.svg';
import { Link } from 'react-router-dom';

const Header = ({ userEmail, handleLogOut, buttonText, isNavMenuOpen, handleNavMenuOpen, route, title, hideNavItem, hideNavLink}) => {
  return (
    <header className="header">
      <img src={headerLogo} className="header__logo" alt="Логотип Mesto Russia" />
      <nav className="nav-menu">
        {!hideNavItem && <p className="nav-menu__user-name nav-menu__user-name_low-res-hidden">{userEmail}</p>}
        {!hideNavItem && <button className="nav-menu__button nav-menu__button_low-res-hidden" onClick={handleLogOut} type="button">
          {buttonText}
        </button>}
        {!hideNavItem && <button className={`nav-popup__button ${isNavMenuOpen ? "nav-popup__button_is-open" : ""}`} onClick={handleNavMenuOpen} type="button" />}
        {!hideNavLink && <Link to={route} className="nav-menu__link">{title}</Link>}
      </nav>
    </header>
  );
}

export default Header;

//{props.children}
