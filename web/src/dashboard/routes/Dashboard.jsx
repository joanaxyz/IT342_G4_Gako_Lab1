import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-container">
                <h1>Welcome to Dashboard</h1>
                <p>This is your protected dashboard area.</p>
            </main>
        </div>
    );
};

export default Dashboard;
