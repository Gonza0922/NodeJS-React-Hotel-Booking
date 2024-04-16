import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function NavbarMenu({ profile, logout }) {
  const navigate = useNavigate();

  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <nav>
      <div className="nav-wrapper deep-orange lighten-2">
        <a className="brand-logo left" onClick={() => navigate("/")}>
          Hotels.com
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <a className="dropdown-trigger" href="#!" data-target="dropdown1">
              {profile.first_name}
              <i className="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <ul id="dropdown1" className="dropdown-content">
            <li>
              <a onClick={() => navigate(`${navigation}/profile`)}>
                Profile Data
              </a>
            </li>
            <li className="divider" tabIndex="-1"></li>
            <li>
              <a onClick={() => navigate(`${navigation}/password`)}>
                Change Password
              </a>
            </li>
            <li className="divider" tabIndex="-1"></li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarMenu;
