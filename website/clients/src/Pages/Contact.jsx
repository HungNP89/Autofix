import "../Design/LandingPage.css";
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Button, Skeleton, Input } from "antd";
import { useEffect, useContext, useState } from "react";
import Cookies from "js-cookie";
import { authContext } from "../Helpers/AuthContext";
import { useNavigate } from "react-router-dom";

function Contact() {
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
          <a href="about">About</a>
          <a href="contact" className="active">
            Contact
          </a>
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
              height: "200vh",
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

      <div className="home2">
        <div className="home-content2">
          <h1>Contact Us</h1>
          <p>
            Got a question ? We`d love to hear from you. Send us a message or
            call and we`ll response as soon as possible
          </p>
          <div>
          <h3>Username*</h3>
          <Input style={{ height: 40 }}  />
          <h3>Email*</h3>
          <Input style={{ height: 40 }}  />
          <h3>Message*</h3>
          <Input.TextArea style={{ height: 100 }} showCount={true} maxLength={300} />
          <Button>Submit</Button>
          </div>
        <p>Or you can call <a>0968686868</a> to get support</p>
        </div>
      </div>
    </>
  );
}

export default Contact;
