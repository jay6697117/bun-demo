import { useChat } from '../../contexts/ChatContext';
import { ChatHeader } from './ChatHeader';
import { ChatNicknameForm } from './ChatNicknameForm';
import { ChatContent } from './ChatContent';
import './Chat.css';

export function ChatDrawer() {
  const { isOpen, closeDrawer, isConnected } = useChat();

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={`chat-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeDrawer}
      />

      {/* 抽屉 */}
      <div className={`chat-drawer ${isOpen ? 'open' : ''}`}>
        <ChatHeader />
        {isConnected ? <ChatContent /> : <ChatNicknameForm />}
      </div>
    </>
  );
}
