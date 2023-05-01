import React from 'react';
import headerLogo from '../images/header/header__logo.svg';
import { Link } from 'react-router-dom';


const Header = ({title, route, email, onClick}) => {
  return (
    <header className="header">
      <img src={headerLogo} className="header__logo" alt="Логотип Mesto Russia" />
      <div className='header__auth'>
        <p className='header__text'>{email}</p>
        <Link to={route} className='header__link' onClick={onClick}>{title}</Link>
      </div>
    </header>
  );
}

export default Header;
