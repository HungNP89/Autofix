import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message, ConfigProvider } from "antd";
import "../Design/Login.css";
import { authContext } from "../Helpers/AuthContext";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthData } = useContext(authContext);
  const [messageApi, contextHolder] = message.useMessage();

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

  const responseMessage = async (response) => {
    if (response.credential) {
      try {
        const payload = JSON.parse(atob(response.credential.split(".")[1]));
        const useremail = payload.email;
        const username = payload.name;
        console.log(username);

        const CheckUser = await fetch(
          `http://localhost:3000/user/google?name=${username}&email=${useremail}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: username,
              email: useremail,
            }),
          }
        );
        if (CheckUser.ok) {
          const data = await CheckUser.json();
          console.log(data);
          if (data.isNewUser) {
            navigate(`/verify?token=${data.tokenForNew}`);
          } else {
            const decodedToken = JSON.parse(
              atob(response.credential.split(".")[1])
            );
            Cookies.set("authToken", data.token, { expires: 1 });
            setAuthData(data.token);
            handleLoginSuccess(data)

            if (decodedToken && decodedToken.role === "user") {
              setTimeout(() => {
                navigate("/main");
              }, 2000);
            }
          }
        } else {
          console.error("Error");
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    } else {
      console.error("Credentials not present in the response.");
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const showMessage = (type, content, duration) => {
    messageApi.open({
      type,
      content,
      duration,
    });
  };

  const handleLoginSuccess = (data) => {
    Cookies.set("authToken", data.token, { expires: 1 });
    setAuthData(data.token);
    const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
    const redirectPath = decodedToken.role === "admin" ? "/panel" : "/main";
    navigate(redirectPath);
  };

  const handleLoginFailure = () => {
    showMessage("error", "Login failed", 2);
  };

  const handleServerIssue = () => {
    showMessage("error", "Something went wrong with the server, try again later", 2);
  };

  const handleLoginFormSubmit = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
          handleLoginSuccess(data);
        
      } else {
        console.error("Error during login:", response);
        handleLoginFailure();
      }
    } catch (error) {
      console.error("Error during login:", error);
      handleServerIssue();
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        {contextHolder}
        <div className="login-container">
          <h1>Login</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            onFinish={handleLoginFormSubmit}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                value={username}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimary: "#1677ff",
                      colorPrimaryHover: "#73c2fb",
                    },
                  },
                }}
              >
                <Button type="primary" htmlType="submit">
                  Log in
                </Button>
                <div>
                  Or
                </div>
                <div
                  style={{ display: "flex", marginTop: 10 , justifyContent: "center"}}
                >
                  <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                    type="icon"
                    shape="circle"
                  />
                </div>
                <div style={{ marginTop: 50 }}>
                  New User ? <Link to="/register">Register</Link>
                </div>
              </ConfigProvider>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="image"></div>
    </div>
  );
}

export default Login;
