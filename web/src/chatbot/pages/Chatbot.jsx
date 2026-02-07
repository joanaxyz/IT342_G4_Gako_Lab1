import React, { useState, useRef } from 'react';
import { Bot } from 'lucide-react';
import '../styles/Chatbot.css';
import Sidebar from '../components/Sidebar';
import SearchOverlay from '../components/SearchOverlay';
import ChatContainer from '../components/ChatContainer'
import PresetOptions from '../components/PresetOptions';
import { useChats, useLoadingChatbot } from '../hooks/useContexts'
import { ChatsProvider } from '../context/ChatsContext';
import { SearchProvider, ProfileProvider, LoadingChatbotProvider } from '../../common/contexts/ActiveContexts';
import { CategoryProvider } from '../context/CategoryContext';

const ChatbotContent = () => {
    const { currentMessages, setCurrentMessages } = useChats();
    const [inputValue, setInputValue] = useState('');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { active: isLoading } = useLoadingChatbot();
    const textareaRef = useRef(null);

    const autoExpandTextarea = () => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = 'auto';
        const computedStyle = window.getComputedStyle(textareaRef.current);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const scrollHeight = textareaRef.current.scrollHeight;
        const contentHeight = scrollHeight - paddingTop - paddingBottom;
        const newHeight = Math.max(52, Math.min(contentHeight, 200));
        textareaRef.current.style.height = newHeight + 'px';
    };

    const sendMessage = () => {
        const text = inputValue.trim();
        if (!text) return;

        const userMessage = { userMessage: text, botMessage: "API integration is not yet implemented.", id: Date.now() };
        setCurrentMessages(prev => [...prev, userMessage]);
        setInputValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '52px';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    const handlePresetClick = (presetText) => {
        setInputValue(presetText);
        if (textareaRef.current) {
            textareaRef.current.focus();
            autoExpandTextarea();
        }
    };

    return (
        <div className="chat-container chatbot-page">
            <button 
                className="mobile-menu-btn" 
                onClick={toggleMobileSidebar}
                aria-label="Toggle menu"
            >
                <i className="fas fa-bars"></i>
            </button>
            <div 
                className={`sidebar-overlay ${isMobileSidebarOpen ? 'active' : ''}`}
                onClick={closeMobileSidebar}
            ></div>
            <Sidebar isMobileOpen={isMobileSidebarOpen} onCloseMobile={closeMobileSidebar} />
            <div className="chat-main">
                <div className="chat-content-wrapper">
                    <div className="chat-header">
                        <div className="bot-avatar">
                            <Bot size={24} />
                        </div>
                        <span className="bot-name">StudentLink</span>
                    </div>
                    <ChatContainer />

                    {currentMessages.length === 0 && <PresetOptions onPresetClick={handlePresetClick} />}

                    <div className="chat-input-container">
                        <div className="chat-input-wrapper">
                            <textarea
                                ref={textareaRef}
                                className="chat-input"
                                placeholder="Ask questions about the school (events, directions, services, etc.)"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    autoExpandTextarea();
                                }}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            ></textarea>
                            <button
                                className="send-button"
                                aria-label="Send message"
                                onClick={sendMessage}
                                disabled={isLoading}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <SearchOverlay />
        </div>
    );
};

const Chatbot = () => {
    return (
        <SearchProvider>
            <ProfileProvider>
                <ChatsProvider>
                    <CategoryProvider>
                        <LoadingChatbotProvider>
                            <ChatbotContent />
                        </LoadingChatbotProvider>
                    </CategoryProvider>
                </ChatsProvider>
            </ProfileProvider>
        </SearchProvider>
    );
};

export default Chatbot;
