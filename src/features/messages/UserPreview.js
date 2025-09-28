import { Card, Avatar, Typography, Space } from "antd";
import MessageInput from './MessageInput';
import { RoleIcon } from "../../utils/util";

const { Text, Title } = Typography;

const UserPreview = ({
                       user,
                       messageInput,
                       onInputChange,
                       onSendMessage
                     }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase();
    const last = parts[parts.length - 1]?.charAt(0).toUpperCase();
    return first + (last || "");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "70vh",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            textAlign: "center",
            minWidth: "40vh",
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Space direction="vertical" size="large" align="center">
            <Avatar
              size={80}
              style={{ backgroundColor: "#949494", fontSize: 52 }}
              icon={<RoleIcon role={user.role} />}
            >
              {getInitials(user.name)}
            </Avatar>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {user.name}
              </Title>
              <Text strong style={{ color: "#444" }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}:
              </Text>
              <Text type="secondary" style={{ marginLeft: 8, color: "dodgerblue" }}>
                @{user.username}
              </Text>
            </div>
            <Text type="secondary">
              Send a message to start a conversation
            </Text>
          </Space>
          <MessageInput
            value={messageInput}
            onChange={onInputChange}
            onSend={onSendMessage}
            placeholder="Type a message..."
          />
        </Card>
      </div>
    </div>
  );
};

export default UserPreview;