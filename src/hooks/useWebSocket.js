import { useEffect, useRef } from "react";
import { getUserCredentials } from "../utils/auth";
import { message as antMessage } from "antd";
import webSocketService from "../services/WebSocketService";
import { replaceOptimisticMessage } from "../utils/util";
import { getConversations } from "../services/api-client";

export const useWebSocket = ({
                               currentUser, setCurrentUser,
                               selectedConversation, selectedConversationRef,
                               messages, setMessages, setTyping,
                               setReadReceipts, setConversations,
                               setConversationsLoading,
                               setOtherLastReadMessageId,
                               scrollToBottom, setSelfLastReadMessageId,
                               setOnlineUsernames, setUserPresence,
                               setOtherLastReadMessageCreatedAt,
                               setFirstUnreadIndex, setTypingByConversation
                             }) => {
  const userFeedUnsubRef = useRef(null);

  // keep ref in sync
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- READ_RECEIPT handler ---
  const onReadEvent = (readEvent) => {
    setReadReceipts((prev) => ({
      ...prev,
      [readEvent.username]: readEvent.otherLastReadMessageId
    }));

    if (readEvent.username === currentUser.username) {
      setSelfLastReadMessageId(readEvent.otherLastReadMessageId); // fallback, don't pay attention to the field name
    } else {
      setOtherLastReadMessageId(readEvent.otherLastReadMessageId);
      setMessages((currentMessages) => {
        const otherLastReadIndex = readEvent.otherLastReadMessageId
          ? currentMessages.findIndex((m) => m.id === readEvent.otherLastReadMessageId)
          : -1;

        if (otherLastReadIndex >= 0) {
          setOtherLastReadMessageCreatedAt(currentMessages[otherLastReadIndex].createdAt);
        }

        return currentMessages; // Return unchanged
      });
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === readEvent.conversationId
          ? { ...c, isRead: true }
          : c
      )
    );
  };

  const handleUserFeedEvent = (event) => {
    if (!event?.type) return;

    switch (event.type) {
      case "MESSAGE": {
        const msg = event.payload;
        if (!msg) return;
        const currentConv = selectedConversationRef.current;

        if (currentConv?.id === msg.conversationId) {
          replaceOptimisticMessage(setMessages, msg, setSelfLastReadMessageId, setFirstUnreadIndex);
          scrollToBottom();
          setOtherLastReadMessageId(msg.id);
        }
        updateSidebarWithMessage(setConversations, msg, currentConv);
        break;
      }

      case "READ_RECEIPT": {
        const receipt = event.payload;
        if (receipt) onReadEvent(receipt);
        break;
      }

      case "TYPING": {
        const typingEvent = event.payload;
        const currentConv = selectedConversationRef.current;

        setTypingByConversation(prev => {
          const updated = new Map(prev);
          if (typingEvent.typing) {
            updated.set(typingEvent.conversationId, {
              username: typingEvent.senderUsername || "Someone"
            });
          } else {
            updated.delete(typingEvent.conversationId);
          }
          return updated;
        });

        if (currentConv?.id === typingEvent.conversationId) {
          setTyping(
            typingEvent.typing
              ? `${typingEvent.senderUsername || "Someone"} is typing...`
              : ""
          );
        }
        break;
      }

      case "PRESENCE": {
        const presence = event.payload;
        if (presence) {
          setUserPresence(prev => new Map(prev).set(presence.username, {
            isOnline: presence.isOnline,
            lastSeen: presence.lastSeen
          }));

        }
        break;
      }

      default:
        console.warn("Unhandled event type:", event.type);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = getUserCredentials();
        if (user) setCurrentUser(user);

        setConversationsLoading(true);
        const convRes = await getConversations();
        setConversations(Array.isArray(convRes.data) ? convRes.data : []);
      } catch (e) {
        console.error("Chat init failed:", e);
        antMessage.error("Failed to initialize chat");
      } finally {
        setConversationsLoading(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const handleOnlineUsers = (users) => {
      setOnlineUsernames([...users]);
    };

    webSocketService.addMessageListener("onlineUsers", handleOnlineUsers);

    const requestOnlineUsers = () => {
      if (webSocketService.isConnected()) {
        setTimeout(() => {
          webSocketService.client.publish({
            destination: "/app/online",
            body: ""
          });
        }, 300);
      }
    };

    requestOnlineUsers();

    const connectionListener = (connected) => {
      if (connected) requestOnlineUsers();
    };

    webSocketService.addConnectionListener(connectionListener);

    return () => {
      webSocketService.removeMessageListener("onlineUsers", handleOnlineUsers);
      webSocketService.removeConnectionListener(connectionListener);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const subscribe = () => {
      if (userFeedUnsubRef.current) userFeedUnsubRef.current();
      userFeedUnsubRef.current =
        webSocketService.subscribeToUserConversations(
          currentUser.username,
          handleUserFeedEvent
        );
    };

    if (webSocketService.isConnected()) subscribe();

    const connListener = () => subscribe();
    webSocketService.addConnectionListener(connListener);

    return () => {
      if (userFeedUnsubRef.current) userFeedUnsubRef.current();
      webSocketService.removeConnectionListener(connListener);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!selectedConversation || !messages.length) return;
    const lastMsg = messages[messages.length - 1];

    if (
      document.visibilityState === "visible" &&
      lastMsg.senderUsername !== currentUser?.username
    ) {
      webSocketService.markAsRead(selectedConversation.id, lastMsg.id);
      setSelfLastReadMessageId(lastMsg.id);

      setConversations((prev) =>
        prev
          .map((convo) =>
            convo.id === lastMsg.conversationId
              ? {
                ...convo,
                unreadCount:
                  selectedConversationRef?.current?.id === lastMsg.conversationId
                    ? 0
                    : convo.unreadCount
              }
              : convo
          )
      );
    }
  }, [messages, selectedConversation, currentUser?.username]);
};

function updateSidebarWithMessage(setConversations, message, currentConv) {
  setConversations((prev) =>
    prev
      .map((convo) =>
        convo.id === message.conversationId
          ? {
            ...convo,
            lastMessagePreview: message.content,
            lastMessageCreatedAt: message.createdAt,
            lastMessageSenderUsername: message.senderUsername,
            unreadCount:
              currentConv?.id === message.conversationId
                ? convo.unreadCount
                : convo.unreadCount + 1,
            isRead:
              currentConv?.id === message.conversationId &&
              message.createdAt <= convo.otherLastReadMessageCreatedAt
          }
          : convo
      )
      .sort(
        (a, b) =>
          new Date(b.lastMessageCreatedAt) - new Date(a.lastMessageCreatedAt)
      )
  );
}
