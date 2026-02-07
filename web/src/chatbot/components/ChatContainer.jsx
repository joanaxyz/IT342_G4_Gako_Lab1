import React, { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Chatbot.css';
import { useChats, useLoadingChatbot } from '../hooks/useContexts';
import ChatMessage from './ChatMessage';

const ChatContainer = () => {
    const { currentMessages : messages, setCurrentMessages } = useChats();
    const { active: isLoading } = useLoadingChatbot();
    const messagesEndRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const messageIdParam = searchParams.get('messageId');
    const hasScrolledToMessage = useRef(false);
    const preventAutoScrollRef = useRef(false);

    const scrollToBottom = useCallback(() => {
        if (!preventAutoScrollRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        if (messageIdParam) {
            hasScrolledToMessage.current = false;
            preventAutoScrollRef.current = true; // Prevent auto-scroll when we have a messageId
        } else {
            // Only reset preventAutoScroll when messageId is removed (after we've scrolled)
            // This will be handled by the scroll-to-message effect
        }
    }, [messageIdParam]);

    useEffect(() => {
        if (messageIdParam && messages.length > 0 && !hasScrolledToMessage.current) {
            preventAutoScrollRef.current = true;
            setTimeout(() => {
                const messageElement = document.querySelector(`[data-message-id="${messageIdParam}"]`);
                if (messageElement) {
                    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight the message briefly
                    messageElement.classList.add('highlight-message');
                    setTimeout(() => {
                        messageElement.classList.remove('highlight-message');
                    }, 2000);
                    hasScrolledToMessage.current = true;
                    setTimeout(() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('messageId');
                        setSearchParams(newParams, { replace: true });
                        setTimeout(() => {
                            preventAutoScrollRef.current = false;
                        }, 2000);
                    }, 1000);
                } else {
                    preventAutoScrollRef.current = false;
                }
            }, 300);
        }
    }, [messages, messageIdParam, searchParams, setSearchParams]);

    useEffect(() => {
        if (!messageIdParam && !preventAutoScrollRef.current && messages.length > 0 && !isLoading) {
            scrollToBottom();
        }
    }, [messages, isLoading, messageIdParam, scrollToBottom]);

    const handleMessageUpdate = (messageId, updates) => {
        setCurrentMessages(prev => 
            prev.map(msg => 
                msg.id === messageId ? { ...msg, ...updates } : msg
            )
        );
    };

    const getLatestUserMessageIndex = () => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].userMessage) {
                return i;
            }
        }
        return -1;
    };

    const latestUserMessageIndex = getLatestUserMessageIndex();

    return (
        <div className="chat-messages">
            {messages.map((msg, index) => (
                <div 
                    key={msg.id} 
                    className="message-group"
                    data-message-id={msg.id}
                >
                    <ChatMessage 
                        message={msg} 
                        onMessageUpdate={handleMessageUpdate} 
                        isLatest={index === messages.length - 1}
                        isLatestUserMessage={index === latestUserMessageIndex}
                    />
                    {msg.timestamp && (
                        <div className="message-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="message bot-message typing-indicator">
                    <div className="bot-text typing-dots">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>    
    );
};

export default ChatContainer;
