import React, { useCallback, useMemo } from 'react';
import './MovieCard.css';
import type { Movie } from '../../types';
import { useNavigate } from 'react-router-dom';
import NoPosterImage from '../../assets/icons/noposter.svg';
import removeMovie from '../../assets/icons/close-modal.svg';

type Props = {
    movie: Movie;
    variant?: 'default' | 'genre' | 'top';
    index?: number;
    onRemove?: () => void;
};

const areEqual = (prevProps: Props, nextProps: Props) =>
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.index === nextProps.index &&
    prevProps.onRemove === nextProps.onRemove;

export const MovieCard = React.memo(({ movie, variant = 'default', index, onRemove }: Props) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate(`/movie/${movie.id}`);
    }, [navigate, movie.id]);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        target.src = NoPosterImage;
        target.onerror = null;
    }, []);

    const onRemoveClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onRemove) onRemove();
        },
        [onRemove]
    );

    const imageUrl = useMemo(() => movie.posterUrl || movie.backdropUrl || NoPosterImage, [
        movie.posterUrl,
        movie.backdropUrl,
    ]);

    return (
        <div
            className={`movie-card movie-card--${variant}`}
            onClick={handleClick}
            tabIndex={0}
            role="button"
            aria-label={`Перейти к фильму ${movie.title}`}
        >
            {variant === 'top' && typeof index === 'number' && <div className="movie-card__index">{index + 1}</div>}

            <img
                className="movie-card__image"
                src={imageUrl}
                alt={`Постер фильма "${movie.title}"`}
                onError={handleImageError}
                loading="lazy"
                decoding="async"
            />
            {onRemove && (
                <button
                    type="button"
                    className="movie-card__remove-btn"
                    aria-label={`Удалить фильм "${movie.title}" из избранного`}
                    onClick={onRemoveClick}
                >
                    <img src={removeMovie} alt="Кнопка удаления фильма" />
                </button>
            )}
        </div>
    );
}, areEqual);
