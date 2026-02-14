import { Menu, Bell, HelpCircle } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import logo from '../../assets/logo.svg';

const Navbar = ({ onToggleSidebar }) => {
    return (
        <nav className="home-navbar">
            <div className="navbar-left">
                <button className="icon-button menu-toggle" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
                    <Menu size={24} />
                </button>
                <div className="navbar-logo">
                    <img src={logo} alt="BrainBox Logo" className="logo-icon" />
                    <span className="logo-text">BrainBox</span>
                </div>
            </div>

            <div className="navbar-right">
                <button className="icon-button" title="Help">
                    <HelpCircle size={20} />
                </button>
                <button className="icon-button" title="Notifications">
                    <Bell size={20} />
                </button>
                <ProfileDropdown />
            </div>
        </nav>
    );
};

export default Navbar;
