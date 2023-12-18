import '../Design/LandingPage.css'
import { InstagramOutlined, FacebookOutlined, TwitterOutlined } from "@ant-design/icons";
import { Button, Skeleton } from 'antd';
import { useEffect, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { authContext } from "../Helpers/AuthContext";
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const { setAuthData } = useContext(authContext);
  const navigate = useNavigate();
  const [isSpin , setIsSpin] = useState(true);

  useEffect(() => {
    const time= setTimeout(() => {
      setIsSpin(false);
    }, 1000)

    return (() => clearTimeout(time))
  },[])

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
  }
  return (
    <>
      <header className="header">
        <a className="logo">
         AUTOFIX
        </a>

        <nav className="navbar" >
          <a href="/autofix"  className="active">
            Home
          </a>
          <a href="/service" >
            Service
          </a>
          <a href="/main">
            Bookings
          </a>
          <a href="/about" >
            About
          </a>
          <a href="/contact" >
            Contact
          </a>
        </nav>

        <div className="social-media">
          <a href="#" >
            <TwitterOutlined/>
          </a>
          <a href="#" >
            <FacebookOutlined/>
          </a>
          <a href="#" >
           <InstagramOutlined/>
          </a>
        </div>
        <div className='btn2'>
          <Button onClick={toLoginPage}>Login</Button>
        </div>
        {isSpin && <div style={{width:"100%", height:"100vh", position: 'absolute',  display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}><Skeleton /></div>}
      </header>
      
      <div className="home">
        <div className="home-content">
          <h1>Car Maintainance & Repair Services</h1>
          
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
            aliquam neque eaque eum commodi assumenda exercitationem quisquam
            aperiam facilis labore nemo, repellendus perferendis, autem velit
            libero rem ullam.
          </p>
          <a href='/register' className="btn">
            Explore 
          </a>
        </div>

        <div className="home-img">
            <img src='/8227.jpg'  alt=""></img>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
