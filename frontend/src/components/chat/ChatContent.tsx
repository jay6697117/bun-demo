import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import './Chat.css';

export function ChatContent() {
  return (
    <div className="chat-content">
      <MessageList />
      <MessageInput />
    </div>
  );
}
