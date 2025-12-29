import { useChat } from '../../contexts/ChatContext';
import './Chat.css';

export function ChatFloatingButton() {
  const { toggleDrawer, isConnected } = useChat();

  return (
    <button className="chat-fab" onClick={toggleDrawer} aria-label="Open chat">
      <span className="chat-fab-icon">💬</span>
      <span className={`chat-fab-status ${isConnected ? 'connected' : 'disconnected'}`} />
    </button>
  );
}
