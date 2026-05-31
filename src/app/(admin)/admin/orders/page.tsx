'use client'

import { useEffect, useState } from 'react'
import { Search, ShoppingBag, ChevronDown } from 'lucide-react'
import { getOrders, updateOrder } from '@/lib/services'
import { formatCurrency, formatDateTime, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Order, OrderStatus } from '@/types'

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getOrders().then(o => { setOrders(o); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const filtered = orders.filter(o => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.userName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      await updateOrder(orderId, { status })
      toast.success('Order status updated!')
      load()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null)
      }
    } catch {
      toast.error('Failed to update order')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="text-neutral-500 text-sm">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-auto">
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm font-bold text-brand-600">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-neutral-900">{order.userName}</p>
                      <p className="text-xs text-neutral-500">{order.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-neutral-500 whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{order.items.length} items</td>
                    <td className="px-5 py-4 text-sm font-bold text-neutral-900">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-brand-500 cursor-pointer ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ALL_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelectedOrder(order)} className="btn-outline btn-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 font-mono">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-neutral-500">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-ghost p-2 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Customer</h4>
                <p className="text-sm text-neutral-700">{selectedOrder.userName}</p>
                <p className="text-sm text-neutral-500">{selectedOrder.userEmail}</p>
              </div>

              {/* Shipping */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Shipping Address</h4>
                <div className="text-sm text-neutral-600 space-y-0.5">
                  <p className="font-medium text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.line1}</p>
                  {selectedOrder.shippingAddress.line2 && <p>{selectedOrder.shippingAddress.line2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p className="text-brand-600">{selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                        <p className="text-xs text-neutral-500">×{item.quantity} · {formatCurrency(item.price)} each</p>
                      </div>
                      <p className="text-sm font-bold text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-neutral-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600"><span>Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
                {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(selectedOrder.discount)}</span></div>}
                <div className="flex justify-between text-neutral-600"><span>Shipping</span><span>{formatCurrency(selectedOrder.shipping)}</span></div>
                <div className="flex justify-between text-neutral-600"><span>Tax</span><span>{formatCurrency(selectedOrder.tax)}</span></div>
                <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span><span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                      className={`badge cursor-pointer hover:opacity-80 transition-opacity ${
                        selectedOrder.status === s ? ORDER_STATUS_COLORS[s] : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
