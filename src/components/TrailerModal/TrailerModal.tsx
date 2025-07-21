import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import './TrailerModal.css';

type Props = {
    youtubeId: string;
    title: string;
    onClose: () => void;
};

export const TrailerModal = ({ youtubeId, title, onClose }: Props) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(true);
    const [isLoading, setIsLoading] = useState(true);


    const togglePlayback = useCallback(() => {
        if (!iframeRef.current) return;

        const action = isPaused ? 'playVideo' : 'pauseVideo';
        iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
                event: 'command',
                func: action,
                args: [],
            }),
            '*'
        );
        setIsPaused(!isPaused);
    }, [isPaused]);

    const handleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    // Выход по ESC и toggle по пробелу
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === ' ') {
                e.preventDefault();
                togglePlayback();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose, togglePlayback]);

    // Универсальное управление видимостью controls по движению мыши (во всех режимах)
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const handleMouseMove = () => {
            setIsHovered(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsHovered(false);
            }, 2000);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);



    // Отключаем YouTube UI
    useEffect(() => {
        const timer = setInterval(() => {
            if (iframeRef.current) {
                iframeRef.current.contentWindow?.postMessage(
                    JSON.stringify({
                        event: 'command',
                        func: 'setOption',
                        args: ['showinfo', 0],
                    }),
                    '*'
                );
            }
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    return createPortal(
        <AnimatePresence>
            <motion.div
                className="trailer-modal__overlay"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <motion.div
                    className="trailer-modal__wrapper"
                    role="dialog"
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()} // предотвращаем закрытие
                >
                    <div
                        ref={containerRef}
                        className="trailer-modal__container"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlayback();
                        }}
                    >
                        {isLoading && (
                            <div className="trailer-modal__loader">
                                <div className="curve-bars-spinner">
                                    <div></div>
                                    <div className='reverse'></div>
                                    <div></div>
                                    <div className='reverse'></div>
                                </div>
                            </div>
                        )}

                        <iframe
                            ref={iframeRef}
                            className="trailer-modal__iframe"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0&controls=0&showinfo=0&disablekb=1&fs=0&iv_load_policy=3&fullscreen=1`}
                            allow="autoplay; fullscreen"
                            onLoad={() => setIsLoading(false)}
                            loading="lazy"
                            allowFullScreen
                        />

                        <div className={`trailer-modal__controls ${isHovered ? 'visible' : ''}`}>
                            <div className="trailer-modal__buttons">
                                <div className="trailer-modal__play-button">
                                    {isPaused ? '▶' : '⏸'}
                                </div>
                            </div>
                            <div className="trailer-modal__title-overlay">{title}</div>
                        </div>
                    </div>

                    <button
                    
                        className="trailer-modal__close-btn" title='Закрыть'
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        aria-label="Закрыть трейлер"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18" stroke="black" strokeWidth="2" />
                            <path d="M6 6L18 18" stroke="black" strokeWidth="2" />
                        </svg>
                    </button>

                    <button
                        className="trailer-modal__fullscreen-btn" title='На весь экран'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFullscreen();
                        }}
                        aria-label="На весь экран"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                            <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                            <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default TrailerModal;
