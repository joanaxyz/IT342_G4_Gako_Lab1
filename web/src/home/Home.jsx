import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './styles/home.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
