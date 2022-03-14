import logo from '../images/logo.svg'
import { Link } from 'react-router-dom'

function Header(props) {
  return (
    <header className="header">
      <img className="header__image" src={logo} alt="Логотип" />
        <nav className="header__list">
          <p className="header__title_user">{props.userEmail}</p>
          <Link to={props.link} style={{ textDecoration: 'none' }}>
          <p onClick={props.logoutLogin} className="header__title">{props.title}</p>
      </Link>
        </nav>
    </header>
)}

export default Header;
