import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import './Chat.css';

export function MessageInput() {
  const { t } = useTranslation();
  const { sendMessage } = useChat();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed) {
      sendMessage(trimmed);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chat.message.placeholder')}
        maxLength={500}
        autoComplete="off"
      />
      <button
        type="submit"
        className="chat-send-btn"
        disabled={!content.trim()}
        aria-label={t('chat.send')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
        </svg>
      </button>
    </form>
  );
}
