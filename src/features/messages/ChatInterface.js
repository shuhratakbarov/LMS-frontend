import { useEffect} from "react";
import { Layout, message as antMessage } from "antd";
import { useChatState } from "../../hooks/useChatState";
import { useWebSocket } from "../../hooks/useWebSocket";
import ConversationSidebar from './ConversationSidebar';
import ChatArea from './ChatArea';
import { getUserCredentials } from "../../utils/auth";
import { createConversation, getMessages, joinGroupMessages, searchConversations }
  from "../../services/api-client";
import webSocketService from "../../services/WebSocketService";
import { generateTempId, playSendSound } from "../../utils/util";

const ChatInterface = () => {

  useEffect(() => {
    const user = getUserCredentials();
    if (user) setCurrentUser(user);
  }, []);

  const chatState = useChatState();
  const {
    currentUser, setCurrentUser, selectedConversation, setSelectedConversation, selectedConversationRef,
    isTypingRef, typingTimeoutRef,
    onlineUsernames, setOnlineUsernames, messages, setMessages, conversations, setConversations,
    typing, setTyping, messagesEndRef,
    containerRef, searchType, setLoading, setReadReceipts,
    setOtherLastReadMessageId, firstUnreadIndex, setFirstUnreadIndex,
    localMatches, setLocalMatches, otherLastReadMessageCreatedAt, setOtherLastReadMessageCreatedAt,
    setConversationsLoading, messageInput, setMessageInput, selectedUserTarget,
    setSelectedUserTarget, setSearchTerm, setSearchMode, showScrollToBottom, setShowScrollToBottom,
    setGlobalMatches, setGroupPreview, setSelfLastReadMessageId, userPresence, setUserPresence,
    typingByConversation, setTypingByConversation,
  } = chatState;

  useWebSocket({
    currentUser, setCurrentUser, selectedConversation, selectedConversationRef,
    onlineUsernames, setOnlineUsernames, messages, setMessages, setReadReceipts,
    conversations, setConversations, setTyping, setConversationsLoading,
    setOtherLastReadMessageId, setSelfLastReadMessageId,
    setOtherLastReadMessageCreatedAt, setFirstUnreadIndex, setUserPresence,
    setTypingByConversation,
    scrollToBottom : () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  });

  const SEARCH_THRESHOLD = 4;

  const scrollToBottomForced = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setShowScrollToBottom(false);
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    setSelectedUserTarget(null);
    setLoading(true);

    try {
      const res = await getMessages(conversation.id, 0);
      const sortedMessages = [...res.data.messages.content].reverse();

      const lastMsg = sortedMessages[sortedMessages.length - 1];
      if (lastMsg && lastMsg.senderUsername !== currentUser?.username) {
        webSocketService.markAsRead(conversation.id, lastMsg.id);
        setSelfLastReadMessageId(lastMsg.id);
        setOtherLastReadMessageId(res?.data?.otherLastReadMessageId);
      }
      const unreadIndex = res?.data?.selfLastReadMessageId
        ? sortedMessages.findIndex((m) => m.id === res?.data?.selfLastReadMessageId) + 1
        : -1;

      setFirstUnreadIndex(unreadIndex);

      const otherLastReadIndex = res?.data?.otherLastReadMessageId
        ? sortedMessages.findIndex((m) => m.id === res?.data?.otherLastReadMessageId)
        : -1;

      setOtherLastReadMessageCreatedAt(sortedMessages[otherLastReadIndex]?.createdAt);
      setMessages(sortedMessages);

    } catch (error) {
      console.error("Error loading messages:", error);
      antMessage.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      let conversation = selectedConversation;
      let conversationId = conversation?.id;

      // --- Create new conversation if needed ---
      if (!conversation && selectedUserTarget) {
        const data = {
          isGroup: false,
          participantIds: [selectedUserTarget.id],
          name: null,
          username: null,
        };

        const res = await createConversation(data);
        conversation = res.data;
        setSelectedConversation(conversation);
        setConversations((prev) => [conversation, ...prev]);
        setSelectedUserTarget(null);

        // Subscribe to messages for this conversation
        // webSocketService.subscribeToGroupMessages(conversation.id, (msg) => {
        //   setMessages((prev) => {
        //     // Try to replace optimistic one (id === null)
        //     const idx = prev.findIndex(
        //       (m) =>
        //         m.id === null &&
        //         m.content === msg.content &&
        //         m.senderId === msg.senderId
        //     );
        //     if (idx !== -1) {
        //       const updated = [...prev];
        //       updated[idx] = { ...msg };
        //       return updated;
        //     }
        //     return [...prev, msg];
        //   });
        //   playSound();
        //   scrollToBottomForced();
        // });

        conversationId = conversation.id;
      }

      if (!conversationId) return;

      const createTimestamp = () => {
        const now = new Date();
        const isoString = now.toISOString();
        return isoString.replace('Z', '000Z');
      };

      const optimisticMessage = {
        id: generateTempId(),
        content: messageInput.trim(),
        senderUsername: currentUser.username,
        senderId: currentUser.id,
        createdAt: createTimestamp(),
        isOptimistic: true,
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setMessageInput("");
      scrollToBottomForced();
      playSendSound();

      // stop typing indicator

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
      setTyping("");
      webSocketService.sendTypingStopped(conversationId);

      webSocketService.sendMessage(conversationId, messageInput.trim(), optimisticMessage.id, "TEXT");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    if (!selectedConversation || !webSocketService.isConnected()) return;

    if (!isTypingRef.current) {
      webSocketService.sendTypingStarted(selectedConversation.id);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      webSocketService.sendTypingStopped(selectedConversation.id);
      isTypingRef.current = false;
      setTyping("");
    }, 3500);
  };

  const handleJoinGroup = async () => {
    const { data: messages } = await joinGroupMessages(selectedConversation.id)
    setSelectedConversation((prev) => ({ ...prev, exists: true }));
    setMessages(messages); // assumes setMessages updates message history
    scrollToBottomForced();
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchMode(false);
      setLocalMatches([]);
      setGlobalMatches([]);
      return;
    }

    setSearchMode(true);

    const lowerTerm = term.toLowerCase();

    // 1. Local matches
    const local = (Array.isArray(conversations) ? conversations : []).filter(conv =>
      conv.name?.toLowerCase().includes(lowerTerm) ||
      conv.username?.toLowerCase().includes(lowerTerm)
    );

    setLocalMatches(local);

    // 2. Call backend only if matches < threshold
    if (local.length < SEARCH_THRESHOLD && term.length>=3) {
      try {
        const res = await searchConversations(term, searchType); // "user" or "group"
        const remote = res.data || [];

        // Remove local duplicates
        const remoteFiltered = remote.filter(r =>
          !local.some(l => l.username === r.username && l.isGroup === r.isGroup)
        );

        setGlobalMatches(remoteFiltered);
      } catch (error) {
        console.error("Search error:", error);
        antMessage.error("Failed to search");
      }
    } else {
      setGlobalMatches([]); // no need to search globally
    }
  };

  const handleSearchResultClick = (item) => {
    if (!item.isGroup) {
      if (localMatches.includes(item)) {
        handleConversationSelect(item)
      } else {
        setSelectedUserTarget(item); // Used for rendering preview
        setSelectedConversation(null);
        setMessages([]);
      }
    } else {
      if (localMatches.includes(item)) {
        handleConversationSelect(item)
      } else {
        setGroupPreview(item);
        setSelectedConversation(null);
        setMessages([]);
      }
    }
    setSearchMode(false);
    setSearchTerm("");
  };

  const handleScroll = () => {
    if (!containerRef.current || !messages.length || !selectedConversation) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setShowScrollToBottom(!isAtBottom && firstUnreadIndex >= 0);
  };

  const filteredConversations = Array.isArray(chatState.conversations)
    ? chatState.conversations.filter(conv => {
      const term = chatState.searchTerm.toLowerCase();
      return (
        conv.name?.toLowerCase().includes(term) ||
        conv.username?.toLowerCase().includes(term)
      );
    })
    : [];

  const filterBySearchType = (list) =>
    list.filter(item =>
      chatState.searchType === "user" ? !item.isGroup : item.isGroup
    );

  const filteredLocalMatches = filterBySearchType(chatState.localMatches);
  const filteredGlobalMatches = filterBySearchType(chatState.globalMatches);

  return (
    <Layout style={{ height: "calc(100vh - 12.5vh)", background: "#f0f2f5" }}>
      <ConversationSidebar
        currentUser={currentUser}
        searchTerm={chatState.searchTerm}
        onSearchChange={handleSearch}
        showTypeToggle={chatState.showTypeToggle}
        setShowTypeToggle={chatState.setShowTypeToggle}
        searchType={chatState.searchType}
        setSearchType={chatState.setSearchType}
        conversationsLoading={chatState.conversationsLoading}
        searchMode={chatState.searchMode}
        filteredLocalMatches={filteredLocalMatches}
        filteredGlobalMatches={filteredGlobalMatches}
        onlineUsernames={chatState.onlineUsernames}
        onSearchResultClick={handleSearchResultClick}
        filteredConversations={filteredConversations}
        selectedConversation={chatState.selectedConversation}
        onConversationSelect={handleConversationSelect}
        typing={typing}
        typingByConversation={typingByConversation}
      />

      <ChatArea
        selectedConversation={chatState.selectedConversation}
        selectedUserTarget={chatState.selectedUserTarget}
        onlineUsernames={chatState.onlineUsernames}
        userPresence={userPresence}
        messages={chatState.messages}
        loading={chatState.loading}
        typing={typing}
        typingByConversation={typingByConversation}
        currentUser={chatState.currentUser}
        firstUnreadIndex={chatState.firstUnreadIndex}
        messageInput={chatState.messageInput}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onJoinGroup={handleJoinGroup}
        messageEndRef={messagesEndRef}
        containerRef={containerRef}
        showScrollToBottom={showScrollToBottom}
        onScrollToBottom={scrollToBottomForced}
        onScroll={handleScroll}
        otherLastReadMessageCreatedAt={otherLastReadMessageCreatedAt}
      />
    </Layout>
  );
};

export default ChatInterface;