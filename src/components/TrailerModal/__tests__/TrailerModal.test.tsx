// src/components/TrailerModal/__tests__/TrailerModal.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TrailerModal } from '../TrailerModal';

describe('TrailerModal', () => {
    const onCloseMock = vi.fn();

    const youtubeId = 'abc123';
    const title = 'Test Trailer';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('рендерится с iframe и заголовком', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);

        // Проверяем наличие iframe по классу
        const iframe = document.querySelector('.trailer-modal__iframe');
        expect(iframe).toBeInTheDocument();

        // Проверяем наличие заголовка
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('отображает лоадер до загрузки iframe', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        expect(document.querySelector('.trailer-modal__loader')).toBeInTheDocument();
    });

    it('скрывает лоадер после загрузки iframe', async () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const iframe = document.querySelector('iframe')!;
        fireEvent.load(iframe);
        await waitFor(() => {
            expect(document.querySelector('.trailer-modal__loader')).not.toBeInTheDocument();
        });
    });

    it('вызывает onClose при клике на оверлей', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const overlay = document.querySelector('.trailer-modal__overlay')!;
        fireEvent.click(overlay);
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('не закрывается при клике внутри окна трейлера', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const wrapper = document.querySelector('.trailer-modal__wrapper')!;
        fireEvent.click(wrapper);
        expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('вызывает onClose при клике на кнопку закрытия', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const closeBtn = screen.getByLabelText(/закрыть трейлер/i);
        fireEvent.click(closeBtn);
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('переключает состояние паузы/плей при клике на контейнер видео', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const container = document.querySelector('.trailer-modal__container')!;
        const playButton = document.querySelector('.trailer-modal__play-button')!;

        // Изначально не на паузе, кнопка должна показывать ⏸
        expect(playButton.textContent).toBe('⏸');

        fireEvent.click(container);
        // После клика — должно переключиться на паузу, кнопка — ▶
        expect(playButton.textContent).toBe('▶');

        fireEvent.click(container);
        // Опять play
        expect(playButton.textContent).toBe('⏸');
    });

    it('переключает полноэкранный режим при клике на кнопку', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const fullscreenBtn = screen.getByLabelText(/на весь экран/i);

        // Мокаем методы fullscreen
        const requestFullscreenMock = vi.fn();
        const exitFullscreenMock = vi.fn();

        // @ts-expect-error: fullscreenElement assignment for test
        document.fullscreenElement = null;

        // @ts-expect-error: exitFullscreen for test
        document.exitFullscreen = exitFullscreenMock;

        const container = document.querySelector('.trailer-modal__container')!;
        container.requestFullscreen = requestFullscreenMock;

        fireEvent.click(fullscreenBtn);
        expect(requestFullscreenMock).toHaveBeenCalled();

        // Теперь эмулируем, что fullscreen включен
        // @ts-expect-error: fullscreenElement assignment for test
        document.fullscreenElement = container;

        fireEvent.click(fullscreenBtn);
        expect(exitFullscreenMock).toHaveBeenCalled();
    });

    it('закрывается по нажатию Escape', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('переключает паузу по нажатию пробела', () => {
        render(<TrailerModal youtubeId={youtubeId} title={title} onClose={onCloseMock} />);
        const playButton = document.querySelector('.trailer-modal__play-button')!;

        expect(playButton.textContent).toBe('⏸');

        fireEvent.keyDown(document, { key: ' ' });

        expect(playButton.textContent).toBe('▶');

        fireEvent.keyDown(document, { key: ' ' });

        expect(playButton.textContent).toBe('⏸');
    });
});
