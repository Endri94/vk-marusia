import './RatingBadge.css'
import StarIcon from '../../assets/icons/star.svg'

type Props = {
    rating: number
}

export const RatingBadge = ({ rating }: Props) => {
    const getColorClass = (rating: number) => {
        if (rating >= 8) return 'rating--gold'
        if (rating >= 7) return 'rating--green'
        if (rating >= 5) return 'rating--gray'
        return 'rating--red'
    }

    return (
        <div className={`rating ${getColorClass(rating)}`}>
            <img src={StarIcon} alt="Рейтинг" />
            <span className='rating-text'>{rating.toFixed(1)}</span>
        </div>
    )
}