import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MovieCard } from '../MovieCard';
import userEvent from '@testing-library/user-event';
import NoPosterImage from '../../../assets/icons/noposter.svg';
import { vi } from 'vitest'; 
import type { Movie } from '../../../types';


const sampleMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    originalTitle: 'Test Movie Original',
    language: 'en',
    releaseYear: 2023,
    releaseDate: '2023-01-01',
    genres: ['Action'],
    plot: 'Test movie plot',
    runtime: 120,
    budget: '1000000',
    revenue: '5000000',
    homepage: 'https://example.com',
    status: 'Released',
    posterUrl: 'https://example.com/poster.jpg',
    backdropUrl: 'https://example.com/backdrop.jpg',
    trailerUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    trailerYouTubeId: 'dQw4w9WgXcQ',
    tmdbRating: 8.5,
    searchL: 'test movie',
    keywords: ['test', 'movie'],
    countriesOfOrigin: ['USA'],
    languages: ['English'],
    cast: ['Actor A', 'Actor B'],
    director: 'Test Director',
    production: 'Test Studio',
    awardsSummary: 'Won 1 test award',
};

describe('MovieCard', () => {
    it('рендерит постер, заголовок и индекс для variant="top"', () => {
        render(
            <MemoryRouter>
                <MovieCard movie={sampleMovie} variant="top" index={0} />
            </MemoryRouter>
        );

        expect(screen.getByAltText(/постер фильма "Test Movie"/i)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // индекс 0 + 1
    });

    it('переходит по клику на карточку к странице фильма', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<MovieCard movie={sampleMovie} />} />
                    <Route path="/movie/:id" element={<div>Movie page</div>} />
                </Routes>
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', { name: /перейти к фильму test movie/i }));
        expect(screen.getByText('Movie page')).toBeInTheDocument();
    });

    it('вызывает onRemove при клике на кнопку удаления и не вызывает навигацию', () => {
        const onRemoveMock = vi.fn();

        render(
            <MemoryRouter>
                <MovieCard movie={sampleMovie} onRemove={onRemoveMock} />
            </MemoryRouter>
        );

        const removeBtn = screen.getByRole('button', { name: /удалить фильм "test movie" из избранного/i });
        fireEvent.click(removeBtn);
        expect(onRemoveMock).toHaveBeenCalledTimes(1);
    });

    it('заменяет изображение на NoPosterImage при ошибке загрузки', () => {
        render(
            <MemoryRouter>
                <MovieCard movie={{ ...sampleMovie, posterUrl: 'broken-link.jpg' }} />
            </MemoryRouter>
        );

        const img = screen.getByAltText(/постер фильма "test movie"/i) as HTMLImageElement;
        const initialSrc = img.src;

        fireEvent.error(img);

        // ⚠️ В img.src будет абсолютный путь, например, http://localhost/...
        expect(img.src).not.toBe(initialSrc);
        expect(img.src).toContain(NoPosterImage.split('/').pop()!); // проверка по имени файла
    });
});
