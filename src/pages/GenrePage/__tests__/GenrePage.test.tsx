import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GenrePage from '../GenrePage';
import * as api from '../../../api/api';  // Обрати внимание: ../../../api/api
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, type Mock } from 'vitest';

// Путь в моках должен совпадать с путем импорта api.getMovies в компоненте
vi.mock('../../../api/api');  // <-- путь строго такой же, как импорт

// Приводим getMovies к мок-функции
const mockedGetMovies = api.getMovies as Mock;

const mockMovies = Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    title: `Movie ${i + 1}`,
    // остальные обязательные поля, если нужны для MovieCard
}));

describe('GenrePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function renderWithRouter(initialKey: string) {
        return render(
            <MemoryRouter initialEntries={[`/genre/${initialKey}`]}>
                <Routes>
                    <Route path="/genre/:key" element={<GenrePage />} />
                </Routes>
            </MemoryRouter>
        );
    }

    it('редиректит на /genres, если жанр неизвестен', async () => {
        renderWithRouter('unknowngenre');
        await waitFor(() => {
            expect(screen.queryByText(/Фильмы не найдены/i)).not.toBeInTheDocument();
        });
    });

    it('показывает лоадер и рендерит первые 10 фильмов', async () => {
        mockedGetMovies.mockResolvedValue(mockMovies);

        renderWithRouter('action');

        expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/Загрузка/i)).not.toBeInTheDocument();
        });

        for (let i = 1; i <= 10; i++) {
            expect(
                screen.getByRole('button', { name: `Перейти к фильму Movie ${i}` })
            ).toBeInTheDocument();
        }

        expect(screen.getByRole('button', { name: /Показать ещё/i })).toBeInTheDocument();
    });

    it('при клике на "Показать ещё" показывает следующие фильмы', async () => {
        mockedGetMovies.mockResolvedValue(mockMovies);

        renderWithRouter('action');

        await waitFor(() => {
            expect(screen.queryByText(/Загрузка/i)).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Показать ещё/i }));

        for (let i = 1; i <= 15; i++) {
            expect(
                screen.getByRole('button', { name: `Перейти к фильму Movie ${i}` })
            ).toBeInTheDocument();
        }

        expect(screen.queryByRole('button', { name: /Показать ещё/i })).not.toBeInTheDocument();
        expect(screen.getByText(/Все фильмы загружены/i)).toBeInTheDocument();
    });

    it('показывает сообщение об ошибке при неудачной загрузке', async () => {
        mockedGetMovies.mockRejectedValue(new Error('Ошибка сервера'));

        renderWithRouter('action');

        await waitFor(() => {
            expect(screen.getByText(/Не удалось загрузить фильмы/i)).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /Повторить/i })).toBeInTheDocument();
    });

    it('показывает сообщение при отсутствии фильмов', async () => {
        mockedGetMovies.mockResolvedValue([]);

        renderWithRouter('action');

        await waitFor(() => {
            expect(screen.getByText(/Фильмы не найдены для жанра/i)).toBeInTheDocument();
        });
    });
});
