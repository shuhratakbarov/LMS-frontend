import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 10000;
    this.messageListeners = new Map();
    this.connectionListeners = [];
    this.token = null;
  }

  connect(token) {
    if (this.client && this.client.active) {
      console.warn("WebSocket already active");
      return Promise.resolve(this.client);
    }

    this.token = token;

    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () =>
          new SockJS(process.env.REACT_APP_URL + `ws?token=${token}`),

        debug: (str) => console.log("[WebSocket DEBUG]:", str),
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: (frame) => {
          console.log("✅ Connected to WebSocket:", frame);
          this.connected = true;
          this.reconnectAttempts = 0;
          this.subscribeToOnlineUsers(); // auto-subscribe
          this.connectionListeners.forEach((cb) => cb(true));
          resolve(frame);
        },

        onStompError: (frame) => {
          console.error("❌ STOMP error:", frame);
          this.connected = false;
          this.connectionListeners.forEach((cb) => cb(false));
          reject(new Error("WebSocket connection failed"));
        },

        onDisconnect: () => {
          console.log("⚠️ Disconnected from WebSocket");
          this.connected = false;
          this.connectionListeners.forEach((cb) => cb(false));
          this.handleReconnect();
        },
      });

      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((sub) => {
        if (Array.isArray(sub)) {
          sub.forEach((s) => s.unsubscribe?.());
        } else {
          sub?.unsubscribe?.();
        }
      });

      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      this.connectionListeners.forEach((listener) => listener(false));
      console.log("🔌 WebSocket disconnected manually");
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        if (this.client) {
          this.client.deactivate(); // ensure clean state
        }
        // re-create client to avoid stale SockJS instance
        this.connect(this.token).catch((err) => {
          console.error("Reconnect attempt failed:", err.message);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("❌ Max reconnect attempts reached, giving up.");
    }
  }

  // ========= SUBSCRIPTIONS =========

  subscribeToOnlineUsers() {
    if (!this.connected) return;

    const handleUpdate = (message) => {
      this.safeParse(message.body, (onlineUsers) => {
        if (this.messageListeners.has("onlineUsers")) {
          this.messageListeners.get("onlineUsers").forEach((cb) => cb(onlineUsers));
        }
      });
    };

    const publicSub = this.client.subscribe("/topic/online", handleUpdate);
    const privateSub = this.client.subscribe("/user/queue/online", handleUpdate);

    this.subscriptions.set("onlineUsersPublic", publicSub);
    this.subscriptions.set("onlineUsersPrivate", privateSub);
  }

  subscribeToUserConversations(username, callback) {
    if (!this.connected || !this.client) {
      console.warn("⚠️ WebSocket not connected, cannot subscribe to user feed");
      return null;
    }

    const destination = `/topic/user.${username}.conversations`;

    if (this.subscriptions.has(destination)) {
      this.subscriptions.get(destination).unsubscribe();
      this.subscriptions.delete(destination);
    }

    const sub = this.client.subscribe(destination, (message) => {
      this.safeParse(message.body, (event) => callback(event));
    });

    this.subscriptions.set(destination, sub);

    return () => {
      try {
        sub.unsubscribe();
      } catch (e) { /* ignore */ }
      this.subscriptions.delete(destination);
    };
  }


  // ========= SENDERS =========

  sendMessage(conversationId, content, tempId, messageType = "TEXT") {
    this.safePublish("/app/conversation.sendMessage", {
      conversationId,
      tempId,
      content,
      messageType
    });
  }

  sendTypingStarted(conversationId) {
    this.safePublish("/app/conversation.typing.started", { conversationId });
  }

  sendTypingStopped(conversationId) {
    this.safePublish("/app/conversation.typing.stopped", { conversationId });
  }

  markAsRead(conversationId, messageId) {
    console.log("📤 Sending markAsRead:", conversationId, messageId);
    if (this.client?.connected) {
      this.client.publish({
        destination: "/app/conversation.markAsRead",
        body: JSON.stringify({
          conversationId: conversationId,
          selfLastReadMessageId: messageId,
        }),
      });
    } else {
      console.warn("❌ WebSocket not connected, cannot send markAsRead");
    }
  }

  // ========= HELPERS =========

  isConnected() {
    return this.connected;
  }

  addMessageListener(type, callback) {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, []);
    }
    const listeners = this.messageListeners.get(type);

    if (!listeners.includes(callback)) {
      listeners.push(callback);
    }
  }

  removeMessageListener(type, callback) {
    if (!this.messageListeners.has(type)) return;
    const listeners = this.messageListeners.get(type).filter((cb) => cb !== callback);
    if (listeners.length) {
      this.messageListeners.set(type, listeners);
    } else {
      this.messageListeners.delete(type);
    }
  }

  addConnectionListener(callback) {
    this.connectionListeners.push(callback);
  }

  removeConnectionListener(callback) {
    this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback);
  }

  safeParse(body, callback) {
    try {
      const data = JSON.parse(body);
      callback(data);
    } catch (err) {
      console.warn("Failed to parse message body:", body, err);
    }
  }

  safePublish(destination, body) {
    if (!this.connected) {
      console.warn("⚠️ WebSocket not connected, cannot publish to", destination);
      return;
    }
    console.log("📤 Publishing to", destination, "with body", body);
    this.client.publish({ destination, body: JSON.stringify(body) });
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
