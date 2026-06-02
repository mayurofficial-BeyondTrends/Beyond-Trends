'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Minus, Plus, Shield, ShoppingCart, Star, Truck } from 'lucide-react'
import { getProduct, getReviews } from '@/lib/services'
import { useCart } from '@/context/CartContext'
import {
  formatCurrency,
  getProductCategory,
  getProductComparePrice,
  getProductDescription,
  getProductDescriptionHtml,
  getProductImages,
  getProductPrice,
  getProductSku,
  getProductStatus,
  getProductStock,
  getProductTags,
  getProductTitle,
} from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product, Review } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'details' | 'features' | 'reviews'>('details')
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    getProduct(id as string).then((item) => {
      setProduct(item)
      if (item) {
        getReviews(item.id).then(setReviews).catch(() => setReviews([]))
      }
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500">Product not found.</p>
      </div>
    )
  }

  const title = getProductTitle(product)
  const description = getProductDescription(product)
  const descriptionHtml = getProductDescriptionHtml(product)
  const images = getProductImages(product)
  const price = getProductPrice(product)
  const comparePrice = getProductComparePrice(product)
  const category = getProductCategory(product)
  const stock = getProductStock(product)
  const sku = getProductSku(product)
  const status = getProductStatus(product)
  const tags = getProductTags(product)
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: title, price, image: images[0] || '', quantity, sku })
    toast.success(`Added ${quantity} x ${title} to cart!`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product['Image Alt Text'] || title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <ShoppingCart className="w-20 h-20" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === index ? 'border-brand-500' : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-brand-500 font-medium text-sm uppercase tracking-wider mb-2">{category}</p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">{title}</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star key={index} className={`w-4 h-4 ${index <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'}`} />
              ))}
            </div>
            <span className="text-sm text-neutral-500">4.0 (24 reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-bold text-neutral-900">{formatCurrency(price)}</span>
            {comparePrice && (
              <>
                <span className="text-lg text-neutral-400 line-through">{formatCurrency(comparePrice)}</span>
                <span className="badge bg-green-100 text-green-700">{discount}% off</span>
              </>
            )}
          </div>

          <p className="text-neutral-600 leading-relaxed mb-8 whitespace-pre-line">{description}</p>

          <div className="mb-6">
            {stock > 0 ? (
              <p className="text-sm text-green-600 font-medium">In Stock ({stock} available)</p>
            ) : (
              <p className="text-sm text-red-500 font-medium">Out of Stock</p>
            )}
          </div>

          {stock > 0 && (
            <div className="flex items-center gap-4 mb-8">
              <span className="label mb-0">Quantity</span>
              <div className="flex items-center gap-1 border border-neutral-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-2.5 hover:bg-neutral-50 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                <button onClick={() => setQuantity((value) => Math.min(stock, value + 1))} className="p-2.5 hover:bg-neutral-50 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={stock <= 0} className="btn-primary flex-1 btn-lg">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="btn-outline px-4">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-t border-neutral-100">
            {[
              { icon: Truck, text: 'Free shipping on INR 999+' },
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

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
              {tags.map((tag) => (
                <span key={tag} className="badge bg-neutral-100 text-neutral-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
          {[
            { key: 'details', label: 'Product Detail' },
            { key: 'features', label: 'Additional Information' },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'details' | 'features' | 'reviews')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-neutral-900">Product Detail</h3>
              <div
                className="prose prose-neutral max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-neutral-900">Additional Information</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>SKU: {sku}</li>
                <li>Vendor: {product.Vendor || 'N/A'}</li>
                <li>Category: {category}</li>
                <li>Status: {status}</li>
                <li>Stock Available: {stock}</li>
                {product['Variant Grams'] && <li>Variant Grams: {product['Variant Grams']}</li>}
                {product['Variant Weight Unit'] && <li>Variant Weight Unit: {product['Variant Weight Unit']}</li>}
                {product['Cost per item'] && <li>Cost per item: {formatCurrency(Number(product['Cost per item']))}</li>}
                {tags.length > 0 && <li>Tags: {tags.join(', ')}</li>}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-neutral-900">Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-neutral-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-neutral-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-neutral-900">{review.userName}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-neutral-800">{review.title}</p>
                      <p className="mt-1 text-sm text-neutral-600">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
