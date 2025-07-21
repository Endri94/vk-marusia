// src/components/RandomMovieBanner/__tests__/RandomMovieBanner.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RandomMovieBanner } from '../RandomMovieBanner';
import { useNavigate } from 'react-router-dom';
import * as useAuthModule from '../../../context/useAuth';
import * as api from '../../../api/api';
import { vi } from 'vitest';
import type { Movie } from '../../../types';
import { type Mock } from 'vitest';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

vi.mock('../../../api/api', () => ({
    addFavoriteMovie: vi.fn(),
    getFavoriteMovies: vi.fn(),
}));

describe('RandomMovieBanner', () => {
    const navigateMock = vi.fn<(path: string) => void>();
    const openAuthModalMock = vi.fn();

    const sampleMovie: Partial<Movie> = {
        id: 1,
        title: 'Test Movie',
        originalTitle: 'Test Movie Original',
        releaseDate: '2023-01-01',
        homepage: '',
        status: 'Released',
        revenue: '1000000',
        budget: '500000',
        production: 'Test Studio',
        awardsSummary: '',
        language: 'en',
        trailerYouTubeId: 'abc123',
        posterUrl: '',
        backdropUrl: '',
        tmdbRating: 7.5,
        releaseYear: 2023,
        genres: ['Action', 'Drama'],
        runtime: 120,
        plot: 'Test plot',
        director: 'John Doe',
        cast: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();

        (useNavigate as unknown as Mock).mockReturnValue(navigateMock);

        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
            user: { name: 'User', surname: 'Test', email: 'user@example.com' },
            openAuthModal: openAuthModalMock,
            closeAuthModal: vi.fn(),
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            isAuthModalOpen: false,
        });

        (api.getFavoriteMovies as jest.Mock).mockResolvedValue([]);
    });

    it('рендерит базовую информацию о фильме', () => {
        render(<RandomMovieBanner movie={sampleMovie as Movie} />);

        expect(screen.getByRole('heading', { name: /test movie/i })).toBeInTheDocument();
        expect(screen.getByText(/test plot/i)).toBeInTheDocument();
        expect(screen.getByText(/7.5/)).toBeInTheDocument();
        expect(screen.getByText(/2023/)).toBeInTheDocument();
        expect(screen.getByText(/action, drama/i)).toBeInTheDocument();
        expect(screen.getByText(/2 ч 0 мин/i)).toBeInTheDocument();
    });

    it('вызывает getFavoriteMovies и устанавливает isFavorite', async () => {
        (api.getFavoriteMovies as jest.Mock).mockResolvedValue([{ id: 1 } as Movie]);
        render(<RandomMovieBanner movie={sampleMovie as Movie} />);

        await waitFor(() => {
            expect(api.getFavoriteMovies).toHaveBeenCalled();
        });

        expect(screen.getByRole('button', { name: /добавить в избранное/i })).toBeDisabled();
    });

    it('добавляет в избранное при клике, если пользователь авторизован', async () => {
        (api.addFavoriteMovie as jest.Mock).mockResolvedValue(undefined);

        render(<RandomMovieBanner movie={sampleMovie as Movie} />);
        const favBtn = screen.getByRole('button', { name: /добавить в избранное/i });
        fireEvent.click(favBtn);

        await waitFor(() => {
            expect(api.addFavoriteMovie).toHaveBeenCalledWith(sampleMovie.id);
        });

        expect(favBtn).toBeDisabled();
    });

    it('открывает модалку авторизации, если пользователь не авторизован', () => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
            user: null,
            openAuthModal: openAuthModalMock,
            closeAuthModal: vi.fn(),
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            isAuthModalOpen: false,
        });

        render(<RandomMovieBanner movie={sampleMovie as Movie} />);
        const favBtn = screen.getByRole('button', { name: /добавить в избранное/i });
        fireEvent.click(favBtn);

        expect(openAuthModalMock).toHaveBeenCalled();
        expect(api.addFavoriteMovie).not.toHaveBeenCalled();
    });

    it('открывает трейлер при клике на кнопку "Трейлер"', () => {
        render(<RandomMovieBanner movie={sampleMovie as Movie} />);
        const trailerBtn = screen.getByRole('button', { name: /трейлер/i });
        fireEvent.click(trailerBtn);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText(/закрыть трейлер/i)).toBeInTheDocument();
    });

    it('переходит на страницу фильма при клике на "О фильме"', () => {
        render(<RandomMovieBanner movie={sampleMovie as Movie} />);
        const aboutBtn = screen.getByRole('button', { name: /о фильме/i });
        fireEvent.click(aboutBtn);

        expect(navigateMock).toHaveBeenCalledWith(`/movie/${sampleMovie.id}`);
    });

    it('не отображает кнопку случайного фильма, если hideRandomizeButton=true', () => {
        render(<RandomMovieBanner movie={sampleMovie as Movie} hideRandomizeButton />);
        expect(screen.queryByLabelText(/показать другой случайный фильм/i)).not.toBeInTheDocument();
    });

    it('отображает кнопку случайного фильма и вызывает onRandomize', () => {
        const onRandomizeMock = vi.fn();
        render(<RandomMovieBanner movie={sampleMovie as Movie} onRandomize={onRandomizeMock} />);
        const btn = screen.getByLabelText(/показать другой случайный фильм/i);
        fireEvent.click(btn);

        expect(onRandomizeMock).toHaveBeenCalled();
    });
});
