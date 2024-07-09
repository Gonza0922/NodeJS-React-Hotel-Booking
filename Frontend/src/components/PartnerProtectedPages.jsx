import { Outlet, Navigate } from "react-router-dom";
import { usePartnerContext } from "../context/PartnerContext";

function PartnerProtectedPages() {
  const { isAuthenticatedPartner, loading } = usePartnerContext();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticatedPartner) return <Navigate to={"/LoginPartner"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default PartnerProtectedPages;
