import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import { MessageItem } from './MessageItem';
import './Chat.css';

export function MessageList() {
  const { t } = useTranslation();
  const { messages, nickname } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 新消息时自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="chat-message-list">
        <div className="chat-empty-state">
          <span className="chat-empty-icon">💬</span>
          <span>{t('chat.empty')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message-list">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          isOwn={msg.nickname === nickname}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
