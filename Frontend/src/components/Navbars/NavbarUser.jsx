import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useHotelContext } from "../../context/HotelContext";
import SearchIcon from "@mui/icons-material/Search";

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
          <SearchIcon className="search-icon" />
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
            {user.first_name}
            <i className="material-icons right">arrow_drop_down</i>
          </a>
        </li>
        <ul id="dropdown1" className="dropdown-content">
          <li>
            <a onClick={() => navigate(`/users/${user.first_name}/profile`)}>Profile Data</a>
          </li>
          <li className="divider" tabIndex="-1"></li>
          <li>
            <a onClick={() => navigate(`/users/${user.first_name}/password`)}>Change Password</a>
          </li>
          <li className="divider" tabIndex="-2"></li>
          <li>
            <a onClick={() => navigate(`/users/${user.first_name}/reviews`)}>Reviews</a>
          </li>
          <li className="divider" tabIndex="-3"></li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </ul>
    </nav>
  );
}

export default NavbarUser;
