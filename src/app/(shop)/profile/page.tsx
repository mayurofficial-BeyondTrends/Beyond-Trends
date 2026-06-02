'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Package, Phone, ShoppingBag, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getOrders } from '@/lib/services'
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import type { Order } from '@/types'

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    getOrders({ userId: user.uid }).then((rows) => {
      setOrders(rows)
      setLoading(false)
    }).catch(() => {
      setOrders([])
      setLoading(false)
    })
  }, [user])

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Sign in to view profile</h2>
        <Link href="/auth" className="btn-primary btn-lg">Sign In</Link>
      </div>
    )
  }

  const latestAddress = orders.find((order) => order.shippingAddress)?.shippingAddress

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900">Profile</h1>
        <p className="text-neutral-500 text-sm mt-1">Account details and recent orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
              {user.photoURL
                ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                : <User className="w-7 h-7 text-brand-600" />
              }
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-neutral-900 truncate">{profile?.displayName || user.displayName || 'Customer'}</p>
              <p className="text-xs text-neutral-500 capitalize">{profile?.role || 'customer'}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-neutral-600">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="truncate">{profile?.email || user.email}</span>
            </div>
            {(profile?.phone || latestAddress?.phone) && (
              <div className="flex items-center gap-3 text-neutral-600">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{profile?.phone || latestAddress?.phone}</span>
              </div>
            )}
            {latestAddress && (
              <div className="flex items-start gap-3 text-neutral-600">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  {latestAddress.line1}, {latestAddress.city}, {latestAddress.state} {latestAddress.pincode}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{orders.length}</p>
              <p className="text-xs text-neutral-500">Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</p>
              <p className="text-xs text-neutral-500">Spent</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">My Orders</h2>
            <Link href="/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>

          {loading ? (
            <div className="card h-40 flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="card py-16 text-center">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 mb-5">No orders yet</p>
              <Link href="/products" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="font-mono text-sm font-bold text-neutral-900">{order.orderNumber}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className={`badge ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.productId} className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border-2 border-white">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            : <Package className="w-5 h-5 text-neutral-300 m-auto mt-2.5" />
                          }
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{order.items.map((item) => item.name).join(', ')}</p>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
