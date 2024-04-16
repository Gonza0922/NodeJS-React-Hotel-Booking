import { useNavigate } from "react-router-dom";

function NavbarWithOutSearching() {
  const navigate = useNavigate();

  return (
    <nav>
      <div className="nav-wrapper deep-orange lighten-2">
        <a className="brand-logo left" onClick={() => navigate("/")}>
          Hotels.com
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <a onClick={() => navigate("/loginProperty")}>Publish</a>
          </li>
          <li>
            <a
              className="waves-effect waves-light btn"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
          </li>
          <li>
            <a
              className="waves-effect waves-light btn"
              onClick={() => navigate("/register")}
            >
              Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarWithOutSearching;
