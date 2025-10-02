import { notification, Tag } from "antd";
import {
  BarChartOutlined,
  BellOutlined,
  BookOutlined, CalendarOutlined, ExclamationCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";

export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
};
const formatConversationTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatConversationLastMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isSameDay) {
    return formatConversationTime(timestamp); // Today → show time
  }

  if (isYesterday) {
    return "Yesterday";
  }

  // Calculate start of current week (assuming week starts on Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  const day = startOfWeek.getDay(); // Sun=0 ... Sat=6
  const diffToMonday = (day === 0 ? -6 : 1) - day; // adjust to Monday
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

  if (date >= startOfWeek) {
    // This week → weekday short (Mon, Tue, …)
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  if (date.getFullYear() === now.getFullYear()) {
    // Earlier this year → "Aug 18"
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  // Previous years → "Aug 18, 2023"
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  const options =
    date.getFullYear() === today.getFullYear()
      ? { month: "long", day: "numeric" } // omit year if current year
      : { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString(undefined, options);
};

export const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const replaceOptimisticMessage = (setMessages, newMessage, setSelfLastReadMessageId, setFirstUnreadIndex) => {
  setMessages((prev) => {
    let idx = -1;

    if (newMessage.tempId) {
      idx = prev.findIndex((m) => m.id === newMessage.tempId);
    }

    if (idx === -1) {
      const candidates = prev
        .map((msg, index) => ({ msg, index }))
        .filter(({ msg }) =>
          msg.isOptimistic &&
          msg.senderId === newMessage.senderId &&
          msg.content?.trim() === newMessage.content?.trim()
        );

      if (candidates.length > 0) {
        idx = candidates[candidates.length - 1].index;
      }
    }

    if (idx === -1) {
      const candidates = prev
        .map((msg, index) => ({ msg, index }))
        .filter(({ msg }) =>
          msg.isOptimistic &&
          msg.senderId === newMessage.senderId
        );

      if (candidates.length > 0) {
        idx = candidates[candidates.length - 1].index;
      }
    }

    if (idx !== -1) {
      const updated = [...prev];
      updated[idx] = {
        ...newMessage,
        isRead: false,
        isOptimistic: false
      };
      setSelfLastReadMessageId(newMessage.id);
      setFirstUnreadIndex(updated.length)
      return updated;
    }

    const existingMessage = prev.find(m =>
      m.id === newMessage.id ||
      (!m.isOptimistic && m.content === newMessage.content && m.senderId === newMessage.senderId)
    );

    if (existingMessage) {
      // Message already exists, don't add duplicate
      return prev;
    }

    console.warn('❌ No optimistic message found to replace, adding as new message. This causes duplicates!');
    setSelfLastReadMessageId(newMessage.id);
    return [...prev, { ...newMessage, isRead: false, isOptimistic: false }];
  });
};

export const chatDropdownItems = [
  { key: '1', label: 'View Profile' },
  { key: '2', label: 'Clear Chat', danger: true },
  { key: '3', label: 'Block User', danger: true }
];

export const showAntNotification = (message) => {
  notification.open({
    message: `New message from @${message.senderUsername}`,
    description: message.content,
    icon: <MessageOutlined style={{ color: '#1890ff' }} />,
    duration: 4
  });
};

export const playSendSound = () => {
  const audio = new Audio('/sounds/notify.mp3');
  audio.play().catch(err => {
    console.warn('Send sound blocked:', err);
  });
};

export const RoleIcon = ({ role }) => {
  if (role === "TEACHER") return <span>👨‍🏫</span>;
  if (role === "ADMIN") return <span>🛠️</span>;
  return <span>👨‍🎓</span>; // default = student
};

export const updateTypeConfig = {
  NEWS: { icon: <FileTextOutlined />, color: '#1890ff', label: 'News' },
  ANNOUNCEMENT: { icon: <BellOutlined />, color: '#fa8c16', label: 'Announcement' },
  EVENT: { icon: <CalendarOutlined />, color: '#52c41a', label: 'Event' },
  NOTICE: { icon: <ExclamationCircleOutlined />, color: '#f5222d', label: 'Notice' },
  REPORT: { icon: <BarChartOutlined />, color: '#722ed1', label: 'Report' }
};

export const roleConfig = {
  ALL:     { label: "All Users", color: "#1890ff", icon: <TeamOutlined /> },
  TEACHER: { label: "Teachers",  color: "#52c41a", icon: <BookOutlined /> },
  STUDENT: { label: "Students",  color: "#fa8c16", icon: <UserOutlined /> },
};

export function convertRolesToTargetTag(roles) {
  if (!roles || roles.length === 0) return null;

  const hasStudent = roles.includes("STUDENT");
  const hasTeacher = roles.includes("TEACHER");

  // both student + teacher → All Users
  if (hasStudent && hasTeacher) {
    const cfg = roleConfig.ALL;
    return (
      <Tag icon={cfg.icon} color={cfg.color}>
        {cfg.label}
      </Tag>
    );
  }

  // otherwise → render individually
  return roles.map((role) => {
    const cfg = roleConfig[role];
    return (
      <Tag key={role} icon={cfg?.icon} color={cfg?.color}>
        {cfg?.label}
      </Tag>
    );
  });
}

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const updateDate = new Date(date);
  const diffInHours = Math.floor((now - updateDate) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return updateDate.toLocaleDateString();
};