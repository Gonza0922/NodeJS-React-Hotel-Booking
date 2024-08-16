import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function NavbarMenu({ navigation, profile, logout }) {
  const navigate = useNavigate();

  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <nav className="nav-wrapper">
      <div className="hotelscom-logo" onClick={() => navigate("/")}>
        Hotels.com
      </div>
      <ul className="nav-wrapper_ul">
        <li>
          <a className="dropdown-trigger" href="#!" data-target="dropdown1">
            <div className="logo-initial">{profile.first_name.split("")[0]}</div>
            {profile.first_name} {profile.last_name}
          </a>
        </li>
        <ul id="dropdown1" className="dropdown-content">
          <li>
            <a onClick={() => navigate(`/${navigation}/${profile.first_name}/profile`)}>
              Profile Data
            </a>
          </li>
          <li className="divider" tabIndex="-1"></li>
          <li>
            <a onClick={() => navigate(`/${navigation}/${profile.first_name}/password`)}>
              Password
            </a>
          </li>
          <li className="divider" tabIndex="-2"></li>
          <li>
            <a onClick={() => navigate(`/${navigation}/${profile.first_name}/reviews`)}>
              Reviews
            </a>
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

export default NavbarMenu;
