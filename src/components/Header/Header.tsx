import './Header.css';
import logo from '../../assets/icons/logo.svg';
import searchIconGray from '../../assets/icons/loop.svg';
import searchIcon from '../../assets/icons/search-mobile.svg';
import userIcon from '../../assets/icons/user-mobile.svg';
import genresIcon from '../../assets/icons/genres-mobile.svg';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { SearchModal } from '../SearchModal/SearchModal';
import { useAuth } from '../../context/useAuth';
import { useMovieSearch } from '../../hooks/useMovieSearch';
import { SearchResults } from '../SearchResults/SearchResults';

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, openAuthModal } = useAuth();

    const {
        query: searchQuery,
        setQuery: setSearchQuery,
        results,
        isLoading
    } = useMovieSearch();

    const searchWrapperRef = useRef<HTMLDivElement>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const handleMovieSelect = (movieId: number) => {
        setSearchQuery('');
        navigate(`/movie/${movieId}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <header className="header" role="banner">
            <div className="container">
                <div className='header-wrapper'>
                    <div className="header__left">
                        <NavLink to="/">
                            <img src={logo} alt="Логотип" className="header__logo-icon" />
                        </NavLink>
                    </div>

                    <nav className="header__nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `header__link ${isActive ? 'header__link--active' : ''}`
                            }
                        >
                            Главная
                        </NavLink>

                        <NavLink
                            to="/genres"
                            className={() =>
                                `header__link ${location.pathname.startsWith('/genre') ||
                                    location.pathname === '/genres'
                                    ? 'header__link--active'
                                    : ''
                                }`
                            }
                        >
                            Жанры
                        </NavLink>
                    </nav>

                    <div className="header__search-wrapper" ref={searchWrapperRef}>
                        <img
                            src={searchIconGray}
                            className="header__search-loop"
                            alt="Иконка поиска"
                        />
                        <input
                            type="text"
                            className="header__search-input"
                            placeholder="Поиск"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                if (results.length > 0) {
                                    // Убрали setIsSearchActive, так как isLoading управляется в useMovieSearch
                                }
                            }}
                        />
                        {searchQuery && (
                            <button
                                className="header__search-clear"
                                aria-label="Очистить поиск"
                                onClick={clearSearch}
                                type="button"
                            >
                                ×
                            </button>
                        )}

                        {(isLoading || results.length > 0 || searchQuery.trim()) && (
                            <div className="search-dropdown">
                                <SearchResults
                                    results={results}
                                    query={searchQuery}
                                    isLoading={isLoading}
                                    onSelect={handleMovieSelect}
                                    variant="dropdown"
                                />
                            </div>
                        )}
                    </div>

                    {user ? (
                        <NavLink
                            to="/profile" 
                            className={({ isActive }) =>
                                `header__link header__link--user ${isActive ? 'header__link--active' : ''}`
                            }
                        >
                            {user.name}
                        </NavLink>
                    ) : (
                        <button
                            className="header__login-button"
                            onClick={openAuthModal}
                        >
                            Войти
                        </button>
                    )}

                    <div className="header__mobile-icons">
                        <NavLink
                            to="/genres" title='Жанры'
                            className={({ isActive }) => (isActive ? 'mobile-icon--active' : 'mobile-icon--genre')}
                        >
                            <img src={genresIcon} alt="Жанры" />
                        </NavLink>

                        <button title='Поиск'
                            onClick={() => setIsSearchModalOpen(true)}
                            className={location.pathname === '/search' ? 'mobile-icon--active' : 'mobile-icon--search'}
                            type="button"
                            aria-label="Поиск"
                        >
                            <img src={searchIcon} alt="Поиск" />
                        </button>

                        <button title='Профиль'
                            onClick={() => {
                                if (user) {
                                    navigate('/profile');
                                } else {
                                    openAuthModal();
                                }
                            }}
                            className={location.pathname === '/profile' ? 'mobile-icon--active' : 'mobile-icon--profile'}
                            type="button"
                            aria-label="Профиль"
                        >
                            <img src={userIcon} alt="Профиль" />
                        </button>
                    </div>
                </div>
            </div>

            {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} />}
        </header>
    );
};