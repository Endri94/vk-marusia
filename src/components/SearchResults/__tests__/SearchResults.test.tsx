// src/components/SearchModal/__tests__/SearchResults.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResults } from '../SearchResults';
import type { Movie } from '../../../types';
import { vi } from 'vitest'

describe('SearchResults', () => {
    const sampleMovie: Partial<Movie> = {
        id: 1,
        title: 'Inception',
        posterUrl: '',
        backdropUrl: '',
        tmdbRating: 8.8,
        releaseYear: 2010,
        genres: ['Action', 'Sci-Fi'],
        runtime: 148,
        // остальные поля можно опустить, если они не обязательны
    };

    it('показывает лоадер при isLoading', () => {
        render(
            <SearchResults
                results={[]}
                query=""
                isLoading={true}
                onSelect={() => { }}
            />
        );
        expect(screen.getByTestId('search-loading-fallback')).toBeInTheDocument();
    });

    it('показывает результаты поиска', () => {
        render(
            <SearchResults
                results={[sampleMovie as Movie]}
                query="ince"
                isLoading={false}
                onSelect={() => { }}
            />
        );
        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.getByText('2010')).toBeInTheDocument();
        expect(screen.getByText('Action, Sci-Fi')).toBeInTheDocument();
    });

    it('вызывает onSelect при клике на результат', () => {
        const handleSelect = vi.fn();
        render(
            <SearchResults
                results={[sampleMovie as Movie]}
                query="ince"
                isLoading={false}
                onSelect={handleSelect}
            />
        );
        fireEvent.click(screen.getByText('Inception'));
        expect(handleSelect).toHaveBeenCalledWith(1);
    });

    it('показывает сообщение "ничего не найдено" при пустом results и непустом query', () => {
        render(
            <SearchResults
                results={[]}
                query="abc"
                isLoading={false}
                onSelect={() => { }}
            />
        );
        expect(screen.getByText(/ничего не найдено/i)).toBeInTheDocument();
    });

    it('не рендерит ничего при пустом query и пустых results', () => {
        const { container } = render(
            <SearchResults
                results={[]}
                query=""
                isLoading={false}
                onSelect={() => { }}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('использует корректные классы для "modal" варианта', () => {
        render(
            <SearchResults
                results={[sampleMovie as Movie]}
                query="ince"
                isLoading={false}
                onSelect={() => { }}
                variant="modal"
            />
        );
        const item = screen.getByText('Inception').closest('.search-result-mobile-item');
        expect(item).toBeInTheDocument();
    });
});
