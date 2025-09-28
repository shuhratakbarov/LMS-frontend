import { useState, useRef } from 'react';

export const useChatState = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [readReceipts, setReadReceipts] = useState({});
  const [otherLastReadMessageId, setOtherLastReadMessageId] = useState(null);
  const [otherLastReadMessageCreatedAt, setOtherLastReadMessageCreatedAt] = useState(null);
  const [firstUnreadIndex, setFirstUnreadIndex] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [typing, setTyping] = useState("");
  const [typingByConversation, setTypingByConversation] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsernames, setOnlineUsernames] = useState([]);
  const [userPresence, setUserPresence] = useState(new Map());
  const [searchMode, setSearchMode] = useState(false);
  const [selectedUserTarget, setSelectedUserTarget] = useState(null);
  const [groupPreview, setGroupPreview] = useState(null);
  const [showTypeToggle, setShowTypeToggle] = useState(false);
  const [searchType, setSearchType] = useState("user");
  const [localMatches, setLocalMatches] = useState([]);
  const [globalMatches, setGlobalMatches] = useState([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [selfLastReadMessageId, setSelfLastReadMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  return {
    // State
    conversations, setConversations,
    selectedConversation, setSelectedConversation,
    messages, setMessages,
    readReceipts, setReadReceipts,
    otherLastReadMessageId, setOtherLastReadMessageId,
    otherLastReadMessageCreatedAt, setOtherLastReadMessageCreatedAt,
    firstUnreadIndex, setFirstUnreadIndex,
    messageInput, setMessageInput,
    searchTerm, setSearchTerm,
    loading, setLoading,
    conversationsLoading, setConversationsLoading,
    typing, setTyping,
    typingByConversation, setTypingByConversation,
    isConnected, setIsConnected,
    currentUser, setCurrentUser,
    onlineUsernames, setOnlineUsernames,
    userPresence, setUserPresence,
    searchMode, setSearchMode,
    selectedUserTarget, setSelectedUserTarget,
    groupPreview, setGroupPreview,
    showTypeToggle, setShowTypeToggle,
    searchType, setSearchType,
    localMatches, setLocalMatches,
    globalMatches, setGlobalMatches,
    showScrollToBottom, setShowScrollToBottom,
    selfLastReadMessageId, setSelfLastReadMessageId,

    // Refs
    messagesEndRef,
    containerRef,
    selectedConversationRef,
    typingTimeoutRef,
    isTypingRef
  };
};