// 聊天消息类型定义
export interface ChatMessage {
  id: string;
  type: "message" | "join" | "leave" | "system";
  nickname: string;
  content: string;
  timestamp: number;
}

// WebSocket 客户端数据
export interface ClientData {
  id: string;
  nickname: string;
}

// 内存存储类
class ChatStore {
  private messages: ChatMessage[] = [];
  private readonly maxMessages = 100;

  addMessage(msg: ChatMessage): void {
    this.messages.push(msg);
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  getRecentMessages(): ChatMessage[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }

  getMessageCount(): number {
    return this.messages.length;
  }
}

// 导出单例
export const chatStore = new ChatStore();

// 生成唯一 ID
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);
