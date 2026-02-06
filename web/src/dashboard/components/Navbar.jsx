import ProfileDropdown from './ProfileDropdown';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">BrainBox</Link>
            </div>
            <div className="navbar-actions">
                <ProfileDropdown />
            </div>
        </nav>
    );
};

export default Navbar;
