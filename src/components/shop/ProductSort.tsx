'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductSort({ value }: { value?: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const handleChange = (nextSort: string) => {
    const next = new URLSearchParams(params.toString())
    if (nextSort) next.set('sort', nextSort)
    else next.delete('sort')
    const query = next.toString()
    router.push(query ? `/products?${query}` : '/products')
  }

  return (
    <select
      defaultValue={value || ''}
      className="input w-auto text-sm"
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name">Name A-Z</option>
    </select>
  )
}
