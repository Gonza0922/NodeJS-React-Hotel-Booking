import { Outlet } from "react-router-dom";
import { useHotelContext } from "../context/HotelContext";

function ErrorHandling() {
  const { redirect, errorRedirect } = useHotelContext();

  if (redirect) return <h1>{errorRedirect}</h1>;

  return (
    <>
      <Outlet />
    </>
  );
}

export default ErrorHandling;
