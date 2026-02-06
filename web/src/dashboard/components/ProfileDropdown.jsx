import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            <button className="profile-trigger" onClick={toggleDropdown}>
                <div className="avatar">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span>{user?.username || 'User'}</span>
            </button>
            <div className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
                <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                    View Profile
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;
