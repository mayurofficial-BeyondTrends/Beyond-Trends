'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '@/context/CartContext'
import type { Product, ProductFeatureItem, ProductReview, ProductVariantGroup } from '@/types/product'
import ProductActions from './ProductActions'
import ProductPrice from './ProductPrice'
import ProductQuantitySelector from './ProductQuantitySelector'
import ProductRating from './ProductRating'
import ProductVariantSelector from './ProductVariantSelector'

interface ProductInfoProps {
  product: Product
  reviews: ProductReview[]
  variants?: ProductVariantGroup[]
  featureHighlights?: ProductFeatureItem[]
  lowStockThreshold?: number
}

export default function ProductInfo({
  product,
  reviews,
  variants = [],
  featureHighlights = [],
  lowStockThreshold = 5,
}: ProductInfoProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= lowStockThreshold

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      sku: product.slug,
    })

    toast.success(`${product.title} added to cart!`)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="min-w-0 pt-1 lg:pl-3">
      <div className="hidden lg:block">
        <h1 className="mb-3 font-sans text-[2rem] font-semibold leading-tight text-[#111111] lg:text-[2.8rem]">
          {product.title}
        </h1>
        <ProductRating rating={product.rating} reviewCount={product.reviewCount || reviews.length} className="mb-5" />
      </div>

      <div className="flex flex-col">
        <div className="order-2 mb-6 lg:order-1">
          <div className="mb-2">
            <ProductPrice price={product.price} comparePrice={product.comparePrice} />
          </div>
          <p className="text-sm text-neutral-500">Inclusive of all taxes</p>
        </div>

        <div className="order-4 mb-6 rounded-2xl bg-[#fff2f6] px-5 py-4 lg:order-2">
          <div className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-[#111111]">
            <Flame className="h-4 w-4 text-brand-500" />
            <span className="text-brand-500">Special Offer:</span>
            <span>Extra 10% OFF on Prepaid Orders</span>
          </div>
          <div className="mt-3 inline-flex rounded-md border border-[#ffb7cb] bg-white px-3 py-1.5 text-sm font-medium text-[#111111]">
            Use Code: <span className="ml-1 font-semibold text-brand-500">PREPAY10</span>
          </div>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="order-5 mb-6 lg:order-3">
            <p className="mb-3 text-base font-semibold text-neutral-900">
              Color: <span className="font-medium">{product.colors[0]}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className={`relative h-9 w-9 rounded-full border ${
                    color === product.colors?.[0] ? 'border-brand-500 ring-2 ring-brand-200' : 'border-neutral-200'
                  }`}
                >
                  <span
                    className="absolute inset-[4px] rounded-full border border-black/5"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="order-1 mb-6 space-y-5 lg:order-4">
          <ProductVariantSelector options={variants} onChange={setSelectedVariants} />
          <ProductQuantitySelector quantity={quantity} max={Math.max(1, product.stock)} onChange={setQuantity} />
          <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} disabled={isOutOfStock} />
        </div>

        <div className="order-3 mb-2 lg:order-5 lg:mb-0">
          {isOutOfStock ? (
            <p className="text-sm font-medium text-red-500">Out of Stock</p>
          ) : isLowStock ? (
            <p className="text-sm font-medium text-orange-500">Low stock. Only {product.stock} available.</p>
          ) : (
            <p className="text-sm font-medium text-green-600">In Stock ({product.stock} available)</p>
          )}
        </div>

        {Object.keys(selectedVariants).length > 0 && (
          <div className="order-6 mt-2 rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">Selected Variants</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(selectedVariants).map(([key, value]) => (
                <span key={key} className="badge bg-neutral-100 text-neutral-700">
                  {key}: {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {featureHighlights.length > 0 && (
        <div className="mt-8 border-t border-neutral-100 pt-6">
          <p className="mb-4 whitespace-pre-line text-sm leading-7 text-neutral-600 sm:text-base">
            {product.description}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {featureHighlights.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-[#f0e3e7] bg-[#fffafc] px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">{feature.title}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
