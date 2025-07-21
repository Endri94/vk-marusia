import { useEffect, useState, useRef } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { getMovies } from '../../api/api';
import type { Movie } from '../../types';
import { genresMap } from '../../locales/genresMap';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import backIcon from '../../assets/icons/back.svg';
import { LoadingFallback } from '../../components/LoadingFallback/LoadingFallback';
import { motion, AnimatePresence } from 'framer-motion';
import './GenrePage.css';

const PAGE_SIZE = 10;

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.3 },
    }),
};

const GenrePage = () => {
    const { key } = useParams<{ key: string }>(); // Ключ жанра из URL
    const navigate = useNavigate();
    const isMounted = useRef(true);

    const [movies, setMovies] = useState<Movie[]>([]);
    const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Редирект если ключ отсутствует или жанр неизвестен
    useEffect(() => {
        if (!key || !genresMap[key]) {
            navigate('/genres', { replace: true });
        }
    }, [key, navigate]);

    const currentGenre = key
        ? {
            key,
            name: genresMap[key]?.name || (key.charAt(0).toUpperCase() + key.slice(1)),
            image: genresMap[key]?.image || '/genres/default.png',
        }
        : null;

    useEffect(() => {
        if (!key) return;

        isMounted.current = true;
        setError(null);
        setMovies([]);
        setDisplayedCount(PAGE_SIZE);

        const fetchMovies = async () => {
            try {
                setIsLoading(true);

                // Запрашиваем фильмы по жанру
                const moviesData = await getMovies({
                    genre: key,
                    sortBy: 'tmdbRating',
                    sortOrder: 'desc',
                });

                if (isMounted.current) {
                    setMovies(moviesData);
                    setDisplayedCount(PAGE_SIZE);
                }
            } catch {
                if (isMounted.current) {
                    setError('Не удалось загрузить фильмы');
                    setMovies([]);
                }
            } finally {
                if (isMounted.current) setIsLoading(false);
            }
        };

        fetchMovies();

        return () => {
            isMounted.current = false;
        };
    }, [key]);

    if (!currentGenre) return null;

    const displayedMovies = movies.slice(0, displayedCount);
    const hasMoreMovies = displayedCount < movies.length;

    return (
        <AnimatePresence>
            <motion.div
                className="genre-page"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="genre-page__top">
                    <NavLink to="/genres" className="back-button">
                        <img className="genre-img" src={backIcon} alt="Назад" width={40} height={40} />
                        <h1 className="genre-title">{currentGenre.name}</h1>
                    </NavLink>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => window.location.reload()} className="retry-button">
                            Повторить
                        </button>
                    </div>
                )}

                <div className="genre-movie-list">
                    <AnimatePresence>
                        {displayedMovies.length > 0 ? (
                            displayedMovies.map((movie, i) => (
                                <motion.div
                                    key={movie.id}
                                    custom={i}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <MovieCard movie={movie} />
                                </motion.div>
                            ))
                        ) : (
                            !isLoading && <p>Фильмы не найдены для жанра "{currentGenre.name}"</p>
                        )}
                    </AnimatePresence>
                </div>

                {isLoading && (
                    <div className="loading-indicator">
                        <LoadingFallback />
                    </div>
                )}

                {hasMoreMovies && !isLoading && (
                    <button
                        onClick={() => setDisplayedCount((c) => Math.min(c + PAGE_SIZE, movies.length))}
                        className="genre-page__load-more"
                    >
                        Показать ещё
                    </button>
                )}

                {!hasMoreMovies && movies.length > 0 && (
                    <p className="genre-page__loaded">Все фильмы загружены</p>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default GenrePage;
