import { Card, Avatar, Typography, Space } from "antd";
import MessageInput from './MessageInput';
import { RoleIcon } from "../../utils/util";

const { Text, Title } = Typography;

const UserPreview = ({ user, messageInput, onInputChange, onSendMessage, isMobile }) => {
    const getInitials = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        const first = parts[0]?.charAt(0).toUpperCase();
        const last = parts[parts.length - 1]?.charAt(0).toUpperCase();
        return first + (last || "");
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: isMobile ? "100%" : "70vh",
            margin: "0 auto",
            padding: isMobile ? "16px" : "0"
        }}>
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Card style={{
                    textAlign: "center",
                    minWidth: isMobile ? "100%" : "40vh",
                    borderRadius: isMobile ? 12 : 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}>
                    <Space direction="vertical" size={isMobile ? "middle" : "large"} align="center">
                        <Avatar
                            size={isMobile ? 64 : 80}
                            style={{ backgroundColor: "#949494", fontSize: isMobile ? 40 : 52 }}
                            icon={<RoleIcon role={user.role} />}
                        >
                            {getInitials(user.name)}
                        </Avatar>
                        <div>
                            <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
                                {user.name}
                            </Title>
                            <Text strong style={{ color: "#444", fontSize: isMobile ? "13px" : "14px" }}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}:
                            </Text>
                            <Text type="secondary" style={{ marginLeft: 8, color: "dodgerblue", fontSize: isMobile ? "13px" : "14px" }}>
                                @{user.username}
                            </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "13px" }}>
                            Send a message to start a conversation
                        </Text>
                    </Space>
                    <MessageInput
                        value={messageInput}
                        onChange={onInputChange}
                        onSend={onSendMessage}
                        placeholder="Type a message..."
                        isMobile={isMobile}
                    />
                </Card>
            </div>
        </div>
    );
};

export default UserPreview;