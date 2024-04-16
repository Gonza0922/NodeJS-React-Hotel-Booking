import { useState, useEffect, createContext, useContext } from "react";
import {
  registerUserRequest,
  loginUserRequest,
  logoutUserRequest,
} from "../api/user.api";
import Cookie from "js-cookie";
import { verifyTokenUserRequest } from "../api/user.api";
import { getAllHotelsRequest } from "../api/hotels.api";

const userContext = createContext();

export function useUserContext() {
  return useContext(userContext);
}

const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const login = async (user) => {
    try {
      const data = await loginUserRequest(user);
      setUser(data);
      setIsAuthenticated(true);
      console.log(data);
    } catch (error) {
      const e = error.response.data.message;
      setError(e);
      console.log(e);
    }
  };

  const signUp = async (user) => {
    try {
      const data = await registerUserRequest(user);
      setUser(data);
      setIsAuthenticated(true);
      console.log(data);
    } catch (error) {
      const e = error.response.data.message;
      setError(e);
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      await logoutUserRequest();
      Cookie.remove("token");
      setUser({});
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const cookies = Cookie.get();
      if (!cookies.UserToken) {
        return setIsAuthenticated(false);
      }
      try {
        const user = await verifyTokenUserRequest(cookies.UserToken);
        console.log(user);
        if (!user) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(user);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error);
      }
    };
    verify();
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        signUp,
        login,
        logout,
        isAuthenticated,
        error,
        setError,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserProvider;
