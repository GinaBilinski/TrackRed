// src/components/Footer.tsx

import logo from "/src/assets/images/logoWite.svg";
import { Link } from "react-router-dom";
import "./../styles/components/_footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <img src={logo} alt="TrackRed Logo" className="footer__logo" />
        <div className="footer__info">
          <h3>Blutwerte</h3>
          <p>einfach und sicher verwalten</p>
        </div>
      </div>

      <div className="footer__right">
        <Link to="/kontakt">Kontakt</Link>
        <Link to="/datenschutz">Datenschutz</Link>
        <Link to="/impressum">Impressum</Link>
      </div>
    </footer>
  );
}

export default Footer;
