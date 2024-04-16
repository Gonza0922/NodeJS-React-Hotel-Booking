import { useNavigate } from "react-router-dom";

function NavbarLRP({ navigation }) {
  const navigate = useNavigate();
  return (
    <nav>
      <div className="nav-wrapper deep-orange lighten-2">
        <a className="brand-logo left" onClick={() => navigate(navigation)}>
          Hotels.com
        </a>
      </div>
    </nav>
  );
}

export default NavbarLRP;
