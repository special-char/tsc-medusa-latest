import { Star, StarSolid } from "@medusajs/icons"

type StarRatingProps = {
  rating: number
  maxRating?: number
}

export const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-x-1">
      {[...Array(maxRating)].map((_, index) => {
        if (index < rating) {
          return (
            <StarSolid key={index} className="text-medusa-tag-orange-icon" />
          )
        }
        return <Star key={index} className="text-medusa-tag-orange-icon" />
      })}
    </div>
  )
}
