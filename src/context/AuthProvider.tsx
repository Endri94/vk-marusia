// src/context/AuthProvider.tsx
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import * as api from '../api/api';

type User = {
    name: string | null;
    surname: string | null;
    email: string;
} | null;

export interface AuthContextProps {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        surname: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await api.getCurrentUser();
                if (currentUser) {
                    setUser({
                        name: currentUser.name,
                        surname: currentUser.surname,
                        email: currentUser.email,
                    });
                } else {
                    setUser(null);
                }
            } catch (error: unknown) {
                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'response' in error &&
                    typeof (error as { response?: { status?: number } }).response?.status === 'number' &&
                    (error as { response?: { status?: number } }).response?.status === 401
                ) {
                    setUser(null);
                } else {
                    console.error('Ошибка при получении пользователя:', error);
                    setUser(null);
                }
            }
        };
        fetchCurrentUser();
    }, []);


    const login = async (email: string, password: string) => {
        await api.login({ email, password });
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
            setUser({
                name: currentUser.name,
                surname: currentUser.surname,
                email: currentUser.email,
            });
        } else {
            setUser(null);
        }
        setAuthModalOpen(false);
    };

    const register = async (
        name: string,
        surname: string,
        email: string,
        password: string
    ) => {
        await api.register({ name, surname, email, password });
        // По ТЗ не вызываем getCurrentUser после регистрации
    };

    const logout = async () => {
        try {
            await api.logout();
            setUser(null);
        } catch (error) {
            console.error('Ошибка при логауте:', error);
        }
    };

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};