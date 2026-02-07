import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/routes/Register';
import Login from './auth/routes/Login';
import ForgotPassword from './auth/routes/ForgotPassword';
import Logout from './auth/components/Logout';
import ProtectedRoute from './auth/components/ProtectedRoute';
import Chatbot from './chatbot/pages/Chatbot';
import { AuthProvider } from './auth/contexts/AuthContext';
import { LoadingProvider, ModalProvider } from './common/contexts/ActiveContexts';
import { NotificationProvider } from './common/contexts/NotificationContext';
import { ThemeProvider } from './common/contexts/ThemeContext';
import { DropdownProvider } from './common/contexts/DropdownContext';
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
        
        <Route element={<ProtectedRoute />}>
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>

        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/chatbot" replace />} />
        <Route path="*" element={<Navigate to="/chatbot" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <DropdownProvider>
            <LoadingProvider>
              <ModalProvider>
                <AppContent />
              </ModalProvider>
            </LoadingProvider>
          </DropdownProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  )
}

export default App
