import './ConfirmModal.css';
import logoIcon from '../../assets/icons/logo-modal.png';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleLoader } from 'react-spinners';

type ConfirmModalProps = {
    isOpen: boolean;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
    message?: string;
    loading?: boolean;  // новый проп для лоадера
};

export const ConfirmModal = ({
    isOpen,
    onConfirm,
    onCancel,
    message = 'Вы уверены, что хотите удалить фильм из избранного?',
    loading = false,
}: ConfirmModalProps) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="confirm-modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    onClick={loading ? undefined : onCancel} // нельзя закрыть во время загрузки
                    style={{ pointerEvents: loading ? 'none' : 'auto' }}
                >
                    <motion.div
                        className="confirm-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                    >
                        <img src={logoIcon} alt="logo-marusia" />
                        <p className="confirm-modal-message">{message}</p>
                        {loading ? (
                            <div className="confirm-modal-loader">
                                <ScaleLoader />
                                <p>Удаление...</p>
                            </div>
                        ) : (
                            <div className="confirm-modal-buttons">
                                <button type="button" onClick={onCancel} disabled={loading}>
                                    Отмена
                                </button>
                                <button type="button" onClick={onConfirm} autoFocus disabled={loading}>
                                    Удалить
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
