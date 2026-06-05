import type { ProductReview } from '@/types/product'
import ProductRating from './ProductRating'

interface ProductReviewsProps {
  title?: string
  reviews: ProductReview[]
}

export default function ProductReviews({
  title = 'Customer Reviews',
  reviews,
}: ProductReviewsProps) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <ProductRating rating={average} reviewCount={reviews.length} />
          <span className="badge bg-brand-50 text-brand-600">
            {reviews.length === 0 ? 'No reviews yet' : `${reviews.length} customer reviews`}
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-500">
          No reviews yet. Be the first to share your experience.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900">{review.userName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">
                    {review.verified ? 'Verified Purchase' : 'Customer Review'}
                  </p>
                </div>
                <ProductRating rating={review.rating} size="sm" />
              </div>
              <p className="mt-3 text-sm font-semibold text-neutral-800">{review.title}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">{review.body}</p>
              {review.createdAt && (
                <p className="mt-2 text-xs text-neutral-400">{review.createdAt}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
