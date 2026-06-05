import type { ProductShippingItem } from '@/types/product'

interface ProductShippingProps {
  title?: string
  items: ProductShippingItem[]
}

export default function ProductShipping({
  title = 'Shipping & Returns',
  items,
}: ProductShippingProps) {
  if (items.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
