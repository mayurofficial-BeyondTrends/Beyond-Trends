'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react'
import { getProduct } from '@/lib/services'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    getProduct(id as string).then(p => {
      setProduct(p)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-neutral-500">Product not found.</p>
    </div>
  )

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.images[0] || '', quantity, sku: product.sku })
    toast.success(`Added ${quantity} × ${product.name} to cart!`)
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4">
            {product.images[selectedImage] ? (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <ShoppingCart className="w-20 h-20" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === i ? 'border-brand-500' : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-brand-500 font-medium text-sm uppercase tracking-wider mb-2">{product.category}</p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'}`} />
              ))}
            </div>
            <span className="text-sm text-neutral-500">4.0 (24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-bold text-neutral-900">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-neutral-400 line-through">{formatCurrency(product.comparePrice)}</span>
                <span className="badge bg-green-100 text-green-700">{discount}% off</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-neutral-600 leading-relaxed mb-8">{product.description}</p>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-600 font-medium">✓ In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-sm text-red-500 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-8">
              <span className="label mb-0">Quantity</span>
              <div className="flex items-center gap-1 border border-neutral-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2.5 hover:bg-neutral-50 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2.5 hover:bg-neutral-50 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock <= 0} className="btn-primary flex-1 btn-lg">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="btn-outline px-4">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-neutral-100">
            {[
              { icon: Truck, text: 'Free shipping on ₹999+' },
              { icon: Shield, text: '100% secure payment' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-neutral-600" />
                </div>
                <p className="text-xs text-neutral-600">{text}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
              {product.tags.map(tag => (
                <span key={tag} className="badge bg-neutral-100 text-neutral-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
