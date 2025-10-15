import React, { useEffect, useRef } from "react";
import { Spin, Card } from "antd";
import { ArrowDownOutlined, CheckCircleOutlined, CheckOutlined, DownOutlined } from "@ant-design/icons";
import { formatDateSeparator, formatMessageTime } from "../../utils/util";

const MessageList = ({
                         messages, loading, currentUser, firstUnreadIndex,
                         otherLastReadMessageCreatedAt, messagesEndRef, containerRef,
                         showScrollToBottom, onScrollToBottom, handleScroll, isMobile
                     }) => {
    const unreadRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [containerRef, handleScroll]);

    useEffect(() => {
        if (messages.length > 0 && !loading) {
            const shouldScrollToUnread = firstUnreadIndex >= 0;

            if (shouldScrollToUnread && unreadRef.current) {
                requestAnimationFrame(() => {
                    unreadRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            } else {
                requestAnimationFrame(() => {
                    messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "end"
                    });
                });
            }
        }
    }, [messages.length, firstUnreadIndex, loading, messagesEndRef]);

    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                padding: isMobile ? "12px" : "16px",
                overflow: "auto",
                background: "#fafafa"
            }}
        >
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {messages.map((msg, index) => {
                        const prevMsg = messages[index - 1];
                        const isSameSender = prevMsg?.senderUsername === msg.senderUsername;

                        const currentDate = new Date(msg.createdAt).toDateString();
                        const prevDate = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
                        const showDateSeparator = currentDate !== prevDate;

                        const isCurrentUser = msg.senderUsername === currentUser?.username;
                        const isFirstUnread = index === firstUnreadIndex || firstUnreadIndex === -1;

                        return (
                            <React.Fragment key={msg.id}>
                                {showDateSeparator && (
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        margin: isMobile ? "12px 0" : "16px 0"
                                    }}>
                    <span style={{
                        padding: isMobile ? "3px 10px" : "4px 12px",
                        fontSize: isMobile ? "11px" : "12px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "#b0b0b0",
                        borderRadius: "16px",
                        whiteSpace: "nowrap"
                    }}>
                      {formatDateSeparator(msg.createdAt)}
                    </span>
                                    </div>
                                )}

                                {isFirstUnread && msg.senderUsername !== currentUser.username && (
                                    <div
                                        ref={unreadRef}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            margin: isMobile ? "12px 0" : "16px 0"
                                        }}
                                    >
                                        <div style={{
                                            flex: 1,
                                            height: "1px",
                                            background: "#fa541c",
                                            opacity: 0.4
                                        }} />
                                        <span style={{
                                            margin: isMobile ? "0 8px" : "0 12px",
                                            fontSize: isMobile ? "11px" : "12px",
                                            fontWeight: "bold",
                                            color: "#fa541c",
                                            whiteSpace: "nowrap"
                                        }}>
                      New messages <DownOutlined />
                    </span>
                                        <div style={{
                                            flex: 1,
                                            height: "1px",
                                            background: "#fa541c",
                                            opacity: 0.4
                                        }} />
                                    </div>
                                )}

                                <div
                                    data-message-id={msg.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                                        marginBottom: isSameSender ? 4 : (isMobile ? 8 : 12),
                                        paddingLeft: isMobile ? 4 : 8,
                                        paddingRight: isMobile ? 4 : 8
                                    }}
                                >
                                    <div style={{ maxWidth: isMobile ? "85%" : "70%" }}>
                                        <Card
                                            size="small"
                                            style={{
                                                background: isCurrentUser ? "#1890ff" : "#f5f5f5",
                                                color: isCurrentUser ? "#fff" : "#000",
                                                borderRadius: isMobile ? "12px" : "16px",
                                                padding: 0,
                                                margin: 0
                                            }}
                                            bodyStyle={{
                                                padding: isMobile ? "6px 10px" : "8px 12px",
                                                position: "relative",
                                                wordBreak: "break-word"
                                            }}
                                        >
                                            <div style={{ display: "inline-block", width: "100%" }}>
                                                <span style={{ fontSize: isMobile ? "14px" : "15px" }}>{msg.content}</span>
                                                <span style={{
                                                    float: "right",
                                                    marginLeft: 8,
                                                    fontSize: isMobile ? "9px" : "10px",
                                                    color: isCurrentUser ? "#d6f0ff" : "#888",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4
                                                }}>
                          {formatMessageTime(msg.createdAt)}
                                                    {isCurrentUser && (
                                                        <span style={{ color: "#111111" }}>
                              {msg.createdAt <= otherLastReadMessageCreatedAt && otherLastReadMessageCreatedAt !== null ? (
                                  <CheckCircleOutlined style={{ fontSize: isMobile ? "11px" : "12px" }} />
                              ) : (
                                  <CheckOutlined style={{ fontSize: isMobile ? "9px" : "10px" }} />
                              )}
                            </span>
                                                    )}
                        </span>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}

                    <div ref={messagesEndRef} />
                    {showScrollToBottom && (
                        <div style={{
                            position: "absolute",
                            bottom: isMobile ? "70px" : "5vh",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 1000
                        }}>
                            <button
                                onClick={onScrollToBottom}
                                style={{
                                    width: isMobile ? "36px" : "40px",
                                    height: isMobile ? "36px" : "40px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "#1890ff",
                                    color: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    fontSize: isMobile ? "14px" : "16px"
                                }}
                            >
                                <ArrowDownOutlined />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MessageList;