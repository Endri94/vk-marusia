import type { Genre } from '../../types'
import { Link } from 'react-router-dom'
import './GenreCard.css'

type Props = {
    genre: Genre
}
const GenreCard = ({ genre }: Props) => {
    return (
        <Link to={`/genre/${genre.key}`} className="genre-card">
            <div
                className="genre-card__image"
                style={{ backgroundImage: `url(${genre.image})` }}
            />
            <div className="genre-card__title">{genre.name}</div>
        </Link>
    )
}

export default GenreCard