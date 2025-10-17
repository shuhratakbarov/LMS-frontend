import { Button, Form, Input, message } from "antd";
import { setAuthData } from "../../utils/auth";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../../services/api-client";
import { useState } from "react";
import { Link } from "react-router-dom";

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
            if (response.data.success) {
                setAuthData(response.data.data);
                window.location.reload();
                message.success(response.data.message);
            } else {
                message.error(response.data.message);
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
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #002766 0%, #001d4a 100%)",
            padding: "20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "420px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                padding: "48px 40px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)"
            }}>
                <div style={{
                    textAlign: "center",
                    marginBottom: "40px"
                }}>
                    <img
                        src={imageTUIT}
                        alt="TUIT Logo"
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "20px",
                            border: "3px solid #002766"
                        }}
                    />
                    <h1 style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#2d3748",
                        margin: "0 0 8px 0"
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        fontSize: "14px",
                        color: "#718096",
                        margin: 0
                    }}>
                        Sign in to your LMS account
                    </p>
                </div>

                <Form
                    name="login-form"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        label={<span style={{ color: "#4a5568", fontWeight: "500" }}>Username</span>}
                        name="username"
                        rules={[
                            { required: true, message: "Please enter your username" },
                            { type: "string", message: "Please enter a valid username" }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#a0aec0" }} />}
                            placeholder="Enter your username"
                            size="large"
                            style={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0"
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: "#4a5568", fontWeight: "500" }}>Password</span>}
                        name="password"
                        rules={[{ required: true, message: "Please enter your password" }]}
                        style={{ marginBottom: "12px" }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#a0aec0" }} />}
                            placeholder="Enter your password"
                            size="large"
                            style={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0"
                            }}
                        />
                    </Form.Item>

                    <div style={{
                        textAlign: "right",
                        marginBottom: "24px"
                    }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: "#002766",
                                fontSize: "14px",
                                textDecoration: "none",
                                fontWeight: "500"
                            }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                            style={{
                                borderRadius: "8px",
                                height: "48px",
                                fontSize: "16px",
                                fontWeight: "500",
                                background: "linear-gradient(135deg, #002766 0%, #003d99 100%)",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0, 39, 102, 0.4)"
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{
                    marginTop: "32px",
                    textAlign: "center",
                    paddingTop: "24px",
                    borderTop: "1px solid #e2e8f0"
                }}>
                    <p style={{
                        fontSize: "13px",
                        color: "#718096",
                        margin: 0
                    }}>
                        Learning Management System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;