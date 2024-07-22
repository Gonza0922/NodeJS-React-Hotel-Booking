import { useNavigate } from "react-router-dom";

function NavbarLRP() {
  const navigate = useNavigate();
  return (
    <nav>
      <div className="nav-wrapper deep-orange lighten-2">
        <div className="hotelscom-logo" onClick={() => navigate("/")}>
          Hotels.com
        </div>
      </div>
    </nav>
  );
}

export default NavbarLRP;
