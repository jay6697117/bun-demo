// 聊天消息类型
export interface ChatMessage {
  id: string;
  type: "message" | "join" | "leave" | "system";
  nickname: string;
  content: string;
  timestamp: number;
}

// 历史消息响应
export interface HistoryResponse {
  type: "history";
  messages: ChatMessage[];
}

// WebSocket 消息类型（服务器 -> 客户端）
export type ServerMessage = HistoryResponse | ChatMessage;

// 客户端发送的消息
export interface ClientMessage {
  type: "message";
  content: string;
}
