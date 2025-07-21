import type { Movie } from '../../types';
import { RatingBadge } from '../RatingBadge/RatingBadge';
import { formatDuration } from '../../utils/formatTime';
import './SearchResults.css';
import NoPosterImage from '../../assets/icons/noposter.svg'
import { motion, AnimatePresence } from 'framer-motion';

import { SearchLoadingFallback } from '../SearchLoadingFallback/SearchLoadingFallback';


type SearchResultsProps = {
    results: Movie[];
    query: string;
    isLoading: boolean;
    onSelect: (id: number) => void;
    variant?: 'dropdown' | 'modal';
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            when: "beforeChildren"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

export const SearchResults = ({
    results,
    query,
    isLoading,
    onSelect,
    variant = 'dropdown',
}: SearchResultsProps) => {
    const baseClass = variant === 'dropdown' ? 'search-dropdown' : 'search-result-mobile';

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    className={`${baseClass}-loading`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    <SearchLoadingFallback></SearchLoadingFallback>
                </motion.div>
            ) : results.length > 0 ? (
                <motion.div
                    key="results"
                    className={`${baseClass}-list`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {results.map((movie) => (
                        <motion.div
                            key={movie.id}
                            className={`${baseClass}-item`}
                            variants={itemVariants}
                            onClick={() => onSelect(movie.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.img
                                src={movie.posterUrl || movie.backdropUrl || NoPosterImage}
                                alt={movie.title}
                                className={`${baseClass}-poster`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            />
                            <div className={`${baseClass}-details`}>
                                <div className={`${baseClass}-meta`}>
                                    <RatingBadge rating={movie.tmdbRating ?? 0} />
                                    <span>{movie.releaseYear || '—'}</span>
                                    <span>{movie.genres?.join(', ') || '—'}</span>
                                    <span>{formatDuration(movie.runtime)}</span>
                                </div>
                                <motion.div
                                    className={`${baseClass}-title`}
                                    initial={{ x: -10 }}
                                    animate={{ x: 0 }}
                                >
                                    {movie.title}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}

                </motion.div>
            ) : query.trim() ? (
                <motion.div
                    key="empty"
                    className={`${baseClass}-empty`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    По запросу "{query}" ничего не найдено
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};