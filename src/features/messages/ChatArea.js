import { Layout, Empty, Typography } from "antd";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserPreview from "./UserPreview";

const { Content } = Layout;
const { Text } = Typography;

const ChatArea = ({
                      selectedConversation, selectedUserTarget, onlineUsernames, messages,
                      loading, typing, typingByConversation, currentUser, firstUnreadIndex,
                      messageInput, onInputChange, onSendMessage, onJoinGroup, messageEndRef,
                      containerRef, showScrollToBottom, onScrollToBottom, onScroll,
                      userPresence, otherLastReadMessageCreatedAt, isMobile, onBack,
    scrollToBottomForced
                  }) => {
    if (selectedUserTarget) {
        return (
            <Content style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
                <UserPreview
                    user={selectedUserTarget}
                    messageInput={messageInput}
                    onInputChange={onInputChange}
                    onSendMessage={onSendMessage}
                    isMobile={isMobile}
                />
            </Content>
        );
    }

    if (!selectedConversation) {
        return (
            <Content style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    padding: isMobile ? "16px" : "24px"
                }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <Text type="secondary" style={{ fontSize: isMobile ? "14px" : "16px" }}>
                                    Select a conversation to start messaging
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
                                    {isMobile ? "Tap the button to see conversations" : "Choose from your existing conversations or start a new one"}
                                </Text>
                            </div>
                        }
                    />
                </div>
            </Content>
        );
    }

    return (
        <Content
            style={{
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "100%",
                minHeight: 0,
                overflow: "hidden"
            }}
        >
            {/* Header - Fixed at top */}
            <div style={{ flexShrink: 0 }}>
                <ChatHeader
                    currentUser={currentUser}
                    conversation={selectedConversation}
                    onlineUsernames={onlineUsernames}
                    onJoinGroup={onJoinGroup}
                    userPresence={userPresence}
                    typingByConversation={typingByConversation}
                    isMobile={isMobile}
                    onBack={isMobile ? onBack : undefined}
                />
            </div>

            {/* Message List - Scrollable middle section */}
            <div style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0
            }}>
                <MessageList
                    messages={messages}
                    loading={loading}
                    typing={typing}
                    currentUser={currentUser}
                    firstUnreadIndex={firstUnreadIndex}
                    otherLastReadMessageCreatedAt={otherLastReadMessageCreatedAt}
                    messagesEndRef={messageEndRef}
                    containerRef={containerRef}
                    showScrollToBottom={showScrollToBottom}
                    onScrollToBottom={onScrollToBottom}
                    handleScroll={onScroll}
                    isMobile={isMobile}
                />
            </div>

            {/* Message Input - Fixed at bottom */}
            <div style={{ flexShrink: 0 }}>
                <MessageInput
                    value={messageInput}
                    onChange={onInputChange}
                    onSend={onSendMessage}
                    isMobile={isMobile}
                />
            </div>
        </Content>
    );
};

export default ChatArea;