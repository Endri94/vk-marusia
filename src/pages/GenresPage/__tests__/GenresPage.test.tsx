import { render, screen, waitFor } from '@testing-library/react';
import GenresPage from '../GenresPage';
import { vi } from 'vitest';
import * as api from '../../../api/api';
import { genresMap } from '../../../locales/genresMap';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../api/api');

describe('GenresPage', () => {
    const mockedGenres = ['action', 'drama', 'comedy'];
    const getGenresMock = api.getGenres as vi.Mock;

    beforeEach(() => {
        vi.clearAllMocks(); // 🔄 сбрасываем мок
        getGenresMock.mockResolvedValue(mockedGenres);
    });

    const renderWithRouter = () => render(
        <MemoryRouter>
            <GenresPage />
        </MemoryRouter>
    );

    it('загружает и отображает жанры', async () => {
        renderWithRouter();

        await waitFor(() => {
            mockedGenres.forEach((key) => {
                const nameFromMap = genresMap[key]?.name ?? key;
                expect(screen.getByText(nameFromMap)).toBeInTheDocument();
            });
        });
    });

    it('вызывает getGenres при монтировании', async () => {
        renderWithRouter();
        await waitFor(() => {
            expect(getGenresMock).toHaveBeenCalledTimes(1);
        });
    });
});
