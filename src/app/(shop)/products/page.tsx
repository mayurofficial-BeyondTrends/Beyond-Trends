import { Suspense } from 'react'
import { getProducts, getCategories } from '@/lib/services'
import ProductCard from '@/components/shop/ProductCard'
import ProductFilters from '@/components/shop/ProductFilters'
import { SlidersHorizontal } from 'lucide-react'

export const revalidate = 60

interface SearchParams { category?: string; q?: string; sort?: string; featured?: string }

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const [products, categories] = await Promise.all([
    getProducts({ status: 'active', category: searchParams.category }).catch(() => []),
    getCategories().catch(() => []),
  ])

  let filtered = products

  // Search filter
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  // Featured filter
  if (searchParams.featured === 'true') {
    filtered = filtered.filter(p => p.featured)
  }

  // Sort
  if (searchParams.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price)
  else if (searchParams.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price)
  else if (searchParams.sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
  else filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-neutral-900">
                {searchParams.q ? `Search: "${searchParams.q}"` :
                 searchParams.category ? categories.find(c => c.slug === searchParams.category)?.name ?? 'Products' :
                 searchParams.featured ? 'Featured Products' : 'All Products'}
              </h1>
              <p className="text-neutral-500 text-sm mt-0.5">{filtered.length} products</p>
            </div>

            <select
              defaultValue={searchParams.sort || ''}
              className="input w-auto text-sm"
              onChange={e => {
                const url = new URL(window.location.href)
                url.searchParams.set('sort', e.target.value)
                window.location.href = url.toString()
              }}
            >
              <option value="">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <SlidersHorizontal className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No products found</p>
              <p className="text-neutral-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
