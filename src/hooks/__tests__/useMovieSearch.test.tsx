import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMovieSearch } from '../useMovieSearch';
import * as api from '../../api/api';
import type { Movie } from '../../types';

// 🧪 Мокаем getMovies
vi.mock('../../api/api');

describe('useMovieSearch', () => {
    const getMoviesMock = vi.mocked(api.getMovies);

    // 🧪 Моковые данные
    const mockMovies: Movie[] = [
        {
            id: 1,
            title: 'Inception',
            originalTitle: 'Inception',
            language: 'en',
            releaseYear: 2010,
            releaseDate: '2010-07-16',
            genres: ['Action'],
            plot: 'A mind-bending thriller.',
            runtime: 148,
            budget: '160000000',
            revenue: '829895144',
            homepage: '',
            status: 'Released',
            posterUrl: '',
            backdropUrl: null,
            trailerUrl: '',
            trailerYouTubeId: '',
            tmdbRating: 8.8,
            searchL: 'inception',
            keywords: [],
            countriesOfOrigin: [],
            languages: [],
            cast: [],
            director: '',
            production: null,
            awardsSummary: null,
        },
    ];

    beforeEach(() => {
        vi.useFakeTimers();
        getMoviesMock.mockReset();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('не делает запрос, если query пустой', () => {
        const { result } = renderHook(() => useMovieSearch());

        act(() => {
            result.current.setQuery('   ');
        });

        expect(getMoviesMock).not.toHaveBeenCalled();
        expect(result.current.results).toEqual([]);
    });

    it('делает запрос с debounce 500ms и задержкой 1s', async () => {
        getMoviesMock.mockResolvedValue(mockMovies);

        const { result } = renderHook(() => useMovieSearch());

        act(() => {
            result.current.setQuery('Inception');
        });

        // ⏳ До debounce
        expect(getMoviesMock).not.toHaveBeenCalled();

        // ⏳ Пролистываем debounce 500ms
        await act(async () => {
            vi.advanceTimersByTime(500);
        });

        // ✅ После debounce — вызов пошёл
        expect(getMoviesMock).toHaveBeenCalledWith({ title: 'Inception' });
        expect(result.current.isLoading).toBe(true);

        // ⏳ Пролистываем задержку 1000ms
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // ✅ Проверяем результаты
        expect(result.current.results).toEqual(mockMovies);
        expect(result.current.isLoading).toBe(false);
    });

    it('сбрасывает debounce таймер при быстрой смене запроса', async () => {
        getMoviesMock.mockResolvedValue(mockMovies);

        const { result } = renderHook(() => useMovieSearch());

        act(() => {
            result.current.setQuery('Incep');
        });

        // прошло 300ms
        await act(async () => {
            vi.advanceTimersByTime(300);
        });

        // меняем query до окончания debounce
        act(() => {
            result.current.setQuery('Inception');
        });

        // проходим 500ms с начала нового debounce
        await act(async () => {
            vi.advanceTimersByTime(500);
        });

        expect(getMoviesMock).toHaveBeenCalledTimes(1);
        expect(getMoviesMock).toHaveBeenCalledWith({ title: 'Inception' });
    });

    it('обрабатывает ошибки запроса', async () => {
        getMoviesMock.mockRejectedValue(new Error('API error'));

        const { result } = renderHook(() => useMovieSearch());

        act(() => {
            result.current.setQuery('ErrorMovie');
        });

        await act(async () => {
            vi.advanceTimersByTime(500); // debounce
            vi.advanceTimersByTime(1000); // delay
        });

        expect(result.current.results).toEqual([]);
        expect(result.current.isLoading).toBe(false);
    });

    it('очищает таймер при размонтировании', () => {
        const { unmount } = renderHook(() => useMovieSearch());

        act(() => {
            unmount();
        });

        expect(vi.getTimerCount()).toBe(0);
    });
});
