import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmModal } from '../ConfirmModal';

describe('ConfirmModal', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const defaultProps = {
        isOpen: true,
        onConfirm,
        onCancel,
        message: 'Удалить этот фильм?',
        loading: false,
    };

    beforeEach(() => {
        onConfirm.mockClear();
        onCancel.mockClear();
    });

    it('должен отображать модалку с сообщением и кнопками', () => {
        render(<ConfirmModal {...defaultProps} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Удалить этот фильм?')).toBeInTheDocument();
        expect(screen.getByText('Отмена')).toBeInTheDocument();
        expect(screen.getByText('Удалить')).toBeInTheDocument();
    });

    it('вызывает onCancel при клике по кнопке "Отмена"', () => {
        render(<ConfirmModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Отмена'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('вызывает onConfirm при клике по кнопке "Удалить"', () => {
        render(<ConfirmModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Удалить'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('отображает лоадер при loading = true и скрывает кнопки', () => {
        render(<ConfirmModal {...defaultProps} loading={true} />);
        expect(screen.getByText('Удаление...')).toBeInTheDocument();
        expect(screen.queryByText('Отмена')).not.toBeInTheDocument();
        expect(screen.queryByText('Удалить')).not.toBeInTheDocument();
    });

    it('вызывает onCancel при клике на оверлей, если loading = false', () => {
        render(<ConfirmModal {...defaultProps} loading={false} />);
        const overlay = document.querySelector('.confirm-modal-overlay');
        expect(overlay).toBeInTheDocument();
        if (overlay) {
            fireEvent.click(overlay);
        }
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('не вызывает onCancel при клике на оверлей, если loading = true', () => {
        render(<ConfirmModal {...defaultProps} loading={true} />);
        const overlay = document.querySelector('.confirm-modal-overlay');
        expect(overlay).toBeInTheDocument();
        if (overlay) {
            fireEvent.click(overlay);
        }
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('не закрывает модалку при клике по контенту', () => {
        render(<ConfirmModal {...defaultProps} />);
        const content = document.querySelector('.confirm-modal-content');
        expect(content).toBeInTheDocument();
        if (content) {
            fireEvent.click(content);
        }
        expect(onCancel).not.toHaveBeenCalled();
    });
});
