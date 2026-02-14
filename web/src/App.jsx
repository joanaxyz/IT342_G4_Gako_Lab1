import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/routes/Register';
import Login from './auth/routes/Login';
import ForgotPassword from './auth/routes/ForgotPassword';
import Logout from './auth/components/Logout';
import Dashboard from './home/routes/Dashboard';
import Home from './home/Home';
import Library from './home/routes/Library';
import Quizzes from './home/routes/Quizzes';
import Flashcards from './home/routes/Flashcards';
import Profile from './home/routes/Profile';
import EditorLayout from './note/layouts/EditorLayout';
import NoteEditorPage from './note/routes/NoteEditorPage';
import ProtectedRoute from './auth/components/ProtectedRoute';
import { AuthProvider } from './auth/contexts/AuthContext';
import { LoadingProvider, ModalProvider } from './common/contexts/ActiveContexts';
import { NotificationProvider } from './common/contexts/NotificationContext';
import { NotificationContainer } from './common/components/Notification';
import LoadingOverlay from './common/components/LoadingOverlay';
import { useLoading } from './common/hooks/useActive';

const Placeholder = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>This section is under development.</p>
  </div>
);

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
        
        <Route element={<ProtectedRoute><Home /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute><EditorLayout /></ProtectedRoute>}>
          <Route path="/notebook/:id" element={<NoteEditorPage />} />
        </Route>

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
