import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  CircleHelp,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  TicketPercent,
  Truck,
  UserRound,
  WalletCards,
} from 'lucide-react'
import type { Order, OrderStatus, User } from '@/types'
import { formatCurrency } from '@/lib/utils'

export interface AccountProfile {
  name: string
  email: string
  phone: string
  imageAlt: string
  imageUrl?: string
  initials: string
}

export interface AccountStat {
  label: string
  value: string
  icon: LucideIcon
}

export interface OrderStatusItem {
  label: string
  count: string
  icon: LucideIcon
}

export interface MenuEntry {
  label: string
  icon: LucideIcon
  href?: string
  tone?: 'default' | 'danger'
}

export const accountSettings: MenuEntry[] = [
  { icon: UserRound, label: 'Personal Information', href: '/profile' },
  { icon: MapPin, label: 'Addresses', href: '/checkout' },
  { icon: CreditCard, label: 'Payment Methods', href: '/checkout' },
  { icon: TicketPercent, label: 'My Coupons', href: '/checkout' },
  { icon: Heart, label: 'My Wishlist', href: '/products' },
  { icon: Bell, label: 'Notifications', href: '/profile' },
]

export const moreOptions: MenuEntry[] = [
  { icon: Headphones, label: 'Customer Support', href: '/contact' },
  { icon: CircleHelp, label: 'Help & FAQs', href: '/contact' },
  { icon: ShoppingBag, label: 'Terms & Conditions', href: '/contact' },
  { icon: Gift, label: 'Privacy Policy', href: '/contact' },
  { icon: LogOut, label: 'Logout', tone: 'danger' },
]

const ORDER_STATUS_META: Array<{ key: OrderStatus; label: string; icon: LucideIcon }> = [
  { key: 'pending', label: 'Pending', icon: ShoppingBag },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Gift },
  { key: 'cancelled', label: 'Cancelled', icon: CircleHelp },
]

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'BT'
}

export function buildAccountProfile(
  user: Pick<User, 'displayName' | 'email' | 'photoURL' | 'phone'>
): AccountProfile {
  const name = user.displayName?.trim() || 'Beyond Trends Customer'

  return {
    name,
    email: user.email || 'No email available',
    phone: user.phone || 'Add your mobile number',
    imageAlt: `${name} profile photo`,
    imageUrl: user.photoURL,
    initials: getInitials(name),
  }
}

export function buildAccountStats(orders: Order[]): AccountStat[] {
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const couponsUsed = orders.filter((order) => order.couponCode).length

  return [
    { icon: ShoppingBag, value: String(orders.length), label: 'Orders' },
    { icon: Heart, value: String(Math.min(orders.length + 2, 99)), label: 'Wishlist' },
    { icon: TicketPercent, value: String(couponsUsed), label: 'Coupons' },
    { icon: WalletCards, value: formatCurrency(totalSpent || 0), label: 'Spent' },
  ]
}

export function buildOrderStatuses(orders: Order[]): OrderStatusItem[] {
  return ORDER_STATUS_META.map(({ key, label, icon }) => ({
    icon,
    label,
    count: String(orders.filter((order) => order.status === key).length).padStart(2, '0'),
  }))
}
