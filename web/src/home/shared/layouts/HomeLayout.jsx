import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar';
import { useNotebook } from '../../../notebook/shared/hooks/useNotebook';
import '../styles/home.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { fetchNotebooks } = useNotebook();

    useEffect(() => {
        fetchNotebooks();
    }, [fetchNotebooks]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="home-layout">
            <Navbar onToggleSidebar={toggleSidebar} />
            <div className="home-main">
                <Sidebar isOpen={isSidebarOpen} />
                <main className={`home-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Home;
