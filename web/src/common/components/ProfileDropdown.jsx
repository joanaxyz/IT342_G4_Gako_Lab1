import React, { useEffect, useRef } from 'react';
import DropdownItem from './DropdownItem';
import { useProfile } from '../../chatbot/hooks/useContexts';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getUserInitials, getUserAvatarColor } from '../utils/userUtils';

const ProfileDropdown = () => {
    const { active: isOpen, deactivate } = useProfile();
    const { user, logout } = useAuth();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                deactivate();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen, deactivate]);

    if (!user) return null;
    const role = typeof user.role === 'string' && user.role.length ? user.role : 'User';
    const roleClass = role.toLowerCase().replace(/\s+/g, '-');
    const badgeClass = ['user-role-badge', roleClass].filter(Boolean).join(' ');
    const initials = getUserInitials(user);
    const avatarColor = getUserAvatarColor(user);
    
    return (
        <div ref={dropdownRef} className={`profile-dropdown ${ isOpen ? 'active' : '' }`}>
            <div className="profile-header">
                <div className="profile-image-placeholder" style={{ backgroundColor: avatarColor }}>
                    {initials}
                </div>
                <div className="profile-info">
                    <div className="profile-name">{user.name || user.email}</div>
                    <span className={badgeClass}>{role}</span>
                </div>
            </div>

            <DropdownItem
                label="Back to Chatbot"
                hidden={location.pathname === '/chatbot'}
                className="chatbot-item"
                onClick={()=> navigate('/chatbot')}
                icon={<i className="fas fa-comment-dots"></i>}
            />

            <DropdownItem
                label="Admin"
                hidden={role !== 'ADMIN' || location.pathname === '/admin'}
                className="admin-item"
                onClick={() => navigate('/admin')}
                icon={<i className="fas fa-star"></i>}
            />
            <DropdownItem
                label="Logout"
                className="logout-item"
                onClick={logout}
                icon={<i className="fas fa-sign-out-alt"></i>}
            />
        </div>
    );
};

export default ProfileDropdown;