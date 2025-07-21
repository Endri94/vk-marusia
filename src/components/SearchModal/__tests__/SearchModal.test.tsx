// src/components/SearchModal/__tests__/SearchModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchModal } from '../SearchModal';
import { useNavigate } from 'react-router-dom';
import * as useMovieSearchModule from '../../../hooks/useMovieSearch';
import type { Movie } from '../../../types';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('SearchModal', () => {
    const onCloseMock = vi.fn() as ReturnType<typeof vi.fn>;
    const navigateMock = vi.fn() as ReturnType<typeof vi.fn>;

    const sampleMovies: Partial<Movie>[] = [
        {
            id: 1,
            title: 'Movie One',
            posterUrl: '',
            backdropUrl: '',
            tmdbRating: 8,
            releaseYear: 2020,
            genres: ['Action', 'Thriller'],
            runtime: 120,
        },
        {
            id: 2,
            title: 'Movie Two',
            posterUrl: '',
            backdropUrl: '',
            tmdbRating: 6.5,
            releaseYear: 2019,
            genres: ['Drama'],
            runtime: 90,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as unknown as jest.Mock).mockReturnValue(navigateMock);
    });

    it('рендерит все базовые элементы', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: '',
            setQuery: vi.fn(),
            results: [],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);

        expect(screen.getByPlaceholderText(/поиск/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /закрыть поиск/i })).toBeInTheDocument();
        expect(screen.getByAltText(/иконка поиска/i)).toBeInTheDocument();
    });

    it('вызывает setQuery при вводе текста', () => {
        const setQueryMock = vi.fn();
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: '',
            setQuery: setQueryMock,
            results: [],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);

        const input = screen.getByPlaceholderText(/поиск/i);

        fireEvent.change(input, { target: { value: 'Inception' } });

        expect(setQueryMock).toHaveBeenCalledWith('Inception');
    });

    it('отображает лоадер во время загрузки', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: 'abc',
            setQuery: vi.fn(),
            results: [],
            isLoading: true,
        });

        const { container } = render(<SearchModal onClose={onCloseMock} />);
        const loader = container.querySelector('.search-loading');
        expect(loader).toBeInTheDocument();
    });

    it('отображает список результатов при наличии', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: 'abc',
            setQuery: vi.fn(),
            results: sampleMovies as Movie[],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);

        expect(screen.getByText('Movie One')).toBeInTheDocument();
        expect(screen.getByText('Movie Two')).toBeInTheDocument();
    });

    it('показывает сообщение, если результаты пустые', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: 'unknown',
            setQuery: vi.fn(),
            results: [],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);

        expect(screen.getByText(/ничего не найдено/i)).toBeInTheDocument();
        expect(screen.getByText(/unknown/i)).toBeInTheDocument();
    });

    it('закрывает модалку при клике на крестик', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: '',
            setQuery: vi.fn(),
            results: [],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);
        const closeBtn = screen.getByRole('button', { name: /закрыть поиск/i });
        fireEvent.click(closeBtn);
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('закрывает модалку при клике вне контента', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: '',
            setQuery: vi.fn(),
            results: [],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);
        const overlay = screen.getByTestId('search-modal');
        fireEvent.click(overlay);
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('переходит на страницу фильма при клике на результат', () => {
        vi.spyOn(useMovieSearchModule, 'useMovieSearch').mockReturnValue({
            query: 'abc',
            setQuery: vi.fn(),
            results: sampleMovies as Movie[],
            isLoading: false,
        });

        render(<SearchModal onClose={onCloseMock} />);

        const firstMovie = screen.getByText('Movie One');
        fireEvent.click(firstMovie);

        expect(onCloseMock).toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith('/movie/1');
    });
});
