import { useNavigate } from "react-router-dom";
import { useHotelContext } from "../../context/HotelContext.jsx";

function Navbar() {
  const { hotelSearch, setHotelSearch, filtrar } = useHotelContext();
  const navigate = useNavigate();

  const handleClick = (e) => {
    setHotelSearch(e.target.value);
    filtrar(e.target.value);
  };

  return (
    <nav>
      <div className="nav-wrapper deep-orange lighten-2">
        <div className="hotelscom-logo" onClick={() => navigate("/")}>
          Hotels.com
        </div>
        <form className="search-form">
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
            <label className="label-icon">
              <i className="material-icons">search</i>
            </label>
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
        <ul id="nav-mobile">
          <li>
            <a onClick={() => navigate("/LoginPartner")}>Publish</a>
          </li>
          <li>
            <a className="waves-effect waves-light btn" onClick={() => navigate("/login")}>
              Login
            </a>
          </li>
          <li>
            <a className="waves-effect waves-light btn" onClick={() => navigate("/register")}>
              Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
