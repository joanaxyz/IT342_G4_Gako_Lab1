import React from 'react';
import { useNotif } from '../hooks/useContexts';

export const Notification = ({ notification }) => {
    const { removeNotification } = useNotif();

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
    const { notifications } = useNotif();

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
        </div>
    );
};
