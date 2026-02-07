import React, { createContext, useState, useCallback, useMemo } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const notification = { id, message, type };
        
        setNotifications(prev => [...prev, notification]);

        if (duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, [removeNotification]);

    const showNotif = useCallback((type, message, duration = 5000) => {
        return addNotification(message, type, duration);
    }, [addNotification]);

    const value = useMemo(() => ({
        notifications,
        addNotification,
        removeNotification,
        showNotif
    }), [notifications, addNotification, removeNotification, showNotif]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
