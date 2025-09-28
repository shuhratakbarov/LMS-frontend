import { Input, Progress, Alert, List, Dropdown, Button, Space } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  KeyOutlined, DownOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  validatePassword,
  getVerdict,
  getProgressColor,
  getProgressStatus,
  generateSecurePassword
} from "../../utils/PasswordUtil";

export default function EnhancedPasswordInput({ value, onChange, placeholder = "Enter your password", showGenerator = true, ...props }) {
  const [errors, setErrors] = useState([]);
  const [strength, setStrength] = useState(0);
  const [verdict, setVerdict] = useState("");

  useEffect(() => {
    if (value) {
      const { errors, score } = validatePassword(value);
      setErrors(errors);
      setStrength(score);
      setVerdict(getVerdict(score));
    } else {
      setErrors([]);
      setStrength(0);
      setVerdict("");
    }
  }, [value]);

  const handleCustomGenerate = () => {
    const newPassword = generateSecurePassword();
    onChange(newPassword);
  };

  const handleBrowserGenerate = async () => {
    try {
      // Check if browser supports password generation
      if ('PasswordCredential' in window) {
        // This is experimental - fallback to custom generator
        const newPassword = generateSecurePassword();
        onChange(newPassword);
      } else {
        // Fallback to custom generator
        const newPassword = generateSecurePassword();
        onChange(newPassword);
      }
    } catch (error) {
      // Fallback to custom generator
      const newPassword = generateSecurePassword();
      onChange(newPassword);
    }
  };

  const handleSuggestPassword = () => {
    const input = document.querySelector('input[type="password"]');
    if (input) {
      input.focus();
    }
  };

  const generatorItems = [
    {
      key: '1',
      label: 'LMS',
      onClick: handleCustomGenerate,
    },
    {
      key: '2',
      label: 'Default Browser',
      onClick: handleBrowserGenerate,
    },
    {
      key: '3',
      label: 'Google',
      onClick: handleSuggestPassword,
    },
  ];

  const addonAfter = showGenerator ? (
    <Dropdown
      menu={{ items: generatorItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type="link" size="small" style={{ padding: 0 }}>
        <Space>
          <KeyOutlined />
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  ) : null;

  return (
    <div>
      <Input.Password
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        allowClear
        autoComplete="new-password"
        addonAfter={addonAfter}
        {...props}
      />

      {value && (
        <Progress
          percent={strength}
          status={getProgressStatus(strength)}
          strokeColor={getProgressColor(strength)}
          format={() => verdict}
          style={{ marginTop: 8 }}
        />
      )}

      {value && errors.length > 0 && (
        <Alert
          type="error"
          showIcon
          message="Password Requirements"
          description={
            <List
              size="small"
              dataSource={errors}
              renderItem={(err) => (
                <List.Item>
                  <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
                  {err}
                </List.Item>
              )}
            />
          }
          style={{ marginTop: 8 }}
        />
      )}

      {value && errors.length === 0 && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message="Password meets all requirements!"
          style={{ marginTop: 8 }}
        />
      )}
    </div>
  );
}