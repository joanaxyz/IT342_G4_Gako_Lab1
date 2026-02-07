import React from 'react';
import { useProfile } from '../../chatbot/hooks/useContexts';
import { useAuth } from '../../auth/hooks/useAuth';
import { getUserInitials, getUserAvatarColor } from '../utils/userUtils';

const UserProfile = () => {
    const { active: isOpen, activate, deactivate } = useProfile();
    const { user } = useAuth();
    const displayName = user?.username || user?.email?.split('@')[0] || 'User';
    const initials = getUserInitials(user);
    const avatarColor = getUserAvatarColor(user);
    
    return (
        <div className="user-profile" onClick={(e) => {
            e.stopPropagation();
            isOpen ? deactivate() : activate();
        }}>
            <div 
                className="user-avatar" 
                style={{ 
                    backgroundColor: avatarColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '14px'
                }}
            >
                {initials}
            </div>
            <span className="user-name">{displayName}</span>
        </div>
    );
};

export default UserProfile;