import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import GenreCard from '../GenreCard';
import type { Genre } from '../../../types';

describe('GenreCard', () => {
    const genre: Genre = {
        id: 1,
        key: 'action',
        name: 'Боевик',
        image: 'https://example.com/action.jpg',
    };

    it('рендерит ссылку с правильным URL и отображает название жанра', () => {
        render(
            <MemoryRouter>
                <GenreCard genre={genre} />
            </MemoryRouter>
        );

        const link = screen.getByRole('link', { name: /боевик/i });
        expect(link).toHaveAttribute('href', `/genre/${genre.key}`);

        const title = screen.getByText(genre.name);
        expect(title).toBeInTheDocument();

        const imageDiv = link.querySelector('.genre-card__image');
        expect(imageDiv).toHaveStyle(`background-image: url(${genre.image})`);
    });
});
