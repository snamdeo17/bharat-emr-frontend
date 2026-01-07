import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('modern');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Sanity check for corrupted data from previous bug
                if (parsedUser && parsedUser.user && !parsedUser.userType) {
                    console.warn('Corrupted user data detected, clearing storage...');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser(parsedUser);
                    if (parsedUser.preferredTheme) {
                        setTheme(parsedUser.preferredTheme);
                    }
                }
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const login = useCallback(async (mobileNumber, otp, userType) => {
        try {
            const response = await api.post('/otp/verify', {
                mobileNumber,
                otp,
                userType,
                purpose: 'LOGIN',
            });

            const { token, user: userData } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            if (userData?.preferredTheme) {
                setTheme(userData.preferredTheme);
            }

            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    }, []);

    const updateProfile = useCallback(async (updates) => {
        try {
            const currentUserId = user?.userId || user?.doctorId || user?.patientId;
            if (!currentUserId) throw new Error('User not authenticated');

            const endpoint = user.userType === 'DOCTOR' ? '/doctor/profile' : '/patient/profile';
            const response = await api.put(endpoint, updates);

            const updatedUser = { ...user, ...response };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            if (updates.preferredTheme) {
                setTheme(updates.preferredTheme);
            }

            return { success: true, data: updatedUser };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to update profile',
            };
        }
    }, [user]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setTheme('modern');
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        theme,
        setTheme,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isDoctor: user?.userType === 'DOCTOR',
        isPatient: user?.userType === 'PATIENT',
    }), [user, loading, theme, login, logout, updateProfile]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
