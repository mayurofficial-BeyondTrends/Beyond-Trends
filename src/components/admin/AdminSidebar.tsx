'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Settings, FolderTree,
  ChevronRight, LogOut, BarChart3
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products',  icon: Package,          label: 'Products'  },
  { href: '/admin/categories', icon: FolderTree,      label: 'Categories' },
  { href: '/admin/orders',    icon: ShoppingBag,      label: 'Orders'    },
  { href: '/admin/customers', icon: Users,            label: 'Customers' },
  { href: '/admin/coupons',   icon: Tag,              label: 'Coupons'   },
  { href: '/admin/settings',  icon: Settings,         label: 'Settings'  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <aside className="w-60 bg-neutral-950 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <p className="font-display font-bold text-white text-sm">Beyond Trends</p>
            <p className="text-neutral-500 text-[10px]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-brand-500 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-neutral-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mb-1"
        >
          <BarChart3 className="w-4 h-4" />
          View Store
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <div className="mt-3 px-3 py-2.5 bg-neutral-900 rounded-lg">
          <p className="text-xs font-medium text-neutral-300 truncate">{user?.displayName || 'Admin'}</p>
          <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  )
}
