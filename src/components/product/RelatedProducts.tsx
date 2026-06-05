import Link from 'next/link'
import type { Product as LegacyProduct } from '@/types'
import type { Product } from '@/types/product'
import ProductGrid from '@/components/shop/home/ProductGrid'

interface RelatedProductsProps {
  title?: string
  description?: string
  products: Product[]
}

export default function RelatedProducts({
  title = 'You May Also Like',
  description = '',
  products,
}: RelatedProductsProps) {
  if (products.length === 0) return null

  const mappedProducts: LegacyProduct[] = products.map((product) => ({
    id: product.id,
    Title: product.title,
    name: product.title,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    images: product.images,
    category: product.category,
    stock: product.stock,
    sku: product.slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return (
    <section className="mt-14 sm:mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-[1.9rem] font-semibold text-neutral-900">{title}</h2>
          {description ? <p className="mt-2 text-sm text-neutral-500">{description}</p> : null}
        </div>
        <Link href="/products" className="hidden text-sm font-semibold text-brand-500 transition hover:text-brand-600 sm:inline-flex">
          View All →
        </Link>
      </div>
      <ProductGrid
        products={mappedProducts}
        limit={5}
        className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5"
      />
    </section>
  )
}
