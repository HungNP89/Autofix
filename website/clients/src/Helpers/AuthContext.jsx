import { createContext , useState, useEffect } from "react";
import Cookies from "js-cookie";

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext({});

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    token: null,
  });

  const setAuthData = (token) => {
    setAuth({ loading: false,  token });
  };

  useEffect(() => {
    const authDataStr = Cookies.get("authToken");
    if (authDataStr) {
      //const authData = JSON.parse(authDataStr);
      const authData = JSON.parse(atob(authDataStr.split(".")[1]));
      setAuth({
        loading: false,
        token: authData.token 
      });
    } else {
      setAuth({ loading: false,  token: null });
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      Cookies.set(
        "authToken",
         auth.token
      );
    }
  }, [auth.token]);

 
  return (
    <authContext.Provider value={{ auth, setAuthData }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
