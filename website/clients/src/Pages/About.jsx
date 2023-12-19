import "../Design/LandingPage.css";
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Button, Skeleton } from "antd";
import { useEffect, useContext, useState } from "react";
import Cookies from "js-cookie";
import { authContext } from "../Helpers/AuthContext";
import { useNavigate } from "react-router-dom";

function About() {
  const { setAuthData } = useContext(authContext);
  const navigate = useNavigate();
  const [isSpin, setIsSpin] = useState(true);

  useEffect(() => {
    const time = setTimeout(() => {
      setIsSpin(false);
    }, 1000);

    return () => clearTimeout(time);
  }, []);

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

  const toLoginPage = () => {
    navigate("/login");
  };
  return (
    <>
      <header className="header">
        <a className="logo">AUTOFIX</a>

        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/main">Service</a>
          <a href="/main/detail">Bookings</a>
          <a href="about" className="active">
            About
          </a>
          <a href="contact">Contact</a>
        </nav>

        <div className="social-media">
          <a href="#">
            <TwitterOutlined />
          </a>
          <a href="#">
            <FacebookOutlined />
          </a>
          <a href="#">
            <InstagramOutlined />
          </a>
        </div>
        <div className="btn2">
          <Button onClick={toLoginPage}>Login</Button>
        </div>
        {isSpin && (
          <div
            style={{
              width: "100%",
              height: "100vh",
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <Skeleton />
          </div>
        )}
      </header>

      <div className="home">
        <div className="home-img2">
          <img src="/9045619.jpg" alt=""></img>
        </div>

        <div className="home-content">
          <h1>About Us</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry`s standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
