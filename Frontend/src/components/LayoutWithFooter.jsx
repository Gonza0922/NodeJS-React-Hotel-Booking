import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function LayoutWithFooter() {
  return (
    <div className="layout-with-footer">
      <Outlet />
      <Footer />
    </div>
  );
}

export default LayoutWithFooter;
