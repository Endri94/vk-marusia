import './MoviePage.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../../api/api';
import type { Movie } from '../../types';
import { RandomMovieBanner } from '../../components/RandomMovieBanner/RandomMovieBanner';
import { LoadingFallback } from '../../components/LoadingFallback/LoadingFallback';

export const MoviePage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return;
            try {
                const data = await getMovieById(id);
                setMovie(data);
            } catch (error) {
                console.error('Ошибка загрузки фильма:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const formatCurrency = (value: string | null) => {
        if (!value || isNaN(Number(value))) return '—';
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    if (loading) {
        return <div className="movie-page__loading">
            <LoadingFallback />
        </div>;
    }

    if (!movie) {
        return <div className="movie-page__error">Фильм не найден</div>;
    }

    return (
        <section className="movie-page">
            <RandomMovieBanner movie={movie} hideRandomizeButton></RandomMovieBanner>

            <div className="movie-page__details">
                <h2 className="movie-page__details-title">О фильме</h2>
                <div className="movie-page__description">
                    <ul className="movie-page__info-list">
                        <li className="movie-page__info-item">
                            <p className="movie-page__info-label">Язык оригинала</p>
                            <span className="movie-page__info-value">{movie.language || '—'}</span>
                        </li>
                        <li className="movie-page__info-item">
                            <p className="movie-page__info-label">Бюджет</p>
                            <span className="movie-page__info-value">{formatCurrency(movie.budget)}</span>
                        </li>
                        <li className="movie-page__info-item">
                            <p className="movie-page__info-label">Выручка</p>
                            <span className="movie-page__info-value">{formatCurrency(movie.revenue)}</span>
                        </li>
                        <li className="movie-page__info-item">
                            <p className="movie-page__info-label">Режиссёр</p>
                            <span className="movie-page__info-value">{movie.director || '—'}</span>
                        </li>
                        <li className="movie-page__info-item">
                            <p className="movie-page__info-label">Продакшен</p>
                            <span className="movie-page__info-value">{movie.production || '—'}</span>
                        </li>
                        <li className="movie-page__info-item">
                            <p className="movie-page__info-label">Награды</p>
                            <span className="movie-page__info-value">{movie.awardsSummary || '—'}</span>
                        </li>
                    </ul>

                </div>
            </div>
        </section>
    );
};

export default MoviePage;
