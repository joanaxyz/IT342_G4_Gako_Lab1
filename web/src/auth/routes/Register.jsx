import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthAPI } from '../hook/useAuthApi';
import AuthLayout from '../layouts/AuthLayout';
import FieldInput from '../../common/components/FieldInput';
import Button from '../../common/components/Button';
import { useNotification } from '../../common/hooks/useNotification';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { addNotification } = useNotification();
    const authAPI = useAuthAPI();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            addNotification("Passwords do not match", "error");
            return;
        }

        try {
            const response = await authAPI.register(
                formData.username,
                formData.email,
                formData.password
            );

            if (response.success) {
                addNotification(response.message || 'Your account has been created successfully. Please check your email for verification.', 'success', 10000);
                navigate('/login');
            } else {
                addNotification(response.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Registration error:', err);
            addNotification('A network error occurred. Please try again.', 'error');
        }
    };

    return (
        <AuthLayout
            title="Create an Account"
            subtitle="Join BrainBox and build your second memory"
        >
            <form onSubmit={handleSubmit}>
                <FieldInput
                    label="Username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <FieldInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <FieldInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <FieldInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <Button type="submit" fullWidth>
                        Register
                    </Button>
                </div>
            </form>

            <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;
