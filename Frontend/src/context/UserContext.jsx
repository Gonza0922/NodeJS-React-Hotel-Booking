import { useState, useEffect, createContext, useContext } from "react";
import { registerUserRequest, loginUserRequest, logoutUserRequest } from "../api/user.api";
import Cookie from "js-cookie";
import { verifyTokenUserRequest } from "../api/user.api";

const userContext = createContext();

export function useUserContext() {
  return useContext(userContext);
}

const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
      console.error(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const signUp = async (user) => {
    try {
      const data = await registerUserRequest(user);
      setUser(data);
      setIsAuthenticated(true);
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
      await logoutUserRequest();
      Cookie.remove("token");
      setUser({});
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const cookies = Cookie.get();
      if (!cookies.UserToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const user = await verifyTokenUserRequest(cookies.UserToken);
        if (!user) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUser(user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error(error);
      } finally {
        setLoading(false);
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
        loading,
        error,
        setError,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserProvider;
