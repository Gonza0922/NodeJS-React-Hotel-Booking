import { useNavigate } from "react-router-dom";

function NavbarWithOutSearching() {
  const navigate = useNavigate();

  return (
    <nav className="nav-wrapper">
      <div className="hotelscom-logo" onClick={() => navigate("/")}>
        Hotels.com
      </div>
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

export default NavbarWithOutSearching;
