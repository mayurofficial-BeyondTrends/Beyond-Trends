'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, User, Menu, X, Package } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const { itemCount } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? itemCount() : 0

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/products?featured=true', label: 'Featured' },
  ]

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-9 z-[60] w-full transition-all duration-300',
        scrolled ? 'bg-white/96 shadow-md backdrop-blur-md' : 'bg-white shadow-sm'
      )}
    >
      <div className="shell-container">
        <div className="flex h-[62px] items-center justify-between gap-2 sm:h-[72px]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center group" aria-label="Beyond Trends home">
              <Image
                src="/Logo.png"
                alt="Beyond Trends"
                width={220}
                height={70}
                priority
                className="h-10 w-auto max-w-[138px] object-contain transition-opacity group-hover:opacity-85 sm:h-14 sm:max-w-[210px]"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/products?q=${searchQuery}`)
                      setSearchOpen(false)
                      setSearchQuery('')
                    }
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                  placeholder="Search products..."
                  className="w-32 rounded-2xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:w-52"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 sm:h-11 sm:w-11"
                aria-label="Open search"
              >
                <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </button>
            )}

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 sm:h-11 sm:w-11"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              {mounted && count > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 sm:h-11 sm:w-11"
                aria-label="Open account menu"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} className="h-5 w-5 rounded-full sm:h-6 sm:w-6" alt="avatar" />
                ) : (
                  <User className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 rounded-2xl border border-neutral-200 bg-white py-1 shadow-lg animate-fade-in">
                  {user ? (
                    <>
                      <div className="border-b border-neutral-100 px-4 py-3">
                        <p className="truncate text-sm font-medium text-neutral-900">{user.displayName || user.email}</p>
                        <p className="truncate text-xs text-neutral-500">{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50">
                          <span className="w-10 text-left text-xs font-semibold uppercase tracking-[0.08em]">Admin</span>
                          Panel
                        </Link>
                      )}
                      <div className="mt-1 border-t border-neutral-100">
                        <button onClick={() => { logout(); setUserMenuOpen(false) }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/auth" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                        Sign In
                      </Link>
                      <Link href="/auth?tab=signup" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50">
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="animate-slide-up border-t border-neutral-100 py-4">
            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                    pathname === link.href ? 'bg-brand-50 text-brand-600' : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {(mobileOpen || userMenuOpen) && (
        <button
          type="button"
          aria-label="Close overlay"
          onClick={() => { setMobileOpen(false); setUserMenuOpen(false) }}
          className="fixed inset-0 top-[104px] z-40 cursor-default bg-transparent sm:top-[112px]"
        />
      )}
    </header>
  )
}
