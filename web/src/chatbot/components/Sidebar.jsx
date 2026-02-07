import React, { useMemo, useState, useEffect } from 'react';
import ThemeToggle from '../../common/components/ThemeToggle';
import Dropdown from '../../common/components/Dropdown';
import ProfileDropdown from '../../common/components/ProfileDropdown';
import ChatMenu from './ChatMenu';
import ChatHistory from './ChatHistory';
import UserProfile from '../../common/components/UserProfile';
import { useSearch, useCategory } from '../hooks/useContexts';

const Sidebar = ({ isMobileOpen = false, onCloseMobile }) => {
    const { activate } = useSearch();
    const { categories, currentCategory, selectCategory } = useCategory();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const dropdownItems = useMemo(() => (
        [...categories].sort((a, b) => a.name.localeCompare(b.name)).map((cat) => ({
            id: cat.id,
            value: cat.id,
            label: cat.name,
            icon: cat.icon,
            isSelected: currentCategory?.id === cat.id,
            data: cat,
        }))
    ), [categories, currentCategory]);

    const handleCollapseClick = () => {
        if (isMobile && onCloseMobile) {
            onCloseMobile();
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-top-row">
                    <button 
                        className="sidebar-collapse-btn" 
                        onClick={handleCollapseClick}
                        aria-label={isMobile ? 'Close sidebar' : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
                    >
                        <i className={`fa-solid ${isMobile ? 'fa-xmark' : `fa-angles-${isCollapsed ? 'right' : 'left'}`}`}></i>
                    </button>
                    <ThemeToggle />
                </div>
                
                <div className="search-container">
                    <button className="search-btn" onClick={() => activate()}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>Search</span>
                    </button>
                </div>
                
                <Dropdown
                    label="Categories"
                    selectedLabel={currentCategory?.name || 'All'}
                    icon={<i className="fa-solid fa-layer-group"></i>}
                    className="custom-dropdown"
                    items={dropdownItems}
                    onSelect={(item) => selectCategory(item.data)}
                />

                <div className="sidebar-menu">
                    <ChatMenu />
                    <ChatHistory />
                </div>
                
                <div className="sidebar-footer">
                    <div className="profile-container">
                        <UserProfile />
                        <ProfileDropdown />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
