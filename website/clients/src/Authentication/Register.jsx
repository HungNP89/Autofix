import { useState, useEffect , useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, Form, Input, message } from "antd";
import "../Design/Register.css";
import { LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { authContext } from "../Helpers/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [messageApi, contextHolders] = message.useMessage();
  const { setAuthData } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Registration successfully",
      duration: 2,
    });
  };

  const notify1 = () => {
    messageApi.open({
      type: "error",
      content: " Username already registered",
      duration: 2,
    });
  };

  const notify2 = () => {
    messageApi.open({
      type: "error",
      content: " Phone no already registered",
      duration: 2,
    });
  };
  const issue = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong with server , try again later",
      duration: 1,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          phone: phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.existPhone) {
          console.log(data.existPhone);
          notify1();
        } else if (data.existUsername) {
          notify2();
        } else {
          success();
          setTimeout(() => {
            setLoading(false);
            navigate("/login");
          }, 2000);
        }
      } else {
        const data = await response.json();
        console.log(data);
        if(data.existPhone) {
          notify2();
        } else if (data.existUsername) {
          notify1();
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      issue();
    }
  };

  return (
    <div className="register">
      <div className="register-card">
        <div className="register-container">
          {contextHolders}
          <h1>Register</h1>
          <Form
            name="normal_register"
            className="register-form"
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
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                value={username}
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

            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Phone No"
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
                <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                  Register
                </Button>
                <div style={{marginTop:50}}>
                  Already have account ? <Link to="/login">Login</Link>
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
export default Register;
