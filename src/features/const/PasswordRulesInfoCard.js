import { useState } from 'react';
import { Card, List, Typography, Button } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PasswordRulesInfoCard = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        type="link"
        onClick={() => setVisible(!visible)}
        style={{ marginBottom: 8 }}
      >
        {visible ? 'Hide Password Requirements' : 'Show Password Requirements'}
        {visible ? <CaretUpOutlined/>  : <CaretDownOutlined/>}

      </Button>

      {visible && (
        <Card
          size="small"
          title="Password Requirements"
          style={{ backgroundColor: '#fafafa' }}
        >
          <List
            size="small"
            dataSource={[
              'At least 8 characters long',
              'Contains uppercase and lowercase letters',
              'Contains at least one number',
              'Contains at least one special character',
              'Avoid common sequences (123, abc, qwerty)',
              'Should not be an email address'
            ]}
            renderItem={(item) => (
              <List.Item style={{ padding: '4px 0' }}>
                <Text type="secondary">• {item}</Text>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default PasswordRulesInfoCard;
