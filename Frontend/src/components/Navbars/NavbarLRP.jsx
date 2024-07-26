import { useNavigate } from "react-router-dom";

function NavbarLRP() {
  const navigate = useNavigate();
  return (
    <nav className="nav-wrapper">
      <div className="hotelscom-logo" onClick={() => navigate("/")}>
        Hotels.com
      </div>
    </nav>
  );
}

export default NavbarLRP;
