import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import './Chat.css';

export function ChatHeader() {
  const { t } = useTranslation();
  const { closeDrawer, isConnected, isConnecting, disconnect, nickname } = useChat();

  const getStatusText = () => {
    if (isConnecting) return t('chat.connecting');
    if (isConnected) return t('chat.connected');
    return t('chat.disconnected');
  };

  const getStatusClass = () => {
    if (isConnecting) return 'connecting';
    if (isConnected) return 'connected';
    return 'disconnected';
  };

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <h2 className="chat-header-title">{t('chat.title')}</h2>
        <div className="chat-status-badge">
          <span className={`chat-status-dot ${getStatusClass()}`} />
          <span>{nickname || getStatusText()}</span>
        </div>
      </div>

      <div className="chat-header-actions">
        {isConnected && (
          <button
            className="chat-header-btn"
            onClick={disconnect}
            title={t('chat.disconnect')}
          >
            🚪
          </button>
        )}
        <button
          className="chat-header-btn chat-close-btn"
          onClick={closeDrawer}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
