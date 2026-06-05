import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export default function ProductRating({
  rating,
  reviewCount,
  size = 'md',
  className,
}: ProductRatingProps) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={cn(iconSize, index <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200')}
          />
        ))}
      </div>
      <span className="text-sm text-neutral-500">
        {rating.toFixed(1)}
        {typeof reviewCount === 'number' ? ` (${reviewCount} reviews)` : ''}
      </span>
    </div>
  )
}
