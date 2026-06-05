import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CreditCard, RefreshCw, Shield, Truck } from 'lucide-react'
import type { ProductFeatureItem } from '@/types/product'

const featureIcons: Record<string, LucideIcon> = {
  'Free Shipping': Truck,
  'Easy Returns': RefreshCw,
  'Secure Checkout': Shield,
  'Cash On Delivery': CreditCard,
  default: Shield,
}

interface ProductFeaturesProps {
  items: ProductFeatureItem[]
}

function ProductFeatures({ items }: ProductFeaturesProps) {
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-5 border-t border-[#efefef] pt-5">
      {items.map(({ title, description }) => {
        const Icon = featureIcons[title] || featureIcons.default

        return (
          <div key={title} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center text-brand-500">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-neutral-500">{description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(ProductFeatures)
