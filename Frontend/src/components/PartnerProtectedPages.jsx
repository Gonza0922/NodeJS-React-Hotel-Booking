import { Outlet, Navigate } from "react-router-dom";
import { usePartnerContext } from "../context/PartnerContext";

function PartnerProtectedPages() {
  const { isAuthenticatedPartner } = usePartnerContext();

  if (!isAuthenticatedPartner)
    return <Navigate to={"/loginProperty"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default PartnerProtectedPages;
