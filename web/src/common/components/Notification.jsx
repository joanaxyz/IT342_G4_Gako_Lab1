import React from 'react';
import { useNotification } from '../hooks/useNotification';

export const Notification = ({ notification }) => {
    const { removeNotification } = useNotification();

    return (
        <div className={`notification notification-${notification.type}`}>
            <span>{notification.message}</span>
            <button 
                className="notification-close" 
                onClick={() => removeNotification(notification.id)}
            >
                &times;
            </button>
        </div>
    );
};

export const NotificationContainer = () => {
    const { notifications } = useNotification();

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
        </div>
    );
};
