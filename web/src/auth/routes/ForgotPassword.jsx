import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthAPI } from '../hook/useAuthApi';
import AuthLayout from '../layouts/AuthLayout';
import FieldInput from '../../common/components/FieldInput';
import Button from '../../common/components/Button';
import { useNotification } from '../../common/hooks/useNotification';
import '../styles/ForgotPassword.css';

const STEPS = {
    EMAIL: 'EMAIL',
    CODE: 'CODE',
    RESET: 'RESET'
};

const ForgotPassword = () => {
    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [resetToken, setResetToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { addNotification } = useNotification();
    const authAPI = useAuthAPI();
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // Handle email submission
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authAPI.forgotPassword(email);
            if (response.success) {
                addNotification('Verification code sent to your email', 'success');
                setStep(STEPS.CODE);
            } else {
                addNotification(response.message || 'Failed to send verification code', 'error');
            }
        } catch (err) {
            addNotification('A network error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle verification code input
    const handleCodeChange = (index, value) => {
        // Only allow numbers
        const lastChar = value.slice(-1);
        if (lastChar && !/^\d$/.test(lastChar)) return;

        const newCode = [...code];
        newCode[index] = lastChar;
        setCode(newCode);

        // Move to next input
        if (lastChar && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        pastedData.split('').forEach((char, idx) => {
            if (idx < 6) newCode[idx] = char;
        });
        setCode(newCode);

        // Focus the last filled input or the next empty one
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            addNotification('Please enter the full 6-digit code', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.verifyCode(email, fullCode);
            if (response.success) {
                setResetToken(response.data.resetToken);
                addNotification('Code verified successfully', 'success');
                setStep(STEPS.RESET);
            } else {
                addNotification(response.message || 'Invalid verification code', 'error');
            }
        } catch (err) {
            addNotification('A network error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle password reset submission
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.confirmPassword) {
            addNotification('Passwords do not match', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.resetPassword(resetToken, passwordData.password);
            if (response.success) {
                addNotification('Password reset successfully! You can now log in.', 'success');
                navigate('/login');
            } else {
                addNotification(response.message || 'Failed to reset password', 'error');
            }
        } catch (err) {
            addNotification('A network error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case STEPS.EMAIL:
                return (
                    <form onSubmit={handleEmailSubmit}>
                        <FieldInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Send Reset Code
                            </Button>
                        </div>
                    </form>
                );
            case STEPS.CODE:
                return (
                    <form onSubmit={handleCodeSubmit}>
                        <p className="step-description">Enter the 6-digit code sent to <strong>{email}</strong></p>
                        <div className="code-inputs-container">
                            {code.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    onPaste={handlePaste}
                                    ref={(el) => (inputRefs.current[idx] = el)}
                                    className="code-input-box"
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Verify Code
                            </Button>
                        </div>
                        <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                            <button 
                                type="button" 
                                className="text-button" 
                                onClick={() => setStep(STEPS.EMAIL)}
                                disabled={isLoading}
                            >
                                Back to email
                            </button>
                        </div>
                    </form>
                );
            case STEPS.RESET:
                return (
                    <form onSubmit={handleResetSubmit}>
                        <FieldInput
                            label="New Password"
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            value={passwordData.password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <FieldInput
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Reset Password
                            </Button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    const getTitles = () => {
        switch (step) {
            case STEPS.EMAIL:
                return { title: 'Forgot Password', subtitle: 'No worries, we\'ll send you reset instructions.' };
            case STEPS.CODE:
                return { title: 'Verify Your Email', subtitle: 'Please enter the verification code.' };
            case STEPS.RESET:
                return { title: 'Set New Password', subtitle: 'Your new password must be different from previous ones.' };
            default:
                return { title: 'Forgot Password', subtitle: '' };
        }
    };

    const { title, subtitle } = getTitles();

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            {renderStep()}
            <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
