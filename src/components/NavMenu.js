import React from "react";

function NavMenu({isNavMenuOpen, userEmail, onClick}){
  return (
    <div className={`nav-popup ${isNavMenuOpen ? "nav-popup_is-open" : ""}`}>
        <p className="nav-menu__user-name">{userEmail}</p>
        <button
          className="nav-menu__button"
          onClick={onClick}
          type="button"
        >
          Выйти
        </button>
      </div>
  )
}

export default NavMenu;
