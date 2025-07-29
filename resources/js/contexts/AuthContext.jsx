// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        isAdmin: false,
        isAuthenticated: false,
        isLoading: true
    });

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/user-status');
            setAuthState({
                user: response.data.success ? response.data.user : null,
                isAdmin: response.data.success ? response.data.user.isAdmin : false,
                isAuthenticated: response.data.success,
                isLoading: false
            });
        } catch (error) {
            setAuthState({
                user: null,
                isAdmin: false,
                isAuthenticated: false,
                isLoading: false
            });
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ ...authState, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
