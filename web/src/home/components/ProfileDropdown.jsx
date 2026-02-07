import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';
import Modal from '../../common/components/Modal';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
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
                <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>

            <Modal 
                isOpen={showLogoutModal} 
                onClose={() => setShowLogoutModal(false)} 
                title="Confirm Logout"
            >
                <div className="logout-confirm-content">
                    <p>Are you sure you want to log out?</p>
                    <div className="modal-actions" style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)', justifyContent: 'flex-end' }}>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setShowLogoutModal(false)}
                            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-danger" 
                            onClick={confirmLogout}
                            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfileDropdown;
