import React, { useState } from 'react';
import '../styles/Chatbot.css';
import { messageAPI } from '../../common/utils/api';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNotif } from '../../common/hooks/useContexts';
import { useLoadingChatbot } from '../hooks/useContexts'
import { useChats, useCategory } from '../hooks/useContexts'
const ChatMessage = ({ message, onMessageUpdate, isLatest, isLatestUserMessage }) => {
    const { getAuthHeaders } = useAuth();
    const headers = getAuthHeaders();
    const { showNotif } = useNotif();
    const { activate: showLoading, deactivate: hideLoading } = useLoadingChatbot();
    const { setCurrentMessages, setChats, chats } = useChats();
    const { currentCategory } = useCategory();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.userMessage || '');
    
    const formatBotResponse = (text) => {
        if (!text) return '';

        let formatted = text;

        // First, escape HTML to prevent XSS
        formatted = formatted
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Process code blocks first (before other formatting)
        formatted = formatted.replace(/```([\s\S]*?)```/g, (match, code) => {
            // Unescape HTML inside code blocks
            const unescaped = code
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
            return `<pre><code class="code-block">${unescaped.trim()}</code></pre>`;
        });

        // Process inline code (but not inside code blocks)
        formatted = formatted.replace(/`([^`\n]+?)`/g, '<code class="inline-code">$1</code>');

        // Process headings (before other formatting)
        const lines = formatted.split('\n');
        formatted = lines.map(line => {
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                return `<h${level}>${headingMatch[2]}</h${level}>`;
            }
            return line;
        }).join('\n');

        // Process blockquotes
        formatted = formatted.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

        // Process horizontal rules
        formatted = formatted.replace(/^[-*_]{3,}$/gm, '<hr>');

        // Process numbered lists (more robust regex)
        formatted = formatted.replace(/(?:^|\n)((?:\s*\d+\.\s+.+(?:\n|$))+)/g, (match, listContent) => {
            const items = listContent.match(/\d+\.\s+(.+)/g) || [];
            const listItems = items.map(item => {
                const content = item.replace(/^\d+\.\s+/, '').trim();
                return `<li>${content}</li>`;
            }).join('');
            return `\n<ol class="bot-list">${listItems}</ol>\n`;
        });

        // Process unordered lists (bullet points)
        formatted = formatted.replace(/(?:^|\n)((?:\s*[-•*]\s+.+(?:\n|$))+)/g, (match, listContent) => {
            const items = listContent.match(/[-•*]\s+(.+)/g) || [];
            const listItems = items.map(item => {
                const content = item.replace(/^[-•*]\s+/, '').trim();
                return `<li>${content}</li>`;
            }).join('');
            return `\n<ul class="bot-list">${listItems}</ul>\n`;
        });

        // Process bold text (**text**)
        formatted = formatted.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        
        // Process italic text (*text*) - but not if it's part of bold
        formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

        // Process links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Process paragraphs - split by double line breaks
        const paragraphs = formatted.split(/\n\s*\n/);
        if (paragraphs.length > 1) {
            formatted = paragraphs
                .map(para => para.trim())
                .filter(para => {
                    // Don't wrap if it's already a block element
                    const trimmed = para.trim();
                    return trimmed.length > 0 && 
                           !trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/) &&
                           !trimmed.match(/^<p>/);
                })
                .map(para => {
                    // Replace single line breaks with <br> within paragraphs
                    const withBreaks = para.replace(/\n(?!\s*<)/g, '<br>');
                    return `<p>${withBreaks}</p>`;
                })
                .join('');
        } else {
            // Single paragraph - replace line breaks with <br>
            formatted = formatted.replace(/\n(?!\s*<)/g, '<br>');
        }

        // Clean up extra whitespace and normalize spacing
        formatted = formatted
            .replace(/\s*<hr>\s*/g, '<hr>')
            .replace(/\n\s*\n/g, '')
            .trim();

        return formatted;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.botMessage);
            showNotif('success', 'Copied to clipboard');
        } catch (err) {
            console.error('Failed to copy message:', err);
        }
    };

    const handleRetry = async () => {
        try {
            showLoading();
            const chatId = message.chatId;
            const response = await messageAPI.retryBot(message.id, currentCategory.id, chatId, headers);
            if (response.success && response.data) {
                const message = response.data;
                setCurrentMessages(prevMessages => {
                    if (prevMessages.length === 0) {
                        return [message];
                    } else {
                        return [...prevMessages.slice(0, -1), message];
                    }
                });
                const chat = chats.find(c => c.id === chatId);
                setChats(prev => prev.filter(c => c.id !== chatId));
                setChats(prev => [...prev, chat]);
            } else {
                // Handle rate limit or other errors
                if (response.status === 429 || (response.message && response.message.includes('Rate limit'))) {
                    const errorMsg = response.message || 'Rate limit exceeded. Please wait a moment and try again.';
                    showNotif('error', errorMsg);
                } else {
                    showNotif('error', response.message || 'Failed to regenerate message. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error retrying bot message:', error);
            showNotif('error', 'An error occurred. Please try again.');
            showNotif('error', 'An error occurred. Please try again.');
        } finally {
            hideLoading();
        }
    };

    const handleLike = async () => {
        const newLikeState = message.like === true ? null : true;
        if (onMessageUpdate) {
            onMessageUpdate(message.id, { like: newLikeState });
        }
        const response = await messageAPI.handleLike(message.id, true, headers);
        console.log(response.message);
    };

    const handleDislike = async () => {
        const newLikeState = message.like === false ? null : false;
        if (onMessageUpdate) {
            onMessageUpdate(message.id, { like: newLikeState });
        }
        const response = await messageAPI.handleLike(message.id, false, headers);
        console.log(response.message);
    };

    const handleDelete = async() => {
        const response = await messageAPI.deleteMessage(message.id, headers);
        setCurrentMessages(prevMessages => 
            prevMessages.filter(msg => msg.id !== message.id)
        );
        console.log(response.message);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(message.userMessage);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(message.userMessage);
    };

    const handleSaveEdit = async () => {
        if (!editText.trim()) return;
        
        try {
            showLoading();
            const response = await messageAPI.updateUserMessage(message.id, editText.trim(), headers);
            if (response.success) {
                setIsEditing(false);
                if (editText.trim() !== message.userMessage) {
                    const chat = chats.find(c => c.id === message.chatId);
                    const chatId = chat.id;
                    const retryResponse = await messageAPI.retryBot(message.id, currentCategory.id, chatId, headers);
                    if (retryResponse.success && retryResponse.data) {
                        const updatedMessage = retryResponse.data;
                        setCurrentMessages(prevMessages => {
                            if (prevMessages.length === 0) {
                                return [updatedMessage];
                            } else {
                                return [...prevMessages.slice(0, -1), updatedMessage];
                            }
                        });
                        setChats(prev => prev.filter(c => c.id !== chatId));
                        setChats(prev => [...prev, chat]);
                    } else {
                        // Handle rate limit errors when editing triggers retry
                        if (retryResponse.status === 429 || (retryResponse.message && retryResponse.message.includes('Rate limit'))) {
                            showNotif('error', retryResponse.message || 'Rate limit exceeded. Please wait a moment before trying again.');
                        } else {
                            showNotif('warning', 'Message updated but failed to regenerate response. ' + (retryResponse.message || 'Please try retrying manually.'));
                        }
                    }
                }
                showNotif('success', 'Message updated');
            } else {
                // Handle errors when updating message fails
                if (response.status === 429 || (response.message && response.message.includes('Rate limit'))) {
                    showNotif('error', response.message || 'Rate limit exceeded. Please wait a moment and try again.');
                } else {
                    showNotif('error', response.message || 'Failed to update message.');
                }
            }
        } catch (error) {
            console.error('Failed to update message:', error);
            showNotif('error', 'Failed to update message');
        } finally {
            hideLoading();
        }
    };

    const ActionButton = ({ type, onClick, ariaLabel }) => {
        const svgPaths = {
            copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
            retry: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
            edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z',
            like: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
            dislike: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z',
            delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
            check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
            cancel: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
        };

        const isActive = (type === 'like' && message.like === true) || (type === 'dislike' && message.like === false);

        return (
            <button
                className={`action-btn ${type}-btn${isActive ? ' active' : ''}`}
                onClick={onClick}
                aria-label={ariaLabel}
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d={svgPaths[type]} />
                </svg>
            </button>
        );
    };

    return (
        <div>
            {message.userMessage && (
                <div className="message user-message">
                    {isEditing ? (
                        <div className="edit-container">
                            <textarea 
                                className="edit-textarea"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        handleCancelEdit();
                                    } else if (e.ctrlKey && e.key === 'Enter') {
                                        handleSaveEdit();
                                    }
                                }}
                                autoFocus
                            />
                            <div className="edit-actions">
                                <button className="edit-action-btn save-btn" onClick={handleSaveEdit} aria-label="Save">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </button>
                                <button className="edit-action-btn cancel-btn" onClick={handleCancelEdit} aria-label="Cancel">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="user-bubble">
                                {message.userMessage}
                            </div>
                            {isLatestUserMessage && (
                                <div className="message-actions user-actions">
                                    <ActionButton type="edit" onClick={handleEdit} ariaLabel="Edit message" />
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
            {message.botMessage && (
                <div className="message bot-message" data-id={message.id}>
                    <div className="bot-message-header">
                        {message.category && (
                            <span className="category-badge" title={`Category: ${message.category}`}>
                                {message.category}
                            </span>
                        )}
                        <div className="bot-text" dangerouslySetInnerHTML={{ __html: formatBotResponse(message.botMessage) }} />
                    </div>
                    <div className="message-actions">
                        <ActionButton type="copy" onClick={handleCopy} ariaLabel="Copy message" />
                        {isLatest && <ActionButton type="retry" onClick={handleRetry} ariaLabel="Retry message" />}
                        <ActionButton type="like" onClick={() => handleLike(message.id)} ariaLabel="Like" />
                        <ActionButton type="dislike" onClick={() => handleDislike(message.id)} ariaLabel="Dislike" />
                        <ActionButton type="delete" onClick={handleDelete} ariaLabel="Delete message" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
