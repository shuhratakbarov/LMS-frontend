import { useState } from "react";
import { Input, Button, Typography, Card } from "antd";
import { MailOutlined, CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { passwordResetRequest } from "../../services/api-client";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const resetPassword = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }
        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await passwordResetRequest({ email: email });
            if (response.data.success) {
                setSuccess(true);
                setSuccessMessage(response.data.message);
                setLoading(false);
            } else {
                setError(response.data.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #002766 0%, #001d4a 100%)",
            display: "flex",
            width: "100%",
            minHeight: "100vh",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box"
        }}>
            <Card
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                    borderRadius: "16px",
                    padding: "24px 16px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)"
                }}
            >
                {success ? (
                    // Success state
                    <div style={{ textAlign: "center", padding: "24px 8px" }}>
                        <CheckCircleOutlined
                            style={{
                                fontSize: "64px",
                                color: "#52c41a",
                                marginBottom: "24px",
                                display: "block"
                            }}
                        />
                        <Title level={3} style={{ color: "#2d3748", marginBottom: "16px", fontSize: "22px" }}>
                            Reset Link Sent
                        </Title>
                        <Text style={{
                            fontSize: "15px",
                            marginBottom: "12px",
                            display: "block",
                            color: "#4a5568"
                        }}>
                            {successMessage}
                        </Text>
                        <Text style={{
                            fontSize: "14px",
                            marginBottom: "32px",
                            display: "block",
                            color: "#718096"
                        }}>
                            Don't forget to check your spam folder.
                        </Text>
                        <Link to="/login">
                            <Button
                                type="primary"
                                icon={<ArrowLeftOutlined />}
                                size="large"
                                style={{
                                    borderRadius: "8px",
                                    height: "48px",
                                    fontWeight: "500",
                                    background: "linear-gradient(135deg, #002766 0%, #003d99 100%)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0, 39, 102, 0.4)"
                                }}
                            >
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                ) : (
                    // Form state
                    <>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <Title level={2} style={{ color: "#2d3748", fontSize: "24px", marginBottom: "8px" }}>
                                Forgot Password
                            </Title>
                            <Text style={{
                                fontSize: "14px",
                                color: "#718096"
                            }}>
                                Enter your email to receive a reset link
                            </Text>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ marginBottom: "8px" }}>
                                <Text strong style={{ color: "#4a5568" }}>Email Address</Text>
                            </div>
                            <Input
                                prefix={<MailOutlined style={{ color: "#a0aec0" }} />}
                                placeholder="Enter your email address"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                status={error ? "error" : ""}
                                size="large"
                                onPressEnter={resetPassword}
                                style={{
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0"
                                }}
                            />
                            {error && (
                                <Text type="danger" style={{ fontSize: "13px", display: "block", marginTop: "8px" }}>
                                    {error}
                                </Text>
                            )}
                        </div>

                        <Button
                            type="primary"
                            onClick={resetPassword}
                            loading={loading}
                            block
                            size="large"
                            style={{
                                marginBottom: "16px",
                                borderRadius: "8px",
                                height: "48px",
                                fontWeight: "500",
                                background: "linear-gradient(135deg, #002766 0%, #003d99 100%)",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0, 39, 102, 0.4)"
                            }}
                        >
                            Send Reset Link
                        </Button>

                        <div style={{ textAlign: "center", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                            <Link
                                to="/login"
                                style={{
                                    color: "#002766",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    fontWeight: "500"
                                }}
                            >
                                <ArrowLeftOutlined style={{ marginRight: "4px" }} />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;