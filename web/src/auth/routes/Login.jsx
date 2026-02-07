import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthAPI } from '../hooks/useAuthApi';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import FieldInput from '../../common/components/FieldInput';
import Button from '../../common/components/Button';
import { useNotif } from '../../common/hooks/useContexts';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const { addNotification } = useNotif();
    const { setSession } = useAuth();
    const authAPI = useAuthAPI();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('verified') === 'true') {
            addNotification('Email verified successfully! You can now log in.', 'success');
            // Clean up the URL
            navigate('/login', { replace: true });
        }
    }, [location, addNotification, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await authAPI.login(
                formData.username,
                formData.password
            );

            if (response.success) {
                setSession(response.data.accessToken, response.data.refreshToken);
                addNotification('Successfully logged in!', 'success');
                
                // Redirect to the page they were trying to access, or chatbot
                const origin = location.state?.from?.pathname || '/chatbot';
                navigate(origin, { replace: true });
            } else {
                addNotification(response.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (err) {
            console.error('Login error:', err);
            addNotification('A network error occurred. Please try again.', 'error');
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your details to access StudentLink"
        >
            <form onSubmit={handleSubmit}>
                <FieldInput
                    label="Username/Email"
                    name="username"
                    placeholder="Enter your username or email"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <FieldInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                    <Link to="/forgot-password" size="sm" className="auth-link" style={{ fontSize: '0.875rem' }}>
                        Forgot password?
                    </Link>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <Button type="submit" fullWidth>
                        Log In
                    </Button>
                </div>
            </form>

            <div className="auth-footer-text">
                Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
