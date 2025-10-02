import { useState } from "react";
import { Input, Button, Typography, Space, Card } from "antd";
import { MailOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { passwordResetRequest } from "../../services/api-client";

const { Title, Link, Text } = Typography;

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
      const response = await passwordResetRequest({email: email});
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
      background: "linear-gradient(135deg, #1e90ff, #4169e1, #0000cd)",
      display: "flex",
      width: "100%",
      height: "100vh",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        {success ? (
          // Success state
          <div style={{ textAlign: "center", padding: "24px" }}>
            <CheckCircleOutlined
              style={{
                fontSize: "48px",
                color: "#52c41a",
                marginBottom: "16px",
                display: "block"
              }}
            />
            <Title level={3} style={{ color: "#52c41a", marginBottom: "16px" }}>
              Reset Link Sent
            </Title>
            <Text style={{ fontSize: "16px", marginBottom: "24px", display: "block" }}>
              {successMessage}
            </Text>
            <br/>
            <Text style={{ fontSize: "16px", marginBottom: "24px", display: "block" }}>
              Don't forget to check spam folder too.
            </Text>
            <Link href="/login" style={{ fontSize: "16px" }}>
              Back to Login
            </Link>
          </div>
        ) : (
          // Form state
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={2}>Forgot Password</Title>
            </div>

            <div style={{ padding: "0 24px" }}>
              <div style={{ marginBottom: 16 }}>
                <Typography.Text strong>Email</Typography.Text>
              </div>
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                status={error ? "error" : ""}
                style={{ marginBottom: 8 }}
                size="large"
                onPressEnter={resetPassword}
              />
              {error && (
                <Typography.Text type="danger" style={{ fontSize: "12px", display: "block", marginBottom: 16 }}>
                  {error}
                </Typography.Text>
              )}

              <Button
                type="primary"
                onClick={resetPassword}
                loading={loading}
                block
                size="large"
                style={{ marginBottom: 24 }}
              >
                Send Reset Link
              </Button>
            </div>

            <div style={{ textAlign: "center" }}>
              <Space direction="vertical" size="small">
                <Link href="/login">
                  Back to Login
                </Link>
              </Space>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;