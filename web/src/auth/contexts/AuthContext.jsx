import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI, getCookie, getAuthHeaders } from '../../common/utils/api';

export const AuthContext = createContext(null);

const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie('refreshToken'));
    const [user, setUser] = useState(null);

    const fetchUser = useCallback(async () => {
        const response = await authAPI.getMe();
        if (response.success) {
            setUser(response.data);
        } else {
            // If fetching user fails, maybe the token is invalid
            setIsAuthenticated(false);
            deleteCookie('accessToken');
            deleteCookie('refreshToken');
        }
    }, []);

    const logout = useCallback(async () => {
        const refreshToken = getCookie('refreshToken');
        if (refreshToken) {
            await authAPI.logout(refreshToken);
        }
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
            logout();
            return null;
        }

        const response = await authAPI.refreshToken(refreshToken);
        if (response.success) {
            setCookie('accessToken', response.data.accessToken, 1); // Access token usually short-lived
            // If refresh token rotated, update it too
            if (response.data.refreshToken) {
                setCookie('refreshToken', response.data.refreshToken, 7);
            }
            return response.data.accessToken;
        } else {
            logout();
            return null;
        }
    }, [logout]);

    const setSession = (accessToken, refreshToken) => {
        if (accessToken) setCookie('accessToken', accessToken, 1);
        if (refreshToken) setCookie('refreshToken', refreshToken, 7);
        setIsAuthenticated(true);
    };

    useEffect(() => {
        const refreshToken = getCookie('refreshToken');
        const accessToken = getCookie('accessToken');

        if (refreshToken && !accessToken) {
            refreshAccessToken();
        } else if (!refreshToken && isAuthenticated) {
            logout();
        } else if (isAuthenticated && !user) {
            fetchUser();
        }
    }, [isAuthenticated, refreshAccessToken, logout, fetchUser, user]);

    // Token refresh interval (e.g., every 15 minutes)
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            refreshAccessToken();
        }, 15 * 60 * 1000); 

        return () => clearInterval(interval);
    }, [isAuthenticated, refreshAccessToken]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            setSession,
            logout,
            refreshAccessToken,
            getAuthHeaders
        }}>
            {children}
        </AuthContext.Provider>
    );
};
