'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Shield, ShoppingCart, Star, Truck } from 'lucide-react'
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
    addItem({ productId: product.id, name: title, price, image: images[0] || '', quantity: 1, sku })
    toast.success(`Added ${title} to cart!`)
  }

  const handleBuyNow = () => {
    addItem({ productId: product.id, name: title, price, image: images[0] || '', quantity: 1, sku })
    router.push('/checkout')
  }

  const actionButtons = (
    <>
      <button onClick={handleAddToCart} disabled={stock <= 0} className="btn-primary flex-1 btn-lg min-h-12">
        <ShoppingCart className="w-5 h-5" /> Add to Cart
      </button>
      <button onClick={handleBuyNow} disabled={stock <= 0} className="btn-primary flex-1 btn-lg min-h-12">
        Buy Now
      </button>
    </>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-28 sm:pb-10">
      <button onClick={() => router.back()} className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 sm:mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-[4/4.5] sm:aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product['Image Alt Text'] || title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <ShoppingCart className="w-20 h-20" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
              {images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                    selectedImage === index ? 'border-brand-500' : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 sm:text-sm">{category}</p>
          <h1 className="mb-3 font-display text-[1.75rem] font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">{title}</h1>

          <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star key={index} className={`w-4 h-4 ${index <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'}`} />
              ))}
            </div>
            <span className="text-sm text-neutral-500">4.0 (24 reviews)</span>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6">
            <span className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">{formatCurrency(price)}</span>
            {comparePrice && (
              <>
                <span className="text-base text-neutral-400 line-through sm:text-lg">{formatCurrency(comparePrice)}</span>
                <span className="badge bg-green-100 text-green-700">{discount}% off</span>
              </>
            )}
          </div>

          <p className="mb-6 whitespace-pre-line text-sm leading-7 text-neutral-600 sm:mb-8 sm:text-base">{description}</p>

          <div className="mb-5 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 sm:mb-6">
            {stock > 0 ? (
              <p className="text-sm font-medium text-green-600">In Stock ({stock} available)</p>
            ) : (
              <p className="text-sm font-medium text-red-500">Out of Stock</p>
            )}
          </div>

          <div className="mb-8 hidden items-center gap-3 sm:flex">
            {actionButtons}
            <button className="btn-outline px-4 min-h-12">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-neutral-100 py-5 sm:grid-cols-2 sm:gap-4 sm:py-6">
            {[
              { icon: Truck, text: 'Free shipping on INR 999+' },
              { icon: Shield, text: '100% secure payment' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                  <Icon className="w-4 h-4 text-neutral-600" />
                </div>
                <p className="text-xs text-neutral-600">{text}</p>
              </div>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
              {tags.map((tag) => (
                <span key={tag} className="badge bg-neutral-100 text-neutral-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <div className="-mx-1 flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 sm:mx-0 sm:flex-wrap">
          {[
            { key: 'details', label: 'Product Detail' },
            { key: 'features', label: 'Additional Information' },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'details' | 'features' | 'reviews')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">Product Detail</h3>
              <div
                className="prose prose-sm sm:prose prose-neutral max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">Additional Information</h3>
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
              <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">Reviews</h3>
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

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 p-4 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button className="btn-outline h-12 w-12 shrink-0 p-0">
            <Heart className="w-5 h-5" />
          </button>
          {actionButtons}
        </div>
      </div>
    </div>
  )
}
