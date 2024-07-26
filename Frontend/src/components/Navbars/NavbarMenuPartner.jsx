import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function NavbarMenuPartner({ navigation, profile, logout }) {
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
            {profile.first_name}
            <i className="material-icons right">arrow_drop_down</i>
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
              Change Password
            </a>
          </li>
          <li className="divider" tabIndex="-2"></li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </ul>
    </nav>
  );
}

export default NavbarMenuPartner;
