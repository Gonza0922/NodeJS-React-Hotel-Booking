import { useNavigate } from "react-router-dom";
import { useHotelContext } from "../../context/HotelContext.jsx";
import { MySearchIcon } from "../Icons.jsx";

function Navbar() {
  const { hotelSearch, setHotelSearch, filtrar } = useHotelContext();
  const navigate = useNavigate();

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
          <a onClick={() => navigate("/LoginPartner")}>Publish</a>
        </li>
        <li>
          <button className="nav-buttons" onClick={() => navigate("/login")}>
            Login
          </button>
        </li>
        <li>
          <button className="nav-buttons" onClick={() => navigate("/register")}>
            Register
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
