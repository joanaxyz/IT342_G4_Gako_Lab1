import React, { useEffect, useRef, useState } from 'react';
import { useDropdown } from '../hooks/useContexts';

const Dropdown = ({ label = "Category", selectedLabel = "", icon = null, className, items = [], onSelect }) => {
    const containerClass = ['dropdown-container', className].filter(Boolean).join(' ');
    const { toggleDropdown, isOpen, closeDropdown } = useDropdown();
    const dropdownRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
                setSearchQuery('');
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeDropdown]);

    const handleToggle = () => {
        if (isOpen) {
            setSearchQuery('');
        }
        toggleDropdown();
    };

    useEffect(() => {
        const currentDropdown = dropdownRef.current;
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                setSearchQuery(prev => prev.slice(0, -1));
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                setSearchQuery(prev => prev + e.key);
            }
        };

        currentDropdown?.addEventListener('keydown', handleKeyDown);
        return () => {
            currentDropdown?.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (item) => {
        if (onSelect) {
            onSelect(item);
        }
        setSearchQuery('');
        closeDropdown();
    };

    const renderIcon = (itemIcon) => {
        if (!itemIcon) return null;
        if (typeof itemIcon === 'string') {
            return <span dangerouslySetInnerHTML={{ __html: itemIcon }} />;
        }
        return itemIcon;
    };

    const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItems = () => {
        if (!filteredItems.length) {
            return (
                <div className="dropdown-option" key="dropdown-empty">
                    {searchQuery ? 'No matches found' : 'No options available'}
                </div>
            );
        }

        return filteredItems.map((item) => {
            const key = item.value ?? item.id ?? item.label;
            const optionClass = ['dropdown-option', item.isSelected ? 'selected' : ''].filter(Boolean).join(' ');

            return (
                <div
                    key={key}
                    className={optionClass}
                    onClick={() => handleSelect(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelect(item);
                        }
                    }}
                >
                    {renderIcon(item.icon)}
                    <span>{item.label}</span>
                </div>
            );
        });
    };

    return (
        <div className={containerClass} ref={dropdownRef}>
            {label && <label className="dropdown-label">{label}</label>}

            <div className={`dropdown ${isOpen ? 'active' : ''}`}>
                <button
                    className="dropdown-btn"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={handleToggle}
                >
                    {icon && <span className="dropdown-icon">{icon}</span>}
                    <span className="dropdown-selected">{selectedLabel || 'Select'}</span>
                    <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
                </button>

                <div className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
                    {renderItems()}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
