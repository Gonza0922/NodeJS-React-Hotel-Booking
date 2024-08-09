import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function LayoutWithFooter() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

export default LayoutWithFooter;
