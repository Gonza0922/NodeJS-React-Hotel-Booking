import { useNavigate } from "react-router-dom";

function NavbarWithOutSearching() {
  const navigate = useNavigate();

  return (
    <nav>
      <div className="nav-wrapper deep-orange lighten-2">
        <div className="hotelscom-logo" onClick={() => navigate("/")}>
          Hotels.com
        </div>
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

export default NavbarWithOutSearching;
