import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '../../types/chat';
import './Chat.css';

interface MessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
  const { t } = useTranslation();

  // 系统消息（加入/离开/系统）
  if (message.type !== 'message') {
    let text = message.content;
    let typeClass = '';

    if (message.type === 'join') {
      text = t('chat.join', { nickname: message.nickname });
      typeClass = 'join';
    } else if (message.type === 'leave') {
      text = t('chat.leave', { nickname: message.nickname });
      typeClass = 'leave';
    }

    return (
      <div className={`chat-message-system ${typeClass}`}>
        {text}
      </div>
    );
  }

  // 普通消息
  return (
    <div className={`chat-message ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <span className="chat-message-nickname">{message.nickname}</span>
      )}
      <div className="chat-message-bubble">{message.content}</div>
      <span className="chat-message-time">{formatTime(message.timestamp)}</span>
    </div>
  );
}
