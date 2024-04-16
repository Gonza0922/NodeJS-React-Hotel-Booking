import { useState, useEffect, createContext, useContext } from "react";
import {
  registerPartnerRequest,
  loginPartnerRequest,
  logoutPartnerRequest,
} from "../api/partner.api";
import Cookie from "js-cookie";
import { verifyTokenPartnerRequest } from "../api/partner.api";

const partnerContext = createContext();

export function usePartnerContext() {
  return useContext(partnerContext);
}

const PartnerProvider = (props) => {
  const [partner, setPartner] = useState({});
  const [error, setError] = useState([]);
  const [isAuthenticatedPartner, setIsAuthenticatedPartner] = useState(false);
  const [users, setUsers] = useState([]);
  const [reserved, setReserved] = useState([]);
  const [elementView, setElementView] = useState({
    reservationsNumber: null,
    confirmDelete: null,
  });
  const [styles, setStyles] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      const data = await loginPartnerRequest(partner);
      setPartner(data);
      setIsAuthenticatedPartner(true);
      console.log(data);
    } catch (error) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message[0]) : setError(e.error);
    }
  };

  const signUp = async (partner) => {
    try {
      const data = await registerPartnerRequest(partner);
      setPartner(data);
      setIsAuthenticatedPartner(true);
      console.log(data);
    } catch (error) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message[0]) : setError(e.error);
    }
  };

  const logout = async () => {
    try {
      await logoutPartnerRequest();
      Cookie.remove("token");
      setPartner({});
      setIsAuthenticatedPartner(false);
      setReserved([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const cookies = Cookie.get();
      if (!cookies.PartnerToken) {
        return setIsAuthenticatedPartner(false);
      }
      try {
        const partner = await verifyTokenPartnerRequest(cookies.PartnerToken);
        console.log(partner);
        if (!partner) return setIsAuthenticatedPartner(false);
        setIsAuthenticatedPartner(true);
        setPartner(partner);
      } catch (error) {
        setIsAuthenticatedPartner(false);
        console.log(error);
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
        reserved,
        setReserved,
        elementView,
        setElementView,
        styles,
        setStyles,
        showReservationsNumber,
        confirmDelete,
        setConfirmDelete,
      }}
    >
      {props.children}
    </partnerContext.Provider>
  );
};

export default PartnerProvider;
