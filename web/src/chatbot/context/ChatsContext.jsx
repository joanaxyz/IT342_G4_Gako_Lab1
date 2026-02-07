import React, { createContext, useState, useMemo, useCallback } from 'react';

export const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);

  const findChat = useCallback((chatId) => {
    return chats.find(c => c.id === chatId) || null;
  }, [chats]);

  const loadChats = useCallback(() => {
    // Static mock chats if needed
  }, []);

  const loadFullChats = useCallback(() => {
    // Static mock chats if needed
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(chat => String(chat.id) !== String(chatId)));
  }, []);

  const value = useMemo(() => ({
    chats,
    setChats,
    loadChats,
    loadFullChats,
    deleteChat,
    findChat,
    currentChat,
    setCurrentChat,
    currentMessages,
    setCurrentMessages,
  }), [chats, deleteChat, findChat, currentChat, currentMessages]);

  return (
    <ChatsContext.Provider value={value}>
      {children}
    </ChatsContext.Provider>
  );
};
