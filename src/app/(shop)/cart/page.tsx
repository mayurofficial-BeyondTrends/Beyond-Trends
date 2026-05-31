'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { getCouponByCode } from '@/lib/services'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total, discount, couponCode, applyCoupon, removeCoupon, clearCart } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const sub = subtotal()
  const tot = total()
  const shipping = sub >= 999 ? 0 : 99

  const applyCouponCode = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const coupon = await getCouponByCode(couponInput.trim())
      if (!coupon || !coupon.active) {
        toast.error('Invalid or expired coupon code')
        return
      }
      if (coupon.minOrder && sub < coupon.minOrder) {
        toast.error(`Minimum order of ${formatCurrency(coupon.minOrder)} required`)
        return
      }
      const disc = coupon.type === 'percentage' ? (sub * coupon.value) / 100 : coupon.value
      applyCoupon(coupon.code, disc)
      toast.success(`Coupon applied! You saved ${formatCurrency(disc)}`)
    } catch {
      toast.error('Failed to apply coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-neutral-300" />
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/products" className="btn-primary btn-lg">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="card p-4 flex gap-4 animate-fade-in">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-neutral-300"><ShoppingCart className="w-6 h-6" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-900 text-sm truncate">{item.name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">SKU: {item.sku}</p>
                <p className="font-bold text-neutral-900 mt-1">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 border border-neutral-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 hover:bg-neutral-50">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 hover:bg-neutral-50">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-4">
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Coupon Code
            </h3>
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-green-700">{couponCode} applied!</span>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-600">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="input"
                  onKeyDown={e => e.key === 'Enter' && applyCouponCode()}
                />
                <button onClick={applyCouponCode} disabled={couponLoading} className="btn-outline whitespace-nowrap">
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card p-4 space-y-3">
            <h3 className="font-semibold text-neutral-900">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatCurrency(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatCurrency(shipping)}</span>
              </div>
              {sub < 999 && (
                <p className="text-xs text-neutral-400">Add {formatCurrency(999 - sub)} more for free shipping</p>
              )}
              <div className="border-t border-neutral-100 pt-2 flex justify-between font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatCurrency(tot + shipping)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full btn-lg mt-2">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/products" className="btn-outline w-full text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
