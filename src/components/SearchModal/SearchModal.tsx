import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMovieSearch } from '../../hooks/useMovieSearch';
import { RatingBadge } from '../RatingBadge/RatingBadge';
import { formatDuration } from '../../utils/formatTime';
import './SearchModal.css';
import searchIconGray from '../../assets/icons/loop.svg';
import CloseIcon from '../../assets/icons/close.svg';
import { ScaleLoader } from 'react-spinners';
import NoPosterImage from '../../assets/icons/noposter.svg';

export const SearchModal = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();
    const { query, setQuery, results, isLoading } = useMovieSearch();

    const handleSelect = (id: number) => {
        onClose();
        navigate(`/movie/${id}`);
    };

    const resultsVariants = {
        hidden: { opacity: 0, y: -10, height: 0, overflow: 'hidden' },
        visible: { opacity: 1, y: 0, height: 'auto', overflow: 'auto' },
    };

    return (
        <div className="search-modal-overlay" onClick={onClose} data-testid="search-modal">
            <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="search-modal-header">
                    <img className="search-modal-search" src={searchIconGray} alt="Иконка поиска" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск..."
                        autoFocus
                    />
                    <button
                        className="search-modal-close"
                        onClick={onClose}
                        aria-label="Закрыть поиск"
                    >
                        <img src={CloseIcon} alt="Закрыть" />
                    </button>
                </div>

                <AnimatePresence>
                    {(isLoading || results.length > 0 || query.trim()) && (
                        <motion.div
                            className={`search-results-container ${isLoading || results.length > 0 ? 'show' : ''}`}
                            variants={resultsVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >

                            <div className="search-result-mobile">
                                {isLoading ? (
                                    <div className="search-loading">
                                        <ScaleLoader color="#03c6fc"
                                            height={30}
                                            width={4}
                                            radius={2}
                                          
                                            cssOverride={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: '4px',
                                                alignItems: 'center'
                                            }} />


                                    </div>
                                ) : results.length > 0 ? (
                                    results.map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="search-result-item"
                                            onClick={() => handleSelect(movie.id)}
                                        >
                                            <img
                                                src={movie.posterUrl || movie.backdropUrl || NoPosterImage}
                                                alt={movie.title}
                                                className="search-result-poster"
                                            />
                                            <div className="search-result-details">
                                                <div className="search-result-meta">
                                                    <RatingBadge rating={movie.tmdbRating ?? 0} />
                                                    <span>{movie.releaseYear}</span>
                                                    <span>{movie.genres.join(', ')}</span>
                                                    <span>{formatDuration(movie.runtime)}</span>
                                                </div>
                                                <div className="search-result-title">{movie.title}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="search-empty">
                                        По запросу &quot;{query}&quot; ничего не найдено.<br />
                                        Проверьте правильность написания.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};