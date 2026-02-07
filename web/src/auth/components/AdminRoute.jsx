import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && user.role !== 'ADMIN') {
        return <Navigate to="/chatbot" replace />;
    }

    if (!user) {
        return null;
    }

    return <Outlet />;
};

export default AdminRoute;
