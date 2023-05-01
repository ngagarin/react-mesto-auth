import React from 'react';
import headerLogo from '../images/header/header__logo.svg';

function Header() {
  return (
    <header className="header">
      <img src={headerLogo} className="header__logo" alt="Логотип Mesto Russia" />
    </header>
  );
}

export default Header;

