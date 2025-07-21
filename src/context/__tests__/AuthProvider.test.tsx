import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';
import { AuthContext } from '../AuthContext';
import type { AuthContextProps } from '../AuthProvider';
import * as api from '../../api/api';
import '@testing-library/jest-dom'; // можно оставить для матчеров
import { vi, type Mock } from 'vitest';

vi.mock('../../api/api');

describe('AuthProvider', () => {
    const mockUser = { name: 'John', surname: 'Doe', email: 'john@example.com' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches current user on mount and sets user state', async () => {
        (api.getCurrentUser as Mock).mockResolvedValue(mockUser);

        let contextValue: AuthContextProps | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(contextValue?.user).toEqual(mockUser);
        });
    });

    it('handles 401 error and sets user to null on mount', async () => {
        (api.getCurrentUser as Mock).mockRejectedValue({
            response: { status: 401 },
        });

        let contextValue: AuthContextProps | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(contextValue?.user).toBeNull();
        });
    });

    it('login calls api.login and sets user and closes modal', async () => {
        (api.login as Mock).mockResolvedValue(undefined);
        (api.getCurrentUser as Mock).mockResolvedValue(mockUser);

        let contextValue: AuthContextProps | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {
            await contextValue?.login('john@example.com', 'password');
        });

        expect(api.login).toHaveBeenCalledWith({ email: 'john@example.com', password: 'password' });
        expect(api.getCurrentUser).toHaveBeenCalled();
        expect(contextValue?.user).toEqual(mockUser);
        expect(contextValue?.isAuthModalOpen).toBe(false);
    });

    it('register calls api.register', async () => {
        (api.register as Mock).mockResolvedValue(undefined);

        let contextValue: AuthContextProps | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {
            await contextValue?.register('John', 'Doe', 'john@example.com', 'password');
        });

        expect(api.register).toHaveBeenCalledWith({
            name: 'John',
            surname: 'Doe',
            email: 'john@example.com',
            password: 'password',
        });
    });

    it('logout calls api.logout and sets user to null', async () => {
        (api.logout as Mock).mockResolvedValue(undefined);

        let contextValue: AuthContextProps | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {
            await contextValue?.logout();
        });

        expect(api.logout).toHaveBeenCalled();
        expect(contextValue?.user).toBeNull();
    });

    it('openAuthModal and closeAuthModal change isAuthModalOpen state', () => {
        let contextValue: AuthContextProps | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );

        act(() => {
            contextValue?.openAuthModal();
        });

        expect(contextValue?.isAuthModalOpen).toBe(true);

        act(() => {
            contextValue?.closeAuthModal();
        });

        expect(contextValue?.isAuthModalOpen).toBe(false);
    });
});
