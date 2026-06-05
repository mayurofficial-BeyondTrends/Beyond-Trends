import type { Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'

interface ProductGridProps {
  products: Product[]
  limit?: number
  className?: string
}

export default function ProductGrid({ products, limit, className }: ProductGridProps) {
  const items = typeof limit === 'number' ? products.slice(0, limit) : products

  return (
    <div className={className ?? 'grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4'}>
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
