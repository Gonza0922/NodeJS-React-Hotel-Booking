import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useEffect } from "react";

function NavbarUserWithOutSearching() {
  const { logout, user } = useUserContext();
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
          <button
            className="nav-buttons"
            onClick={() => navigate(`/users/${user.first_name}/reservations`)}
          >
            Reservations
          </button>
        </li>
        <li>
          <a className="dropdown-trigger" href="#!" data-target="dropdown1">
            <div className="logo-initial">{user.first_name.split("")[0]}</div>
            {user.first_name} {user.last_name}
          </a>
        </li>
        <ul id="dropdown1" className="dropdown-content">
          <li>
            <a onClick={() => navigate(`/users/${user.first_name}/profile`)}>Profile Data</a>
          </li>
          <li className="divider" tabIndex="-1"></li>
          <li>
            <a onClick={() => navigate(`/users/${user.first_name}/password`)}>Password</a>
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

export default NavbarUserWithOutSearching;
