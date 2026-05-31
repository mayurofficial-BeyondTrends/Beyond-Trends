'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getOrders } from '@/lib/services'
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import type { Order } from '@/types'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getOrders({ userId: user.uid }).then(o => {
      setOrders(o)
      setLoading(false)
    })
  }, [user])

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Sign in to view orders</h2>
        <Link href="/auth" className="btn-primary btn-lg">Sign In</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-neutral-300" />
          </div>
          <h2 className="font-semibold text-neutral-900 mb-2">No orders yet</h2>
          <p className="text-neutral-500 mb-8">When you place orders, they'll appear here.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-sm font-bold text-neutral-900">{order.orderNumber}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className={`badge ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {order.items.map(item => (
                  <div key={item.productId} className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatCurrency(order.total)}
                </p>
                <button className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
