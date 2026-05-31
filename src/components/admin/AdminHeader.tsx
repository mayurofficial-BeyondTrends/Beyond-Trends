'use client'

import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Bell className="w-5 h-5 text-neutral-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          {user?.photoURL ? (
            <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="avatar" />
          ) : (
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-600 font-bold text-sm">
                {(user?.displayName || user?.email || 'A')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">{user?.displayName || 'Admin'}</p>
            <p className="text-xs text-neutral-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
