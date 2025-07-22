import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGenres } from '../../api/api';
import type { Genre } from '../../types';
import { genresMap } from '../../locales/genresMap';
import GenreCard from '../../components/GenreCard/GenreCard';
import type { Variants } from 'framer-motion';
import './GenresPage.css';

const GenresPage = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Варианты анимаций для разных состояний
    // Исправленные типы для анимаций
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const skeletonVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 0.7,
            y: 0,
            transition: {
                delay: i * 0.04,
                duration: 0.3,
                ease: "easeOut"
            }
        })
    };

    const genreCardVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.04 + 0.15,
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setIsLoading(true);
                const serverGenres: string[] = await getGenres();

                const enrichedGenres: Genre[] = serverGenres.map((key: string, index: number) => ({
                    id: index + 1,
                    key,
                    name: genresMap[key]?.name || key.charAt(0).toUpperCase() + key.slice(1),
                    image: genresMap[key]?.image || '/genres/default.png'
                }));

                setGenres(enrichedGenres);
            } catch (error) {
                console.error('Error loading genres:', error);
            } finally {
                setTimeout(() => setIsLoading(false), 200);
            }
        };

        fetchGenres();
    }, []);

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                className="genres-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
            >
                <motion.h1
                    className="genres-title"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                >
                    Жанры фильмов
                </motion.h1>

                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <motion.div
                            className="genres-list"
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            variants={containerVariants}
                            key="skeletons"
                        >
                            {Array.from({ length: 12 }).map((_, index) => (
                                <motion.div
                                    key={`skeleton-${index}`}
                                    custom={index}
                                    variants={skeletonVariants}
                                    className="genre-skeleton"
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="genres-list"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            key="genres"
                        >
                            {genres.map((genre, index) => (
                                <motion.div
                                    key={genre.id}
                                    custom={index}
                                    variants={genreCardVariants}
                                >
                                    <GenreCard genre={genre} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};

export default GenresPage;