import React from 'react';
import '../styles/loading_overlay.css';

const LoadingOverlay = ({ isActive }) => {
    return (
        <div className={`loading-overlay ${isActive ? 'active' : ''}`}>
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
