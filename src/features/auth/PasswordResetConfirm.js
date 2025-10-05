import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Space, Input, Button, Alert, Typography } from 'antd';
import { SafetyOutlined, LockOutlined } from '@ant-design/icons';
import PasswordStrengthInput from "../const/PasswordStrengthInput";
import { passwordResetConfirm } from "../../services/api-client";
import { validatePassword } from "../../utils/PasswordUtil";

const { Title } = Typography;

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (token) {
      setFormData(prev => ({ ...prev, token, email }));
    }
  }, [searchParams]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const { errors } = validatePassword(formData.newPassword);
    const newErrors = {};

    if (errors.length > 0) newErrors.newPassword = "Invalid password";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    setGlobalError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await passwordResetConfirm(formData);
      if (response.data.success) {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }else {
        setGlobalError(response.data.message)
      }
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              Reset Your Password
            </Title>
          </div>

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

          <div>

            <PasswordStrengthInput
              value={formData.newPassword}
              onChange={(val) => handleInputChange('newPassword', val)}
            />

            {errors.newPassword && (
              <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                {errors.newPassword}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#262626'
              }}>
                Confirm Password
              </label>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                status={errors.confirmPassword ? 'error' : ''}
                size="large"
              />
              {errors.confirmPassword && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              style={{
                width: '100%',
                height: '48px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Update Password
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default PasswordResetConfirm;