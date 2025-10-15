import { Space, Avatar, Typography, Button, Dropdown } from "antd";
import {MoreOutlined, MessageOutlined, ArrowLeftOutlined} from "@ant-design/icons";
import { formatLastSeen } from "../../utils/FormatDate";
import { chatDropdownItems, RoleIcon } from "../../utils/util";
import TypingIndicator from "./TypingIndicator";

const { Text } = Typography;

const ChatHeader = ({
                        currentUser, conversation, onlineUsernames, userPresence,
                        onJoinGroup, typingByConversation, isMobile, onBack
                    }) => {
    if (!conversation) return null;

    const isOnline = onlineUsernames.includes(conversation.username);
    const presenceData = userPresence?.get(conversation.username);
    const lastSeen = presenceData?.lastSeen || conversation.lastSeen;

    const conversationTyping = typingByConversation?.get(conversation.id);
    const isTypingInConversation = conversationTyping && conversationTyping.username !== currentUser?.username;

    return (
        <div style={{
            padding: isMobile ? "12px 16px" : "16px 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff"
        }}>
            <Space size={isMobile ? "small" : "middle"}>
                {/* Back button on mobile */}
                {isMobile && onBack && (
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                        style={{
                            fontSize: "18px",
                            padding: "4px 8px"
                        }}
                    />
                )}

                {conversation.isGroup ? (
                    <>
                        <Avatar
                            style={{ backgroundColor: "#722ed1" }}
                            icon={<MessageOutlined />}
                            size={isMobile ? "default" : "large"}
                        />
                        <div>
                            <Text strong style={{ fontSize: isMobile ? "14px" : "16px" }}>
                                {conversation.displayName || "Group Chat"}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: isMobile ? "11px" : "12px" }}>
                                Group Conversation
                            </Text>
                        </div>
                    </>
                ) : (
                    <>
                        <Avatar
                            style={{ backgroundColor: "#949494", fontSize: isMobile ? 20 : 27 }}
                            icon={<RoleIcon role={conversation.role} />}
                            size={isMobile ? "default" : "large"}
                        >
                            {conversation.displayName}
                        </Avatar>
                        <div>
                            <Text strong style={{ fontSize: isMobile ? "14px" : "16px" }}>
                                {conversation.name}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: isMobile ? "11px" : "12px" }}>
                                {isTypingInConversation
                                    ? <TypingIndicator text="typing" size="medium" color="#1890ff" isMobile={isMobile} />
                                    : isOnline
                                        ? <span style={{ color: "#1677ff" }}>Online</span>
                                        : lastSeen
                                            ? `${formatLastSeen(new Date(lastSeen))}`
                                            : "Offline"}
                            </Text>
                        </div>
                    </>
                )}
            </Space>
            <Dropdown menu={{ items: chatDropdownItems }} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} size={isMobile ? "middle" : "default"} />
            </Dropdown>
        </div>
    );
};

export default ChatHeader;