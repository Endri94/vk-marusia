import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTop10Movies, getRandomMovie } from '../../api/api'
import { RandomMovieBanner } from '../../components/RandomMovieBanner/RandomMovieBanner'
import { MovieCard } from '../../components/MovieCard/MovieCard'
import type { Movie } from '../../types'
import './HomePage.css'

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [randomMovie, setRandomMovie] = useState<Movie | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const [topMovies, random] = await Promise.all([
                    getTop10Movies(),
                    getRandomMovie(),
                ])
                setMovies(topMovies)
                setRandomMovie(random)
            } catch (err) {
                console.error('Ошибка загрузки фильмов:', err)
            }
        }

        load()
    }, [])

    const handleRandomize = async () => {
        try {
            const random = await getRandomMovie()
            setRandomMovie(random)
        } catch (err) {
            console.error('Ошибка загрузки случайного фильма:', err)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
            >
                <div className="home__banner">
                    {randomMovie && (
                        <RandomMovieBanner movie={randomMovie} onRandomize={handleRandomize} />
                    )}
                </div>

                <motion.div
                    className="home__top"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="home__top-title">Топ 10 фильмов</h2>
                    <AnimatePresence>
                        <motion.div
                            className="home__top-list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {movies.map((movie, index) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    index={index}
                                    variant="top"
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default HomePage
