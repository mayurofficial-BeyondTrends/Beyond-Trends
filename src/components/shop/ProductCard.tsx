'use client'

import Link from 'next/link'
import { Eye, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import {
  cn,
  formatCurrency,
  getProductComparePrice,
  getProductImages,
  getProductPrice,
  getProductSku,
  getProductStock,
  getProductTitle,
  isProductFeatured,
} from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const title = getProductTitle(product)
  const images = getProductImages(product)
  const price = getProductPrice(product)
  const comparePrice = getProductComparePrice(product)
  const stock = getProductStock(product)
  const sku = getProductSku(product)
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0
  const cartItem = items.find((item) => item.productId === product.id)
  const quantity = cartItem?.quantity ?? 0

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    if (stock <= 0) return

    addItem({
      productId: product.id,
      name: title,
      price,
      image: images[0] || '',
      quantity: 1,
      sku,
    })
    toast.success(`${title} added to cart!`)
  }

  const handleDecrease = (event: React.MouseEvent) => {
    event.preventDefault()
    if (!cartItem) return

    updateQuantity(product.id, cartItem.quantity - 1)
  }

  const handleIncrease = (event: React.MouseEvent) => {
    event.preventDefault()
    if (stock <= 0) return

    if (!cartItem) {
      handleAddToCart(event)
      return
    }

    updateQuantity(product.id, Math.min(stock, cartItem.quantity + 1))
  }

  return (
    <Link href={`/products/${product.id}`} className={cn('product-card group block', className)}>
      <div className="card overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          {images[0] ? (
            <img
              src={images[0]}
              alt={product['Image Alt Text'] || title}
              className="product-img w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isProductFeatured(product) && (
              <span className="badge bg-brand-500 text-white text-[10px]">Featured</span>
            )}
            {discount > 0 && (
              <span className="badge bg-green-500 text-white text-[10px]">-{discount}%</span>
            )}
            {stock <= 0 && (
              <span className="badge bg-neutral-800 text-white text-[10px]">Out of Stock</span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(event) => { event.preventDefault(); toast.success('Added to wishlist!') }}
              className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-brand-50 hover:text-brand-500 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-brand-50 hover:text-brand-500 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-neutral-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <Star key={index} className={cn('w-3 h-3', index <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200')} />
            ))}
            <span className="text-xs text-neutral-500 ml-1">(24)</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                <span className="font-bold text-neutral-900">{formatCurrency(price)}</span>
                {comparePrice && (
                  <span className="text-xs text-neutral-400 line-through">{formatCurrency(comparePrice)}</span>
                )}
              </div>
            </div>

            {quantity > 0 ? (
              <div className="flex h-10 items-center overflow-hidden rounded-lg bg-brand-500 text-white shadow-sm">
                <button
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-brand-600"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 min-w-10 flex-1 items-center justify-center border-x border-white/25 px-3 text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={stock <= 0 || quantity >= stock}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="btn-primary btn-sm flex h-10 w-full items-center justify-center gap-2 px-3 py-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            )}
          </div>

          {stock > 0 && stock <= 5 && (
            <p className="text-xs text-orange-500 mt-2">Only {stock} left!</p>
          )}
        </div>
      </div>
    </Link>
  )
}
