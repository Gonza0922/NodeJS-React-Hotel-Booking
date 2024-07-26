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
    </nav>
  );
}

export default NavbarWithOutSearching;
