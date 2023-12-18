import { useState, useContext, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { Button, Form, Input, message, ConfigProvider } from "antd";
import "./AdminLogin.css";
import { authContext } from "../Helpers/AuthContext";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthData } = useContext(authContext);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const storeToken = Cookies.get("authToken");
    if (storeToken) {
      const decodedToken = JSON.parse(atob(storeToken.split(".")[1]));
      setAuthData(storeToken);

      if (decodedToken && decodedToken.role === "admin") {
        navigate("/panel");
      }
    }
  }, [setAuthData, navigate]);

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Login successfully",
      duration: 2,
    });
  };
  const fail = () => {
    messageApi.open({
      type: "error",
      content: "Login failed",
      duration: 2,
    });
  };

  const issue = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong with server, try again later",
      duration: 1,
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set(
          "authToken",
           data.token,
          { expires: 1 , secure: true } 
        );
        setAuthData(data.token );
        success();
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        if (decodedToken && decodedToken.role === "admin") {
          setTimeout(() => {
            navigate("/panel");
          }, 2000);
        } else if (decodedToken && decodedToken.role === "user") {
          setTimeout(() => {
            navigate("/main");
          }, 2000);
        }
      } else {
        console.error("Error during login:");
        fail();
      }
    } catch (error) {
      console.error("Error during login:", error);
      issue();
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        {contextHolder}
        <div className="admin-login-container">
          <h1>Login</h1>
          <Form
            name="normal_login"
            className="admin-login-form"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            onFinish={handleSubmit}
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
                      colorPrimary: "red",
                      colorPrimaryHover: "#ff8585",
                    },
                  },
                }}
              >
                <Button type="primary" htmlType="submit">
                  Log in
                </Button>
              </ConfigProvider>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="image"></div>
    </div>
  );
}

export default AdminLogin;
