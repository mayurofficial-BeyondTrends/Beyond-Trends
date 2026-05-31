'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const params = useSearchParams()

  const setParam = (key: string, value: string | null) => {
    const url = new URL(window.location.href)
    if (value) url.searchParams.set(key, value)
    else url.searchParams.delete(key)
    router.push(url.pathname + url.search)
  }

  const activeCategory = params.get('category')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-neutral-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => setParam('category', null)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              !activeCategory ? 'bg-brand-50 text-brand-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
            )}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setParam('category', cat.slug)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                activeCategory === cat.slug ? 'bg-brand-50 text-brand-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-neutral-900 mb-3 text-sm uppercase tracking-wider">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={params.get('featured') === 'true'}
            onChange={e => setParam('featured', e.target.checked ? 'true' : null)}
            className="w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Featured only</span>
        </label>
      </div>
    </div>
  )
}
