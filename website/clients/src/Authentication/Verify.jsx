import { Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authContext } from "../Helpers/AuthContext";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
function Verify() {
  const navigate = useNavigate();
  const { setAuthData } = useContext(authContext);
  const location = useLocation();
  
  useEffect(() => {
    const storeToken = Cookies.get("authToken");

    const handleToken = () => {
      const decodedToken = JSON.parse(atob(storeToken.split(".")[1]));
      setAuthData(storeToken);

      if (decodedToken && decodedToken.role === "user") {
        navigate("/main");
      }
    };

    if (storeToken) {
      handleToken();
    }
  }, [setAuthData, navigate]);
  
  const handleLoginGoogle = async () => {
    const dataToken = new URLSearchParams(location.search).get("token");
    console.log(dataToken);
    const token = JSON.parse(atob(dataToken.split(".")[1]));
    const email = token.email;
    const name = token.name;
    try {
      const response = await fetch(
        `https://autofix-server.onrender.com/user/google/verify?name=${name}&email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: name,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Cookies.set(
          "authToken",
             data.token,
          { expires: 1 }
        );
        setAuthData(data.token);

        if (token.role === "user") {
          setTimeout(() => {
            navigate("/main");
          }, 2000);
        }
      } else {
        console.error("Error during login:");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleLoginGoogle();
    }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Spin />
    </>
  );
}
export default Verify;
