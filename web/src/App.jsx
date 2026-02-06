import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/routes/Register';
import Login from './auth/routes/Login';
import ForgotPassword from './auth/routes/ForgotPassword';
import Logout from './auth/components/Logout';
import Dashboard from './dashboard/routes/Dashboard';
import Profile from './dashboard/routes/Profile';
import ProtectedRoute from './auth/components/ProtectedRoute';
import { AuthProvider } from './auth/contexts/AuthContext';
import { LoadingProvider, ModalProvider } from './common/contexts/ActiveContexts';
import { NotificationProvider } from './common/contexts/NotificationContext';
import { NotificationContainer } from './common/components/Notification';
import LoadingOverlay from './common/components/LoadingOverlay';
import { useLoading } from './common/hooks/useActive';

const AppContent = () => {
  const { active: isLoading } = useLoading();
  
  return (
    <>
      <LoadingOverlay isActive={isLoading} />
      <NotificationContainer />
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <LoadingProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </LoadingProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
