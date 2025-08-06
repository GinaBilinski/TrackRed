// src/components/Navbar.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import menuIcon from "/src/assets/icons/menu.svg";
import closeIcon from "/src/assets/icons/close.svg";
import { useAuth } from "../context/AuthContext";
import logo from "/src/assets/images/logoRed.svg";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, openModal } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar__left">
          <Link to="/">
            <img src={logo} alt="TrackRed Logo" className="navbar__logo" />
          </Link>
        </div>

        <div className="navbar__menu-icon" onClick={toggleMenu}>
          <img src={menuOpen ? closeIcon : menuIcon} alt="Menü öffnen" />
        </div>

        <div className={`navbar__right ${menuOpen ? "open" : ""}`}>
          <ul className="navbar__nav">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/hinzufuegen">Hinzufügen</NavLink>
            </li>
            <li>
              <NavLink to="/untersuchungen">Untersuchungen</NavLink>
            </li>
            <li>
              <NavLink to="/werte">Werte</NavLink>
            </li>
          </ul>

          <div className="navbar__cta">
            {user ? (
              <button className="navbar__login" onClick={logout}>
                Logout
              </button>
            ) : (
              <button className="navbar__login" onClick={openModal}>
                Login / Registrieren
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
