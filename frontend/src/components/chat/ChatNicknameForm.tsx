import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import './Chat.css';

export function ChatNicknameForm() {
  const { t } = useTranslation();
  const { connect, isConnecting } = useChat();
  const [nickname, setNickname] = useState('');

  // 自动填充 localStorage 中的历史昵称
  useEffect(() => {
    const savedNickname = localStorage.getItem('chat_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed) {
      connect(trimmed);
    }
  };

  return (
    <form className="chat-nickname-form" onSubmit={handleSubmit}>
      <span className="chat-nickname-icon">👤</span>
      <h3 className="chat-nickname-title">{t('chat.title')}</h3>
      <input
        type="text"
        className="chat-nickname-input"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder={t('chat.nickname.placeholder')}
        maxLength={20}
        autoFocus
        disabled={isConnecting}
      />
      <button
        type="submit"
        className="chat-nickname-submit"
        disabled={!nickname.trim() || isConnecting}
      >
        {isConnecting ? t('chat.connecting') : t('chat.connect')}
      </button>
    </form>
  );
}
