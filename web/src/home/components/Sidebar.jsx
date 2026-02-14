import { LayoutDashboard, Library, ClipboardList, Layers } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} strokeWidth={1.75} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Library size={20} strokeWidth={1.75} />, label: 'Library', path: '/library' },
    { icon: <ClipboardList size={20} strokeWidth={1.75} />, label: 'Quizzes', path: '/quizzes' },
    { icon: <Layers size={20} strokeWidth={1.75} />, label: 'Flashcards', path: '/flashcards' },
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
