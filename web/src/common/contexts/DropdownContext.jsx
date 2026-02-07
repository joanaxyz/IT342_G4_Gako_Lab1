import React, { createContext, useState, useCallback } from 'react';

export const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const selectValue = useCallback((value) => {
    setSelectedValue(value);
    setIsOpen(false);
  }, []);

  const value = {
    isOpen,
    selectedValue,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectValue,
  };

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
};
