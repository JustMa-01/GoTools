// src/contexts/TributeContext.jsx
import React, { createContext, useState, useContext } from 'react';

const TributeContext = createContext();

export const TributeProvider = ({ children }) => {
    // We use sessionStorage so the loader only shows once per browser session.
    const [hasShownToolLoader, setHasShownToolLoader] = useState(
        () => sessionStorage.getItem('hasShownToolLoader') === 'true'
    );

    const markToolLoaderAsShown = () => {
        sessionStorage.setItem('hasShownToolLoader', 'true');
        setHasShownToolLoader(true);
    };

    const value = { hasShownToolLoader, markToolLoaderAsShown };

    return (
        <TributeContext.Provider value={value}>
            {children}
        </TributeContext.Provider>
    );
};

export const useTribute = () => {
    const context = useContext(TributeContext);
    if (!context) {
        throw new Error('useTribute must be used within a TributeProvider');
    }
    return context;
};