import { List, Avatar, Badge } from "antd";
import { TeamOutlined, CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  formatConversationLastMessageTime,
  RoleIcon,
} from "../../utils/util";
import TypingIndicator from "./TypingIndicator";

const ConversationList = ({
                            currentUser,
                            conversations,
                            selectedConversation,
                            onlineUsernames,
                            onSelect,
                            typingByConversation
                          }) => {
  return (
    <List
      style={{ height: "calc(100% - 14vh)" }}
      dataSource={conversations}
      renderItem={(conversation) => {
        const isSelected = selectedConversation?.id === conversation.id;
        const isOnline = onlineUsernames.includes(conversation.username);
        const conversationTyping = typingByConversation?.get(conversation.id);
        const isTypingInConversation = conversationTyping && conversationTyping.username !== currentUser?.username;
        return (
          <List.Item
            onClick={() => onSelect(conversation)}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              backgroundColor: isSelected ? "#e6f7ff" : "transparent",
              borderLeft: isSelected ? "3px solid #1890ff" : "3px solid transparent"
            }}
          >
            <List.Item.Meta
              avatar={
                conversation.isGroup ? (
                  <Avatar
                    icon={<TeamOutlined />}
                    style={{ backgroundColor: "rebeccapurple" }}
                  />
                ) : (
                  <Badge dot={isOnline} color="#1677ff" size={"default"}>
                    <Avatar size={48} icon={<RoleIcon role={conversation.role}/>}
                            style={{ backgroundColor: "#949494", fontSize: 30 }}>
                      {conversation.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Badge>
                )
              }
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: isSelected ? "bold" : "normal",
                      fontSize: "15px",
                    }}
                  >
                    {conversation.name || "Unknown"}
                    {/*<RoleIcon role={conversation.role} />*/}
                  </span>

                  <span style={{ fontSize: "12px", color: "#999" }}>
                    {formatConversationLastMessageTime(conversation.lastMessageCreatedAt)}
                  </span>
                </div>
              }
              description={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    color: "#999",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "180px"
                  }}>
                    {isTypingInConversation
                        ? <TypingIndicator text="typing" size="medium" color="#1890ff" />
                      : conversation.lastMessagePreview
                        ? conversation.lastMessagePreview
                        : <span style={{ color: "#1890ff" }}>History was cleared</span>}
                  </span>
                  {conversation.lastMessageSenderUsername === currentUser.username && conversation.isGroup ? null : (
                    conversation.lastMessageSenderUsername === currentUser.username && (
                      conversation.isRead
                        ? <CheckCircleOutlined style={{ color: "#1890ff", fontSize: "15px" }} /> // read
                        : <CheckOutlined style={{ color: "#aaa", fontSize: "12px" }} />   // sent only
                    )

                  )}
                  {conversation.lastMessageSenderUsername !== currentUser.username && conversation.unreadCount > 0 && (
                    <Badge
                      count={conversation.unreadCount}
                      overflowCount={999}
                      style={{
                        backgroundColor: "#1890ff",
                        boxShadow: "none",
                        fontSize: "12px"
                      }}
                    />
                  )}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ConversationList;