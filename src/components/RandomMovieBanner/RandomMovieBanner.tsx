import './RandomMovieBanner.css';
import { RatingBadge } from '../RatingBadge/RatingBadge';
import UpdateIcon from '../../assets/icons/update.svg';
import NoPosterImage from '../../assets/icons/noposter.svg';
import type { Movie } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '../Tooltip/Tooltip';
import { useAuth } from '../../context/useAuth';
import { addFavoriteMovie, getFavoriteMovies } from '../../api/api';
import { useEffect, useState, useCallback, useMemo } from 'react';
import TrailerModal from '../TrailerModal/TrailerModal';
import { easeInOut, motion } from 'framer-motion';

type Props = {
    movie: Movie;
    onRandomize?: () => void;
    hideRandomizeButton?: boolean;
};

const formatDuration = (minutes: number): string => {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes} мин`;
    return `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`;
};

export const RandomMovieBanner = ({ movie, onRandomize, hideRandomizeButton }: Props) => {
    const navigate = useNavigate();
    const { user, openAuthModal } = useAuth();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        target.src = NoPosterImage;
        target.onerror = null;
    }, []);

    useEffect(() => {
        let isMounted = true;

        const checkIsFavorite = async () => {
            if (!user) {
                if (isMounted) setIsFavorite(false);
                return;
            }
            try {
                const favorites = await getFavoriteMovies();
                if (isMounted) {
                    setIsFavorite(favorites.some((fav) => fav.id === movie.id));
                }
            } catch (error) {
                console.error('Ошибка при проверке избранного:', error);
            }
        };

        checkIsFavorite();

        return () => {
            isMounted = false;
        };
    }, [movie.id, user]);

    const imageUrl = useMemo(() => movie.posterUrl || movie.backdropUrl || NoPosterImage, [
        movie.posterUrl,
        movie.backdropUrl,
    ]);

    const handleAddToFavorites = useCallback(async () => {
        if (!user) {
            openAuthModal();
            return;
        }
        try {
            await addFavoriteMovie(movie.id);
            setIsFavorite(true);
            console.log('Фильм добавлен в избранное');
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
        }
    }, [user, openAuthModal, movie.id]);

    const openTrailer = useCallback(() => setIsTrailerOpen(true), []);
    const closeTrailer = useCallback(() => setIsTrailerOpen(false), []);

    // Добавим варианты анимации
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 2, ease: easeInOut } },
    };
    return (
        <motion.section
            className="banner"
            aria-label={`Информация о фильме ${movie.title}`}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            // Можно добавить exit, если будешь анимировать уход
            exit="hidden"
        >
            <div className="banner__content">
                <div className="banner__info">
                    <div className="banner__meta">
                        <RatingBadge rating={movie.tmdbRating} />
                        <span className="banner__meta-item">{movie.releaseYear}</span>
                        <span className="banner__meta-item">{movie.genres?.join(', ') || 'Жанр неизвестен'}</span>
                        <span className="banner__meta-item">{formatDuration(movie.runtime)}</span>
                    </div>

                    <h1 className="banner__title">{movie.title}</h1>
                    {movie.plot && <p className="banner__description">{movie.plot}</p>}

                    <div className="banner__buttons">
                        <button className="banner__btn banner__btn--primary" onClick={openTrailer}>
                            Трейлер
                        </button>

                        {!hideRandomizeButton && (
                            <button
                                className="banner__btn banner__btn--secondary"
                                onClick={() => navigate(`/movie/${movie.id}`)}
                            >
                                О фильме
                            </button>
                        )}

                        <Tooltip text={isFavorite ? 'Уже в избранном' : 'Добавить в избранное'}>
                            <button
                                className={`banner__btn banner__btn--icon banner__btn--favorite ${isFavorite ? 'active' : ''}`}
                                onClick={handleAddToFavorites}
                                aria-label="Добавить в избранное"
                                disabled={isFavorite}
                            >
                                <svg
                                    className="heart-icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
                                        fill="currentColor"
                                        stroke="none"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </button>
                        </Tooltip>

                        {!hideRandomizeButton && onRandomize && (
                            <Tooltip text="Показать другой фильм">
                                <button
                                    className="banner__btn banner__btn--icon banner__btn--random"
                                    onClick={onRandomize}
                                    aria-label="Показать другой случайный фильм"
                                >
                                    <img src={UpdateIcon} alt="" aria-hidden="true" />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="banner__image">
                    <img
                        src={imageUrl}
                        alt={`Постер фильма "${movie.title}"`}
                        onError={handleImageError}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </div>

            {isTrailerOpen && (
                <TrailerModal youtubeId={movie.trailerYouTubeId} title={movie.title} onClose={closeTrailer} />
            )}
        </motion.section>
    );
};
