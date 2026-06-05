'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import MenuSection from './MenuSection'
import OrdersSection from './OrdersSection'
import ProfileCard from './ProfileCard'
import {
  accountSettings,
  buildAccountProfile,
  buildAccountStats,
  buildOrderStatuses,
  moreOptions,
  type MenuEntry,
} from './accountData'
import { useAuth } from '@/context/AuthContext'
import { getOrders } from '@/lib/services'
import type { Order } from '@/types'

export default function AccountPageClient() {
  const { user, profile, loading: authLoading, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadOrders() {
      if (!user) {
        setOrders([])
        setOrdersLoading(false)
        return
      }

      setOrdersLoading(true)

      try {
        const rows = await getOrders({ userId: user.uid })
        if (!ignore) setOrders(rows)
      } catch {
        if (!ignore) setOrders([])
      } finally {
        if (!ignore) setOrdersLoading(false)
      }
    }

    void loadOrders()

    return () => {
      ignore = true
    }
  }, [user])

  const accountProfile = useMemo(
    () => buildAccountProfile({
      displayName: profile?.displayName || user?.displayName || '',
      email: profile?.email || user?.email || '',
      photoURL: profile?.photoURL || user?.photoURL || undefined,
      phone: profile?.phone || user?.phoneNumber || undefined,
    }),
    [profile, user]
  )

  const accountStats = useMemo(() => buildAccountStats(orders), [orders])
  const orderStatuses = useMemo(() => buildOrderStatuses(orders), [orders])

  const handleMoreOptionSelect = async (item: MenuEntry) => {
    if (item.label !== 'Logout') return
    await logout()
  }

  if (authLoading) {
    return (
      <div className="min-h-full bg-[#f6f6f6] py-4 sm:py-5 lg:py-10 xl:py-12">
        <div className="mx-auto grid w-full max-w-[1120px] gap-4 px-3 sm:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.36fr)] lg:gap-7 xl:gap-8">
          <div className="space-y-4">
            <div className="h-[176px] animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-[356px] animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
          <div className="space-y-4">
            <div className="h-[124px] animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-[292px] animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-full bg-[#f6f6f6] py-8 sm:py-10">
        <div className="mx-auto max-w-[420px] px-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe6ef] text-[#ff4f87]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-[#111111]">Sign in to view your profile</h1>
            <p className="mt-2 text-sm leading-6 text-[#777777]">
              Access your orders, wishlist, coupons, and account settings in one place.
            </p>
            <Link href="/auth" className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#ff4f87] px-5 text-sm font-semibold text-white">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#f6f6f6] py-4 sm:py-5 lg:py-10 xl:py-12">
      <div className="mx-auto grid w-full max-w-[1120px] gap-4 px-3 sm:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.36fr)] lg:items-start lg:gap-7 xl:gap-8">
        <div className="order-1 space-y-4 lg:order-1 lg:space-y-6">
          <ProfileCard
            profile={accountProfile}
            stats={accountStats}
            subtitle="Track your orders, update details, and manage your account."
          />
        </div>

        <div className="order-2 space-y-4 lg:order-2 lg:space-y-6">
          <OrdersSection
            title="My Orders"
            ctaLabel={ordersLoading ? 'Loading Orders' : 'View All Orders'}
            items={orderStatuses}
          />
        </div>

        <div className="order-3 space-y-4 lg:order-3 lg:space-y-6">
          <MenuSection title="Account Settings" items={accountSettings} />
        </div>

        <div className="order-4 space-y-4 lg:order-4 lg:space-y-6">
          <MenuSection
            title="More Options"
            items={moreOptions}
            onItemSelect={handleMoreOptionSelect}
          />
        </div>
      </div>
    </div>
  )
}
