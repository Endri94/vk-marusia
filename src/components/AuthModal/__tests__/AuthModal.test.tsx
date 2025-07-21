import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from '../AuthModal';

const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../../../context/useAuth', () => ({
    useAuth: () => ({
        login: mockLogin,
        register: mockRegister,
    }),
}));

describe('AuthModal', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        mockLogin.mockReset();
        mockRegister.mockReset();
        onClose.mockReset();
    });

    it('renders login form by default', () => {
        render(<AuthModal isOpen={true} onClose={onClose} />);
        expect(screen.getByText('Авторизация')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/электронная почта/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    });

    it('toggles to registration form', async () => {
        render(<AuthModal isOpen={true} onClose={onClose} />);
        const toggleBtn = screen.getByRole('button', { name: /регистрация/i });
        fireEvent.click(toggleBtn);

        // Ждём, пока появится форма регистрации с полями "Имя"
        await waitFor(() => {
            expect(screen.getByText('Регистрация')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Фамилия')).toBeInTheDocument();
        });
    });

    it('shows validation errors on empty submit (register)', async () => {
        render(<AuthModal isOpen={true} onClose={onClose} />);
        fireEvent.click(screen.getByRole('button', { name: /регистрация/i }));

        await waitFor(() => screen.getByPlaceholderText('Имя'));

        fireEvent.click(screen.getByRole('button', { name: /создать аккаунт/i }));

        expect(await screen.findByText('Введите имя')).toBeInTheDocument();
        expect(await screen.findByText('Введите фамилию')).toBeInTheDocument();
        expect(await screen.findByText('Введите email')).toBeInTheDocument();
        expect(await screen.findByText('Введите пароль')).toBeInTheDocument();
        expect(await screen.findByText('Подтвердите пароль')).toBeInTheDocument();
    });

    it('calls login on valid login submit', async () => {
        mockLogin.mockResolvedValueOnce(undefined);

        render(<AuthModal isOpen={true} onClose={onClose} />);
        fireEvent.change(screen.getByPlaceholderText(/электронная почта/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password1' } });
        fireEvent.click(screen.getByRole('button', { name: /войти/i }));

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password1'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls register on valid registration submit and shows success', async () => {
        mockRegister.mockResolvedValueOnce(undefined);

        render(<AuthModal isOpen={true} onClose={onClose} />);
        fireEvent.click(screen.getByRole('button', { name: /регистрация/i }));

        await waitFor(() => screen.getByPlaceholderText('Имя'));

        fireEvent.change(screen.getByPlaceholderText('Имя'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Фамилия'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/электронная почта/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password1' } });
        fireEvent.change(screen.getByPlaceholderText('Подтвердите пароль'), { target: { value: 'password1' } });

        fireEvent.click(screen.getByRole('button', { name: /создать аккаунт/i }));

        await waitFor(() => expect(mockRegister).toHaveBeenCalledWith('John', 'Doe', 'john@example.com', 'password1'));
      await expect(screen.findByText(/Регистрация завершена/i)).resolves.toBeInTheDocument();

    });
});
