import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { AuthProvider } from '../../../context/AuthProvider';
import * as useAuthModule from '../../../context/useAuth';
import * as useMovieSearchModule from '../../../hooks/useMovieSearch';

// Правильное мокирование с TypeScript
vi.mock('../../../context/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../../hooks/useMovieSearch', () => ({
    useMovieSearch: vi.fn(),
}));

// Приводим моки к правильному типу
const mockedUseAuth = useAuthModule.useAuth as Mock;
const mockedUseMovieSearch = useMovieSearchModule.useMovieSearch as Mock;

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <AuthProvider>{ui}</AuthProvider>
        </MemoryRouter>
    );
};

describe('Header', () => {
    const mockSetQuery = vi.fn();
    const mockOpenAuthModal = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Правильное мокирование с TypeScript
        mockedUseAuth.mockReturnValue({
            user: null,
            openAuthModal: mockOpenAuthModal,
        });

        mockedUseMovieSearch.mockReturnValue({
            query: '',
            setQuery: mockSetQuery,
            results: [],
            isLoading: false,
        });
    });

    it('отображает логотип и навигацию', () => {
        renderWithProviders(<Header />);
        expect(screen.getByAltText(/логотип/i)).toBeInTheDocument();
        expect(screen.getByText(/главная/i)).toBeInTheDocument();
        expect(screen.getByText(/жанры/i)).toBeInTheDocument();
    });

    // Остальные тесты остаются без изменений
    it('показывает кнопку "Войти", если пользователь не авторизован', () => {
        renderWithProviders(<Header />);
        expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
    });

    it('показывает имя пользователя, если авторизован', () => {
        mockedUseAuth.mockReturnValue({
            user: { name: 'Андрей' },
            openAuthModal: mockOpenAuthModal,
        });

        renderWithProviders(<Header />);
        expect(screen.getByText(/андрей/i)).toBeInTheDocument();
    });

    it('открывает модалку поиска на мобилке по нажатию кнопки', () => {
        renderWithProviders(<Header />);
        const searchBtn = screen.getByRole('button', { name: /поиск/i });
        fireEvent.click(searchBtn);
        expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    });

    it('вводит текст в поле поиска', () => {
        mockedUseMovieSearch.mockReturnValue({
            query: '',
            setQuery: mockSetQuery,
            results: [],
            isLoading: false,
        });

        renderWithProviders(<Header />);
        const input = screen.getByPlaceholderText(/поиск/i);
        fireEvent.change(input, { target: { value: 'Inception' } });
        expect(mockSetQuery).toHaveBeenCalledWith('Inception');
    });

    it('очищает поле поиска при нажатии на кнопку ×', () => {
        mockedUseMovieSearch.mockReturnValue({
            query: 'test',
            setQuery: mockSetQuery,
            results: [],
            isLoading: false,
        });

        renderWithProviders(<Header />);
        const clearButton = screen.getByRole('button', { name: /очистить поиск/i });
        fireEvent.click(clearButton);
        expect(mockSetQuery).toHaveBeenCalledWith('');
    });
});