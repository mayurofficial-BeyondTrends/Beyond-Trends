import { memo, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'

interface ProductPriceProps {
  price: number
  comparePrice?: number
  showSaleBadge?: boolean
  className?: string
}

function ProductPrice({
  price,
  comparePrice,
  showSaleBadge = true,
  className,
}: ProductPriceProps) {
  const discount = useMemo(
    () => (comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0),
    [comparePrice, price]
  )
  const savings = useMemo(
    () => (comparePrice ? comparePrice - price : 0),
    [comparePrice, price]
  )

  return (
    <div className={className ?? 'flex flex-wrap items-center gap-3'}>
      <span className="text-[2rem] font-bold leading-none text-brand-600 sm:text-[2.3rem]">
        {formatCurrency(price)}
      </span>
      {comparePrice ? (
        <>
          <span className="text-base font-medium text-neutral-400 line-through sm:text-lg">
            {formatCurrency(comparePrice)}
          </span>
          {showSaleBadge && discount > 0 && (
            <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-500">
              You Save {formatCurrency(savings)} ({discount}%)
            </span>
          )}
        </>
      ) : null}
    </div>
  )
}

export default memo(ProductPrice)
