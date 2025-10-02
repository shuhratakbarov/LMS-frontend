import { Button, Card, Form, Input, message } from "antd";
import { setAuthData } from "../../utils/auth";
import {
  LoginOutlined,
  LoadingOutlined,
  LockOutlined,
  UserOutlined
} from "@ant-design/icons";
import { login } from "../../services/api-client";
import { useState } from "react";
import { Link } from "react-router-dom";

const imageLogin = "../images/study.svg";
const imageTUIT = "../images/tuit.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await login({
        username: values.username,
        password: values.password
      });
      console.log(response);
      if (response.data.success) {
        setAuthData(response.data.data);
        window.location.reload();
        message.success(response.data.message);
      } else {
        message.error(response.data.message)
      }
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e90ff, #4169e1, #0000cd)",
      display: "flex",
      width: "100%",
      height: "100vh",
      margin: 0,
      padding: 0,
      boxSizing: "border-box"
    }}>
      <div style={{
        flex: "1",
        backgroundImage: `url("${imageLogin}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }} />
      <div style={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",

      }}>
        <img
          src={imageTUIT}
          alt="Learning Logo"
          style={{
            width: "20vh",
            height: "auto",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "1.5rem"
          }}
        />
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Learning Management System</h2>
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
          }}
        >
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { type: "string", message: "Please enter a valid username!" }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Link
              to="/forgot-password"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                marginBottom: 20
              }}
            >
              Forgot password?
            </Link>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                {loading ? (
                  <p>
                    <LoadingOutlined />
                  </p>
                ) : (
                  <div>
                    <LoginOutlined /> Log in
                  </div>
                )}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;