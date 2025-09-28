import { Space, Avatar, Typography, Button, Dropdown } from "antd";
import { MoreOutlined, MessageOutlined } from "@ant-design/icons";
import { formatLastSeen } from "../../utils/FormatDate";
import { chatDropdownItems, RoleIcon } from "../../utils/util";
import TypingIndicator from "./TypingIndicator";

const { Text } = Typography;

const ChatHeader = ({
                      currentUser,
                      conversation,
                      onlineUsernames,
                      userPresence,
                      onJoinGroup,
                      typingByConversation,
                    }) => {

  if (!conversation) return null;

  const isOnline = onlineUsernames.includes(conversation.username);
  const presenceData = userPresence?.get(conversation.username);
  const lastSeen = presenceData?.lastSeen || conversation.lastSeen;

  const conversationTyping = typingByConversation?.get(conversation.id);
  const isTypingInConversation = conversationTyping && conversationTyping.username !== currentUser?.username;

  return (
    <div
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Space>
        {conversation.isGroup ? (
          <>
            <Avatar
              style={{ backgroundColor: "#722ed1" }}
              icon={<MessageOutlined />}
              size={"large"}
            />
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                {conversation.displayName || "Group Chat"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Group Conversation
              </Text>
            </div>
          </>
        ) : (
          <>
            <Avatar
              style={{ backgroundColor: "#949494", fontSize: 27 }}
              icon={<RoleIcon role={conversation.role} />}
              size={"large"}
            >
              {conversation.displayName}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                {conversation.name}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {isTypingInConversation
                  ? <TypingIndicator text={"typing"} size="medium" color="#1890ff" />
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
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </div>
  );
};

export default ChatHeader;