import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { ChatMessage, ServerMessage, ClientMessage } from "../types/chat";

interface ChatContextValue {
  isOpen: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  nickname: string | null;
  messages: ChatMessage[];
  toggleDrawer: () => void;
  closeDrawer: () => void;
  connect: (nickname: string) => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const WS_URL = "ws://localhost:3000/ws/chat";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback((nick: string) => {
    if (wsRef.current) return;

    setIsConnecting(true);
    const ws = new WebSocket(`${WS_URL}?nickname=${encodeURIComponent(nick)}`);

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setNickname(nick);
      // 保存昵称到 localStorage
      localStorage.setItem("chat_nickname", nick);
    };

    ws.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);

        if ("type" in data && data.type === "history") {
          setMessages(data.messages);
        } else {
          setMessages((prev) => [...prev, data as ChatMessage]);
        }
      } catch (e) {
        console.error("解析消息失败:", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setNickname(null);
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error("WebSocket 错误:", error);
      setIsConnecting(false);
    };

    wsRef.current = ws;
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    setMessages([]);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && content.trim()) {
      const msg: ClientMessage = { type: "message", content: content.trim() };
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        isConnected,
        isConnecting,
        nickname,
        messages,
        toggleDrawer,
        closeDrawer,
        connect,
        disconnect,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
