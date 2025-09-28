import { useState } from 'react';
import { Input, Card, Form, message, Button, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import PasswordRulesInfoCard from "../const/PasswordRulesInfoCard";
import { changePassword } from "../../services/api-client";
import PasswordStrengthInput from "../const/PasswordStrengthInput";
import { validatePassword } from "../../utils/PasswordUtil";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/auth";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const validateForm = () => {
    const { errors } = validatePassword(newPassword);
    return errors.length === 0;
  };

  const onFinish = async (values) => {
    setGlobalError('');
    setSuccess('');

    if (!validateForm()) {
      setGlobalError('Please ensure your new password meets all requirements.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await changePassword(values);
      const { success, message: responseMessage } = response.data;

      if (success) {
        message.success(responseMessage);
        setSuccess('Password updated successfully! Redirecting to login...');
        form.resetFields();
        setTimeout(() => handleLogout(navigate), 4000);
      } else {
        message.error(responseMessage || "Failed to change password");
        setGlobalError(response.data.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while changing the password';
      message.error(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    if (globalError) setGlobalError('');
  };

  return (
    <Card title={"Change Password"} style={{ maxWidth: 600, margin: '0 auto', borderRadius: 12 }}>
      {globalError && (
        <Alert
          message="Error"
          description={globalError}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {success && (
        <Alert
          message="Success"
          description={success}
          type="success"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      <Form
        form={form}
        onFinish={onFinish}
        size="large"
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            { required: true, message: "Please enter your old password!" },
            { max: 16, message: "Password cannot exceed 16 characters!" },
          ]}
        >
          <Input.Password
            placeholder="Enter old password"
            allowClear
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password!" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const { errors } = validatePassword(value);
                if (errors.length > 0) {
                  return Promise.reject(new Error('Password does not meet requirements'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <PasswordStrengthInput
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </Form.Item>

        <PasswordRulesInfoCard />

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
            allowClear
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{
              width: '100%',
              height: '48px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePassword;