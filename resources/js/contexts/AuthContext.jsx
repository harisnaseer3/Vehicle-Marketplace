import { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/axios.js';

const AuthContext = createContext(); // Define first

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        isAdmin: false,
        isAuthenticated: false,
        isLoading: true
    });

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/auth/check', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
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

// Define useAuth after AuthContext is initialized
export const useAuth = () => useContext(AuthContext);
