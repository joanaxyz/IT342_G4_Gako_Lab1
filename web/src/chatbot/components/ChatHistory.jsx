import React, { useMemo } from 'react';
import { useChats } from '../hooks/useContexts';
import { useNavigate } from "react-router-dom";

const ChatHistory = () => {
    const { chats, deleteChat, currentChatId: currentId } = useChats();
    const navigate = useNavigate();
    
    const groupedChats = useMemo(() => {
        if (!chats || chats.length === 0) {
            return { today: [], yesterday: [], older: [] };
        }
        
        const sorted = [...chats].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const grouped = {
            today: [],
            yesterday: [],
            older: []
        };
        
        sorted.forEach(chat => {
            const chatDate = new Date(chat.timestamp);
            const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());
            
            if (chatDay.getTime() === today.getTime()) {
                grouped.today.push(chat);
            } else if (chatDay.getTime() === yesterday.getTime()) {
                grouped.yesterday.push(chat);
            } else {
                grouped.older.push(chat);
            }
        });
        
        return grouped;
    }, [chats]);

    const renderChat = (chat) => {
        return (
            <div
                key={chat.id}
                className={`chat-history-item ${String(chat.id) === currentId ? "active" : ""}`}
                onClick={() => navigate(`/chatbot?id=${chat.id}`)}
            >
                <i className="fa-regular fa-comment"></i>
                <span className="chat-title">
                    {chat.title || "Untitled Chat"}
                </span>

                <button
                    className="delete-chat-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                    }}
                    title="Delete chat"
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        );
    };
    
    const renderGroup = (chats, label) => {
        if (chats.length === 0) return null;
        
        return (
            <div key={label} className="chat-history-group">
                <div className="chat-history-date-header">{label}</div>
                {chats.map(chat => renderChat(chat))}
            </div>
        );
    };
    
    if (!chats || chats.length === 0) {
        return <div className="no-chats">No chat history yet</div>;
    }
    
    return (
        <div className="chat-history-section">
            <div className="chat-history-list">
                {currentId === 'null' && 
                    renderChat({id: null, title: 'New Chat'})
                }
                {renderGroup(groupedChats.today, 'Today')}
                {renderGroup(groupedChats.yesterday, 'Yesterday')}
                {renderGroup(groupedChats.older, 'Older')}
            </div>
        </div>
    );
};

export default ChatHistory;
