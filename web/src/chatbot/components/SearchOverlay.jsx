import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useSearch, useChats, useCategory } from '../hooks/useContexts';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = () => {
    const { active: isOpen, deactivate } = useSearch();
    const { fullChats } = useChats();
    console.log(fullChats);
    const { categories } = useCategory();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const selectedItemRef = useRef(null);

    const performSearch = useCallback((query) => {
        console.log('performSearch called with query:', query);
        console.log('fullChats:', fullChats);
        
        if (!query.trim()) {
            setSearchResults([]);
            setAllResults([]);
            setSelectedIndex(-1);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const lowerQuery = query.toLowerCase();
        const results = [];

        fullChats?.forEach(chat => {
            console.log('Searching in chat:', chat.id, 'messages:', chat.messages?.length);
            chat.messages?.forEach((message) => {
                if (message.userMessage && message.userMessage.toLowerCase().includes(lowerQuery)) {
                    console.log('Found match in userMessage:', message.userMessage);
                    results.push({
                        type: 'User Message',
                        chatId: chat.id,
                        messageId: message.id,
                        chatTitle: chat.title || 'Untitled Chat',
                        content: message.userMessage,
                        role: 'user',
                        timestamp: chat.timestamp,
                        category: message.category || 'General'
                    });
                }
                
                if (message.botMessage && message.botMessage.toLowerCase().includes(lowerQuery)) {
                    console.log('Found match in botMessage:', message.botMessage);
                    results.push({
                        type: 'Bot Message',
                        chatId: chat.id,
                        messageId: message.id,
                        chatTitle: chat.title || 'Untitled Chat',
                        content: message.botMessage,
                        role: 'bot',
                        timestamp: chat.timestamp,
                        category: message.category || 'General'
                    });
                }
            });
        });

        console.log('Search results:', results.length);
        setAllResults(results);
        setSelectedIndex(-1);
        setIsSearching(false);
    }, [fullChats]);

    useEffect(() => {
        clearTimeout(searchTimeoutRef.current);
        
        if (!searchQuery.trim()) {
            Promise.resolve().then(() => {
                setSearchResults([]);
                setAllResults([]);
                setSelectedIndex(-1);
            });
            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);

        return () => clearTimeout(searchTimeoutRef.current);
    }, [searchQuery, performSearch]);

    useEffect(() => {
        let filtered = allResults;

        if (currentFilter !== 'all') {
            filtered = filtered.filter(result => 
                result.category?.toLowerCase() === currentFilter.toLowerCase()
            );
        }

        Promise.resolve().then(() => {
            setSearchResults(filtered);
            setSelectedIndex(-1);
        });
    }, [allResults, currentFilter]);

    useEffect(() => {
        if (isOpen) {
            // Use Promise.resolve().then to move state updates to next tick
            // and avoid cascading render warnings in React 19
            Promise.resolve().then(() => {
                setSearchQuery('');
                setSearchResults([]);
                setAllResults([]);
                setSelectedIndex(-1);
                setCurrentFilter('all');
            });
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ 
                block: 'nearest', 
                behavior: 'smooth' 
            });
        }
    }, [selectedIndex]);

    const handleSelectResult = useCallback((result) => {
        const params = new URLSearchParams();
        params.set('id', result.chatId);
        if (result.messageId) {
            params.set('messageId', result.messageId);
        }
        navigate(`/chatbot?${params.toString()}`);
        deactivate();
    }, [navigate, deactivate]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            deactivate();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => 
                Math.min(prev + 1, searchResults.length - 1)
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && searchResults.length > 0 && selectedIndex >= 0) {
            e.preventDefault();
            handleSelectResult(searchResults[selectedIndex]);
        }
    }, [searchResults, selectedIndex, deactivate, handleSelectResult]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen, handleKeyDown]);

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('search-overlay-backdrop')) {
            deactivate();
        }
    };

    const handleClearClick = () => {
        setSearchQuery('');
        inputRef.current?.focus();
    };

    const escapeRegex = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const highlightText = (text, query) => {
        if (!query.trim() || !text) return text;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => 
            part.toLowerCase() === query.toLowerCase() 
                ? <mark key={i}>{part}</mark> 
                : part
        );
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const now = new Date();
        const date = new Date(dateString);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const getTypeIcon = (type) => {
        if (type === 'User Message') {
            return <i className="fas fa-user"></i>;
        }
        return <i className="fas fa-robot"></i>;
    };

    return (
        <div className={`search-overlay ${isOpen ? 'active' : ''}`} onClick={handleBackdropClick}>
            <div className="search-overlay-backdrop"></div>

            <div className="search-overlay-content">
                <div className="search-overlay-header">
                    <div className="search-overlay-input-wrapper">
                        <i className="fas fa-search search-overlay-icon"></i>
                        <input
                            type="text"
                            className="search-overlay-input"
                            id="searchOverlayInput"
                            ref={inputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations, messages, or topics..."
                            autoComplete="off"
                            autoFocus
                        />
                        <button 
                            className={`search-overlay-clear ${searchQuery ? 'visible' : ''}`}
                            id="searchOverlayClear" 
                            title="Clear search"
                            onClick={handleClearClick}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <button 
                        className="search-overlay-close" 
                        id="searchOverlayClose" 
                        title="Close search"
                        onClick={() => deactivate()}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="search-overlay-filters">
                    <button
                        className={`search-filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setCurrentFilter('all')}
                    >
                        All
                    </button>
                    {categories?.map(category => (
                        <button
                            key={category.id}
                            className={`search-filter-btn ${currentFilter === category.name.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setCurrentFilter(category.name.toLowerCase())}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="search-overlay-results" id="searchOverlayResults">
                    {!searchQuery.trim() && (
                        <div className="search-empty-state" id="searchEmptyState">
                            <i className="fas fa-search fa-3x"></i>
                            <h3>Start searching</h3>
                            <p>Type to search through your conversations, messages, and topics</p>
                        </div>
                    )}

                    {isSearching && (
                        <div className="search-loading">
                            <div className="search-loading-spinner"></div>
                            <div className="search-loading-text">Searching...</div>
                        </div>
                    )}

                    {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
                        <div className="search-no-results" id="searchNoResults">
                            <i className="fas fa-exclamation-circle fa-3x"></i>
                            <h3>No results found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    )}

                    {!isSearching && searchResults.length > 0 && (
                        <div className="search-results-list" id="searchResultsList">
                            {searchResults.map((result, index) => (
                                <div
                                    key={`${result.type}-${result.chatId}-${index}`}
                                    ref={index === selectedIndex ? selectedItemRef : null}
                                    className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => handleSelectResult(result)}
                                >
                                    <div className="search-result-header">
                                        <span className={`search-result-type ${result.role === 'user' ? 'user-message' : 'bot-message'} ${result.category?.toLowerCase()}`}>
                                            {getTypeIcon(result.type)}
                                            {result.type}
                                        </span>
                                        <span className="search-result-date">
                                            {formatDate(result.timestamp)}
                                        </span>
                                    </div>
                                    {currentFilter === 'all' && (
                                        <div className="search-result-title">
                                            {result.category}
                                        </div>
                                    )}
                                    <div className="search-result-snippet">
                                        {highlightText(truncateText(result.content), searchQuery)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="search-overlay-footer">
                    <div className="search-shortcuts">
                        <span className="search-shortcut">
                            <kbd>↑</kbd><kbd>↓</kbd> Navigate
                        </span>
                        <span className="search-shortcut">
                            <kbd>Enter</kbd> Select
                        </span>
                        <span className="search-shortcut">
                            <kbd>Esc</kbd> Close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;