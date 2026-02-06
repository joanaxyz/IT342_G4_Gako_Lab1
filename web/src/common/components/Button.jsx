import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false,
  style = {} 
}) => {
  const className = `btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`;
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={className}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
