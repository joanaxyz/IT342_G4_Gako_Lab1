import React from 'react';

const DropdownItem = ({ icon, label, onClick, hidden, className, children }) => {
    if (hidden) return null;

    const classes = ['profile-dropdown-item', 'dropdown-item', className].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {icon}
            {label && <span className="dropdown-item-text">{label}</span>}
            {children}
        </div>
    );
};

export default DropdownItem;