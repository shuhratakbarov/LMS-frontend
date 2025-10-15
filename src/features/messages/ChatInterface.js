import {useEffect, useState} from "react";
import {Button, Drawer, Layout, message as antMessage} from "antd";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar when resizing to desktop
      if (!mobile) setSidebarVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    scrollToBottom: () => {
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

    // Close sidebar on mobile after selection
    if (isMobile) setSidebarVisible(false);

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
    setMessages(messages);
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

    const local = (Array.isArray(conversations) ? conversations : []).filter(conv =>
        conv.name?.toLowerCase().includes(lowerTerm) ||
        conv.username?.toLowerCase().includes(lowerTerm)
    );

    setLocalMatches(local);

    if (local.length < SEARCH_THRESHOLD && term.length >= 3) {
      try {
        const res = await searchConversations(term, searchType);
        const remote = res.data || [];

        const remoteFiltered = remote.filter(r =>
            !local.some(l => l.username === r.username && l.isGroup === r.isGroup)
        );

        setGlobalMatches(remoteFiltered);
      } catch (error) {
        console.error("Search error:", error);
        antMessage.error("Failed to search");
      }
    } else {
      setGlobalMatches([]);
    }
  };

  const handleSearchResultClick = (item) => {
    if (!item.isGroup) {
      if (localMatches.includes(item)) {
        handleConversationSelect(item)
      } else {
        setSelectedUserTarget(item);
        setSelectedConversation(null);
        setMessages([]);
        if (isMobile) setSidebarVisible(false);
      }
    } else {
      if (localMatches.includes(item)) {
        handleConversationSelect(item)
      } else {
        setGroupPreview(item);
        setSelectedConversation(null);
        setMessages([]);
        if (isMobile) setSidebarVisible(false);
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

  const handleBackToConversations = () => {
    setSelectedConversation(null);
    setSelectedUserTarget(null);
    setMessages([]);
    setSidebarVisible(true);
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

  // Mobile: Show chat area if conversation selected, otherwise show button to open sidebar
  const showChatArea = isMobile ? (selectedConversation || selectedUserTarget) : true;
  const showSidebarContent = !isMobile || !showChatArea;

  return (
      <Layout style={{ height: "calc(100vh - 13vh)",minHeight: "100%", background: "#fff" }}>
        {/* Desktop Sidebar */}
        {(!isMobile || (isMobile && !showChatArea)) && (
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
                isMobile={isMobile}
            />
        )}

        {/* Mobile Drawer Sidebar */}
        {/*{isMobile && (*/}
        {/*    <Drawer*/}
        {/*        title="Messages"*/}
        {/*        placement="left"*/}
        {/*        onClose={() => setSidebarVisible(false)}*/}
        {/*        open={sidebarVisible}*/}
        {/*        width="85%"*/}
        {/*        styles={{*/}
        {/*          body: { padding: 0 }*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      <ConversationSidebar*/}
        {/*          currentUser={currentUser}*/}
        {/*          searchTerm={chatState.searchTerm}*/}
        {/*          onSearchChange={handleSearch}*/}
        {/*          showTypeToggle={chatState.showTypeToggle}*/}
        {/*          setShowTypeToggle={chatState.setShowTypeToggle}*/}
        {/*          searchType={chatState.searchType}*/}
        {/*          setSearchType={chatState.setSearchType}*/}
        {/*          conversationsLoading={chatState.conversationsLoading}*/}
        {/*          searchMode={chatState.searchMode}*/}
        {/*          filteredLocalMatches={filteredLocalMatches}*/}
        {/*          filteredGlobalMatches={filteredGlobalMatches}*/}
        {/*          onlineUsernames={chatState.onlineUsernames}*/}
        {/*          onSearchResultClick={handleSearchResultClick}*/}
        {/*          filteredConversations={filteredConversations}*/}
        {/*          selectedConversation={chatState.selectedConversation}*/}
        {/*          onConversationSelect={handleConversationSelect}*/}
        {/*          typing={typing}*/}
        {/*          typingByConversation={typingByConversation}*/}
        {/*          isMobile={true}*/}
        {/*      />*/}
        {/*    </Drawer>*/}
        {/*)}*/}

        {/* Chat Area */}
        {/* Chat Area - Show only on desktop or when conversation selected on mobile */}
        {showChatArea && (
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
                isMobile={isMobile}
                onBack={handleBackToConversations}
                onOpenSidebar={() => setSidebarVisible(true)}
            />
        )}
      </Layout>
  );
};

export default ChatInterface;