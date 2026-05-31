'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock <= 0) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
      sku: product.sku,
    })
    toast.success(`${product.name} added to cart!`)
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.id}`} className={cn('product-card group block', className)}>
      <div className="card overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-img w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="badge bg-brand-500 text-white text-[10px]">Featured</span>
            )}
            {discount > 0 && (
              <span className="badge bg-green-500 text-white text-[10px]">-{discount}%</span>
            )}
            {product.stock <= 0 && (
              <span className="badge bg-neutral-800 text-white text-[10px]">Out of Stock</span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={e => { e.preventDefault(); toast.success('Added to wishlist!') }}
              className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-brand-50 hover:text-brand-500 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-brand-50 hover:text-brand-500 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-neutral-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={cn('w-3 h-3', i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200')} />
            ))}
            <span className="text-xs text-neutral-500 ml-1">(24)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-neutral-900">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xs text-neutral-400 line-through">{formatCurrency(product.comparePrice)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn-primary btn-sm px-3 py-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-500 mt-2">Only {product.stock} left!</p>
          )}
        </div>
      </div>
    </Link>
  )
}
