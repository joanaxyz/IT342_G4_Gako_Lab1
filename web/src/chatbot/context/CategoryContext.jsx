import React, { createContext, useState, useMemo, useCallback } from 'react';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) =>{
    const [ categories, setCategories ] = useState([
        { id: 1, name: 'General', icon: 'fa-solid fa-info-circle' },
        { id: 2, name: 'Admissions', icon: 'fa-solid fa-user-plus' },
        { id: 3, name: 'Academics', icon: 'fa-solid fa-book' },
        { id: 4, name: 'Facilities', icon: 'fa-solid fa-building' },
    ]);
    const [ currentCategory, setCurrentCategory ] = useState(categories[0]);
    
    const selectCategory = useCallback((category) => {
        setCurrentCategory(category);
    }, []);

    const value = useMemo(() => ({
      categories,
      setCategories,
      currentCategory,
      setCurrentCategory,
      selectCategory,
    }), [categories, currentCategory, selectCategory]);

    return (
      <CategoryContext.Provider value={value}>
        {children}
      </CategoryContext.Provider>
    );
};
