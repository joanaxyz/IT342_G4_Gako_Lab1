import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthAPI } from '../hook/useAuthApi';
import { useAuth } from '../hook/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import FieldInput from '../../common/components/FieldInput';
import Button from '../../common/components/Button';
import { useNotification } from '../../common/hooks/useNotification';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const { addNotification } = useNotification();
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
                
                // Redirect to the page they were trying to access, or dashboard
                const origin = location.state?.from?.pathname || '/dashboard';
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
            subtitle="Enter your details to access your BrainBox"
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

                <div style={{ textAlign: 'right', marginBottom: 'var(--spacing-md)' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <Button type="submit" fullWidth>
                        Log In
                    </Button>
                </div>
            </form>

            <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
