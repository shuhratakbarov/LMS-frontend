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

const imageLogin = "././login.png";
const imageTUIT = "./tuit.png";

const Login = ({ checkAuth }) => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await login({
        username: values.username,
        password: values.password
      });
      if (response.data.success) {
        setAuthData(response.data.data);
        await checkAuth();
      }
      message.success(response.data.message);
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        backgroundImage: `url("${imageLogin}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "80.1vh",
        margin: "0 auto",
        paddingTop: "10%"
      }}
    >
      <img
        src={imageTUIT}
        alt="Learning Logo"
        style={{
          display: "block",
          margin: "0 auto",
          width: "20vh",
          height: "auto",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
      <h2 style={{ textAlign: "center" }}>Learning Management System</h2>
      <Card
        style={{
          width: 400,
          margin: "0 auto",
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {loading ? (
                <div>
                  <LoadingOutlined /> 'Logging in...'
                </div>
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
  );
};

export default Login;