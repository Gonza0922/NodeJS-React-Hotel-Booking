import { useState, useEffect, createContext, useContext } from "react";
import {
  registerRequest,
  loginRequest,
  logoutRequest,
  verifyTokenRequest,
} from "../api/auth.api";
import Cookie from "js-cookie";

const partnerContext = createContext();

export function usePartnerContext() {
  return useContext(partnerContext);
}

const PartnerProvider = (props) => {
  const [partner, setPartner] = useState({});
  const [error, setError] = useState([]);
  const [isAuthenticatedPartner, setIsAuthenticatedPartner] = useState(false);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [elementView, setElementView] = useState({
    reservationsNumber: null,
    confirmDelete: null,
  });
  const [styles, setStyles] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const role = "partners";

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const login = async (partner) => {
    try {
      const data = await loginRequest({ ...partner, role });
      setPartner(data);
      setIsAuthenticatedPartner(true);
      console.log(data);
    } catch (error) {
      console.error(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const signUp = async (partner) => {
    try {
      const data = await registerRequest({ ...partner, role });
      setPartner(data);
      setIsAuthenticatedPartner(true);
      console.log(data);
      return true;
    } catch (error) {
      console.error(error);
      const e = error.response.data;
      e.message ? setError(e.message[0]) : setError(e.error);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest({ role });
      Cookie.remove("token");
      setPartner({});
      setIsAuthenticatedPartner(false);
      setBookings([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const cookies = Cookie.get();
      if (!cookies.PartnerToken) {
        setIsAuthenticatedPartner(false);
        setLoading(false);
        return;
      }
      try {
        const partner = await verifyTokenRequest(cookies.UserToken);
        if (!partner) {
          setIsAuthenticatedPartner(false);
        } else {
          setIsAuthenticatedPartner(true);
          setPartner(partner);
        }
      } catch (error) {
        setIsAuthenticatedPartner(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const showReservationsNumber = (id) => {
    setElementView((prevElement) => ({
      ...prevElement,
      reservationsNumber: id === elementView.reservationsNumber ? null : id,
    }));
  };

  return (
    <partnerContext.Provider
      value={{
        partner,
        setPartner,
        signUp,
        login,
        logout,
        isAuthenticatedPartner,
        error,
        setError,
        users,
        setUsers,
        bookings,
        setBookings,
        elementView,
        setElementView,
        styles,
        setStyles,
        showReservationsNumber,
        confirmDelete,
        setConfirmDelete,
        loading,
      }}
    >
      {props.children}
    </partnerContext.Provider>
  );
};

export default PartnerProvider;
