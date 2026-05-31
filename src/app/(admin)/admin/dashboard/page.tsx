'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign } from 'lucide-react'
import { getDashboardStats } from '@/lib/services'
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import Link from 'next/link'
import type { DashboardStats } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(s => { setStats(s); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Orders',
      value: (stats?.totalOrders || 0).toLocaleString(),
      change: stats?.ordersChange || 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Customers',
      value: (stats?.totalCustomers || 0).toLocaleString(),
      change: stats?.customersChange || 0,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Products',
      value: (stats?.totalProducts || 0).toLocaleString(),
      change: 0,
      icon: Package,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ title, value, change, icon: Icon, color }) => (
          <div key={title} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(Math.round(change))}%
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mb-1">{value}</p>
            <p className="text-sm text-neutral-500">{title}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all
          </Link>
        </div>
        {(stats?.recentOrders || []).length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  {['Order', 'Customer', 'Date', 'Total', 'Status', 'Payment'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {(stats?.recentOrders || []).map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-semibold text-brand-600 hover:text-brand-700">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-neutral-900">{order.userName}</p>
                      <p className="text-xs text-neutral-500">{order.userEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-neutral-900">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/products/new', label: 'Add New Product', desc: 'Create a new product listing', icon: Package },
          { href: '/admin/orders', label: 'Manage Orders', desc: 'View and update orders', icon: ShoppingBag },
          { href: '/admin/coupons', label: 'Create Coupon', desc: 'Set up discount codes', icon: Users },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="card p-5 hover:shadow-md hover:border-brand-200 transition-all group">
            <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
              <Icon className="w-5 h-5 text-brand-600" />
            </div>
            <p className="font-semibold text-neutral-900 text-sm mb-0.5">{label}</p>
            <p className="text-xs text-neutral-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
