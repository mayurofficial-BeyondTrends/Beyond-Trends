'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createOrder } from '@/lib/services'
import { generateOrderNumber, formatCurrency } from '@/lib/utils'
import { MapPin, CreditCard, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import type { Address } from '@/types'

type FormData = Address & { paymentMethod: string; notes?: string }

export default function CheckoutPage() {
  const { user, profile } = useAuth()
  const { items, subtotal, total, discount, couponCode, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address')
  const [orderId, setOrderId] = useState('')

  const sub = subtotal()
  const disc = discount
  const tot = total()
  const shipping = sub >= 999 ? 0 : 99
  const tax = Math.round(tot * 0.18)
  const grandTotal = tot + shipping + tax

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      fullName: profile?.displayName || '',
      phone: profile?.phone || '',
      country: 'India',
    }
  })

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Sign in to Checkout</h2>
        <p className="text-neutral-500 mb-8">Please sign in to complete your purchase.</p>
        <Link href="/auth" className="btn-primary btn-lg">Sign In</Link>
      </div>
    )
  }

  if (items.length === 0 && step !== 'success') {
    router.push('/cart')
    return null
  }

  const onSubmit = async (data: FormData) => {
    if (step === 'address') { setStep('payment'); return }

    setLoading(true)
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: Number(item.price) || 0,
        image: item.image || '',
        quantity: Number(item.quantity) || 1,
        sku: item.sku || '',
      }))

      const id = await createOrder({
        orderNumber: generateOrderNumber(),
        userId: user.uid,
        userEmail: user.email || profile?.email || '',
        userName: profile?.displayName || user.displayName || user.email || 'Customer',
        items: orderItems,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          line1: data.line1,
          line2: data.line2 || '',
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
        },
        subtotal: sub,
        discount: disc,
        shipping,
        tax,
        total: grandTotal,
        status: 'pending',
        paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        couponCode,
      })
      setOrderId(id)
      clearCart()
      setStep('success')
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error('Order placement failed:', err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-neutral-900 mb-3">Order Placed!</h2>
        <p className="text-neutral-500 mb-2">Thank you for your order.</p>
        <p className="text-sm text-neutral-400 mb-8">We'll send you updates via email.</p>
        <div className="flex flex-col gap-3">
          <Link href="/orders" className="btn-primary btn-lg">View My Orders</Link>
          <Link href="/products" className="btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {[
          { key: 'address', label: 'Shipping', icon: MapPin },
          { key: 'payment', label: 'Payment', icon: CreditCard },
        ].map(({ key, label, icon: Icon }, i) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              step === key ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-500'
            }`}>
              <Icon className="w-4 h-4" />
              {label}
            </div>
            {i < 1 && <div className="w-8 h-px bg-neutral-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
            {step === 'address' && (
              <>
                <h2 className="font-semibold text-neutral-900 text-lg mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input {...register('fullName', { required: 'Required' })} className="input" placeholder="John Doe" />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone *</label>
                    <input {...register('phone', { required: 'Required' })} className="input" placeholder="+91 98765 43210" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Address Line 1 *</label>
                  <input {...register('line1', { required: 'Required' })} className="input" placeholder="House/Flat no., Street" />
                  {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
                </div>
                <div>
                  <label className="label">Address Line 2</label>
                  <input {...register('line2')} className="input" placeholder="Landmark, Area (optional)" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input {...register('city', { required: 'Required' })} className="input" placeholder="Mumbai" />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="label">State *</label>
                    <input {...register('state', { required: 'Required' })} className="input" placeholder="Maharashtra" />
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="label">Pincode *</label>
                    <input {...register('pincode', { required: 'Required' })} className="input" placeholder="400001" />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Order Notes</label>
                  <textarea {...register('notes')} className="input h-20 resize-none" placeholder="Any special instructions..." />
                </div>
              </>
            )}

            {step === 'payment' && (
              <>
                <h2 className="font-semibold text-neutral-900 text-lg mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', label: 'UPI Payment', desc: 'Pay via Google Pay, PhonePe, etc.' },
                    { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { value: 'netbanking', label: 'Net Banking', desc: 'Pay via your bank' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/50 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                      <input {...register('paymentMethod', { required: true })} type="radio" value={opt.value} className="mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">{opt.label}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-xs text-red-500">Please select a payment method</p>}
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 'payment' && (
                <button type="button" onClick={() => setStep('address')} className="btn-outline">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Placing order...' : step === 'address' ? 'Continue to Payment' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="card p-4 h-fit space-y-3">
          <h3 className="font-semibold text-neutral-900">Order Summary</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-900 truncate">{item.name}</p>
                  <p className="text-xs text-neutral-500">×{item.quantity}</p>
                </div>
                <p className="text-xs font-bold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600"><span>Subtotal</span><span>{formatCurrency(sub)}</span></div>
            {disc > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(disc)}</span></div>}
            <div className="flex justify-between text-neutral-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
            <div className="flex justify-between text-neutral-600"><span>GST (18%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-100">
              <span>Total</span><span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
