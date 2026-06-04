import { Suspense } from 'react'
import { getProducts, getCategories } from '@/lib/services'
import ProductCard from '@/components/shop/ProductCard'
import ProductFilters from '@/components/shop/ProductFilters'
import ProductSort from '@/components/shop/ProductSort'
import { SlidersHorizontal } from 'lucide-react'
import {
  getProductDescription,
  getProductPrice,
  getProductTags,
  getProductTitle,
  isProductFeatured,
} from '@/lib/utils'

export const revalidate = 60

interface SearchParams { category?: string; q?: string; sort?: string; featured?: string }

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const [products, categories] = await Promise.all([
    getProducts({ status: 'active', category: searchParams.category }).catch(() => []),
    getCategories().catch(() => []),
  ])

  let filtered = products

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    filtered = filtered.filter((p) =>
      getProductTitle(p).toLowerCase().includes(q) ||
      getProductDescription(p).toLowerCase().includes(q) ||
      getProductTags(p).some((t) => t.toLowerCase().includes(q))
    )
  }

  if (searchParams.featured === 'true') {
    filtered = filtered.filter((p) => isProductFeatured(p))
  }

  if (searchParams.sort === 'price-asc') filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b))
  else if (searchParams.sort === 'price-desc') filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a))
  else if (searchParams.sort === 'name') filtered.sort((a, b) => getProductTitle(a).localeCompare(getProductTitle(b)))
  else filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-neutral-900">
                {searchParams.q ? `Search: "${searchParams.q}"` :
                  searchParams.category ? categories.find((c) => c.slug === searchParams.category)?.name ?? 'Products' :
                    searchParams.featured ? 'Featured Products' : 'All Products'}
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500">{filtered.length} products</p>
            </div>

            <ProductSort value={searchParams.sort} />
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <SlidersHorizontal className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
              <p className="font-medium text-neutral-500">No products found</p>
              <p className="mt-1 text-sm text-neutral-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
