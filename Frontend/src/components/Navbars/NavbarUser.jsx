import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useHotelContext } from "../../context/HotelContext";
import {
  MyCommentIcon,
  MyLogoutIcon,
  MyPasswordIcon,
  MyPersonIcon,
  MySearchIcon,
} from "../Icons";

function NavbarUser() {
  const { logout, user } = useUserContext();
  const { hotelSearch, setHotelSearch, filtrar } = useHotelContext();
  const navigate = useNavigate();

  useEffect(() => {
    M.AutoInit();
  }, []);

  const handleClick = (e) => {
    setHotelSearch(e.target.value);
    filtrar(e.target.value);
  };

  return (
    <nav className="nav-wrapper">
      <div className="hotelscom-logo" onClick={() => navigate("/")}>
        Hotels.com
      </div>
      <form className="search-hotel">
        <div className="input-field">
          <input
            id="search"
            type="search"
            value={hotelSearch}
            placeholder="Where to?"
            onChange={handleClick}
            autoComplete="off"
            spellCheck={false}
          ></input>
          <MySearchIcon />
          <i
            className="material-icons"
            onClick={() => {
              setHotelSearch("");
              filtrar("");
            }}
          >
            close
          </i>
        </div>
      </form>
      <ul className="nav-wrapper_ul">
        <li>
          <a className="button-publish" onClick={() => navigate("/LoginPartner")}>
            Publish
          </a>
        </li>
        <li>
          <button
            className="nav-buttons"
            onClick={() => navigate(`/users/${user.first_name}/reservations`)}
          >
            Reservations
          </button>
        </li>
        <li>
          <a className="dropdown-trigger" href="#!" data-target="dropdown1">
            <div className="logo-initial">{user.first_name.split("")[0]}</div>
            {user.first_name} {user.last_name}
          </a>
        </li>
        <ul id="dropdown1" className="dropdown-content">
          <li>
            <MyPersonIcon />
            <a onClick={() => navigate(`/users/${user.first_name}/profile`)}>Manage Profile</a>
          </li>
          <li className="divider" tabIndex="-1"></li>
          <li>
            <MyPasswordIcon />
            <a onClick={() => navigate(`/users/${user.first_name}/password`)}>Password</a>
          </li>
          <li className="divider" tabIndex="-2"></li>
          <li>
            <MyCommentIcon />
            <a onClick={() => navigate(`/users/${user.first_name}/reviews`)}>Reviews</a>
          </li>
          <li className="divider" tabIndex="-3"></li>
          <li>
            <MyLogoutIcon />
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </ul>
    </nav>
  );
}

export default NavbarUser;
