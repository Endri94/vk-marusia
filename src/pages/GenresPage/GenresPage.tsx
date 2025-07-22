import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getGenres } from '../../api/api'
import type { Genre } from '../../types'
import { genresMap } from '../../locales/genresMap'
import GenreCard from '../../components/GenreCard/GenreCard'
import './GenresPage.css'

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.3 },
    }),
}

const GenresPage = () => {
    const [genres, setGenres] = useState<Genre[]>([])

    useEffect(() => {
        const fetchGenres = async () => {
            const serverGenres: string[] = await getGenres()

            const enrichedGenres: Genre[] = serverGenres.map((key, index) => {
                const fallback = {
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    image: '/genres/default.png',
                }

                return {
                    id: index + 1,
                    key,
                    name: genresMap[key]?.name || fallback.name,
                    image: genresMap[key]?.image || fallback.image,
                }
            })

            setGenres(enrichedGenres)
        }

        fetchGenres()
    }, [])

    return (
        <motion.div
            className="genres-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 2 }}
        >
            <h1 className="genres-title">Жанры фильмов</h1>
            <motion.div className="genres-list"
                initial="hidden"
                animate="visible">
                {genres.map((genre, i) => (
                    <motion.div
                        key={genre.id}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <GenreCard genre={genre} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default GenresPage
