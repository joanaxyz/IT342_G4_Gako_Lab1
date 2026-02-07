import React from 'react';
import { useNavigate } from "react-router-dom";

const ChatMenu = () => {
    const navigate = useNavigate();
    
    return (
        <div className="chat-menu-section">
            <div 
                className="new-chat-btn"
                onClick={() => navigate('/chatbot?id=null')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/chatbot?id=null');
                    }
                }}
            >
                <i className="fa-solid fa-plus"></i>
                <span>New Chat</span>
            </div>
        </div>
    );
};

export default ChatMenu;
