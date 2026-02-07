import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FieldInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name,
  required = false,
  style = {}
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="field-group" style={style}>
      {label && <label className="field-label">{label}</label>}
      <div className="field-input-container" style={{ position: 'relative' }}>
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          name={name}
          className="field-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{ paddingRight: isPassword ? '40px' : 'var(--space-sm)' }}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              padding: '0'
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default FieldInput;
