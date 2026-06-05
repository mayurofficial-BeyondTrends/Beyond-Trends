import Link from 'next/link'
import type { Product } from '@/types'
import SectionHeading from './SectionHeading'
import ProductGrid from './ProductGrid'

interface ProductShowcaseProps {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  products: Product[]
}

export default function ProductShowcase({
  title,
  description,
  actionHref = '/products',
  actionLabel = 'View All',
  products,
}: ProductShowcaseProps) {
  return (
    <section className="premium-section px-4 py-7 sm:px-6 lg:px-8">
      <div className="shell-container px-0">
        <SectionHeading
          title={title}
          description={description}
          actionHref={actionHref}
          actionLabel={actionLabel}
        />

        {products.length === 0 ? (
          <div className="mt-6 rounded-[1.35rem] bg-white px-4 py-12 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-neutral-100 sm:mt-8 sm:rounded-[1.75rem] sm:px-6 sm:py-16">
            <p className="text-lg font-medium text-neutral-500">No products yet. Check back soon!</p>
          </div>
        ) : (
          <ProductGrid
            products={products}
            limit={4}
            className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-4"
          />
        )}

        <div className="mt-6 text-right sm:hidden">
          <Link href={actionHref} className="text-sm font-semibold text-brand-500">
            {actionLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
