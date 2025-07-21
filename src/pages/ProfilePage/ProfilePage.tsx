import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFavoriteMovies, removeFavoriteMovie } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../../types';
import { useAuth } from '../../context/useAuth';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { LoadingFallback } from '../../components/LoadingFallback/LoadingFallback';

import heartIcon from '../../assets/icons/heart.svg';
import userIcon from '../../assets/icons/profile.svg';
import userMail from '../../assets/icons/user-mail.svg';

import './ProfilePage.css';

const getInitial = (str?: string | null) => (str?.[0]?.toUpperCase() ?? '');
const getFullName = (name?: string | null, surname?: string | null) => {
    if (!name && !surname) return '-';
    return `${name ?? ''} ${surname ?? ''}`.trim();
};

const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 },
};

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Для модалки подтверждения удаления
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false); // Лоадер удаления

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const openDeleteConfirm = (id: number) => {
        setMovieToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (movieToDelete === null) return;

        setIsDeleting(true); // Показать лоадер
        try {
            await removeFavoriteMovie(movieToDelete);
            setFavorites((prev) => prev.filter((m) => m.id !== movieToDelete));
        } catch (err) {
            console.error('Ошибка при удалении фильма:', err);
        } finally {
            setIsDeleting(false);
            setConfirmOpen(false);
            setMovieToDelete(null);
        }
    };

    const cancelDelete = () => {
        if (isDeleting) return; // Блокируем отмену при удалении
        setConfirmOpen(false);
        setMovieToDelete(null);
    };

    useEffect(() => {
        if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab]);

    const fetchFavorites = async () => {
        setIsLoading(true);
        try {
            const data = await getFavoriteMovies();
            setFavorites(data);
        } catch (err) {
            console.error('Ошибка при загрузке избранного:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="profile-page"
            {...animationProps}
            key={activeTab} // анимация при смене вкладки
        >
            <h1 className="profile-title">Мой аккаунт</h1>

            <div className="profile-tabs">
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={activeTab === 'favorites' ? 'active' : ''}
                >
                    <img src={heartIcon} alt="Избранное" />
                    <span className="profile-tabs__title">Избранные фильмы</span>
                    <span className="profile-tabs__title--mobile">Избранное</span>
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={activeTab === 'settings' ? 'active' : ''}
                >
                    <img src={userIcon} alt="Настройки" />
                    <span className="profile-tabs__title">Настройки аккаунта</span>
                    <span className="profile-tabs__title--mobile">Настройки</span>
                </button>
            </div>

            {activeTab === 'favorites' && (
                <motion.div
                    className="profile-favorites"
                    {...animationProps}
                    key="favorites-content"
                >
                    {isLoading ? (
                        <LoadingFallback />
                    ) : favorites.length === 0 ? (
                        <p>Вы ещё не добавили фильмы в избранное.</p>
                    ) : (
                        <section className="home__top profile__top">
                            <h2 className="home__top-title">Избранные фильмы</h2>
                            <div className="home__top-list profile__top-list">
                                {favorites.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        variant="default"
                                        onRemove={() => openDeleteConfirm(movie.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </motion.div>
            )}

            {activeTab === 'settings' && (
                <motion.div
                    className="profile-settings"
                    {...animationProps}
                    key="settings-content"
                >
                    <div className="profile-user-blocks">
                        <div className="profile-user-block">
                            <div className="profile-user-initials">
                                {getInitial(user?.name)}
                                {getInitial(user?.surname)}
                            </div>
                            <div className="profile-user-texts">
                                <h3>Имя и Фамилия</h3>
                                <p>{getFullName(user?.name, user?.surname)}</p>
                            </div>
                        </div>

                        <div className="profile-user-block">
                            <div className="profile-user-initials">
                                <img src={userMail} alt="Email" className="profile-user-email-icon" />
                            </div>
                            <div className="profile-user-texts">
                                <h3>Электронная почта</h3>
                                <p>{user?.email || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>
                        Выйти из аккаунта
                    </button>
                </motion.div>
            )}

            <ConfirmModal
                isOpen={isConfirmOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message={isDeleting ? 'Удаление...' : 'Удалить фильм из избранного?'}
                loading={isDeleting} // <-- сюда нужно передать флаг лоадера
            />
        </motion.div>
    );
};

export default ProfilePage;
