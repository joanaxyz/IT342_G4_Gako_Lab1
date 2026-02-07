import { LayoutDashboard, Database, ClipboardCheck, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Database size={20} />, label: 'Storage', path: '/storage' },
        { icon: <ClipboardCheck size={20} />, label: 'Review', path: '/review' },
        { icon: <BookOpen size={20} />, label: 'Quizzes', path: '/quizzes' },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.label} 
                        to={item.path}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {isOpen && <span className="sidebar-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
