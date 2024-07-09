import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

function UserProtectedPages() {
  const { isAuthenticated, loading } = useUserContext();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to={"/login"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default UserProtectedPages;
