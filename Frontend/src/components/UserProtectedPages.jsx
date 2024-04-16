import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

function UserProtectedPages() {
  const { isAuthenticated } = useUserContext();

  if (!isAuthenticated) return <Navigate to={"/login"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default UserProtectedPages;
