'use client'

import { useEffect, useState } from 'react'
import { Search, Users, Shield, ShieldOff } from 'lucide-react'
import { getUsers, setUserRole } from '@/lib/services'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { User } from '@/types'

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getUsers().then(u => { setUsers(u); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const filtered = users.filter(u =>
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    setUpdatingId(user.id)
    try {
      await setUserRole(user.id, newRole)
      toast.success(`User is now ${newRole}`)
      load()
    } catch {
      toast.error('Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Customers</h1>
        <p className="text-neutral-500 text-sm">{users.length} registered users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="input pl-9" />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['Customer', 'Email', 'Role', 'Joined', 'Addresses', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden shrink-0">
                          {user.photoURL
                            ? <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                            : <span className="text-brand-600 font-bold text-sm">{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                          }
                        </div>
                        <p className="text-sm font-medium text-neutral-900">{user.displayName || 'No name'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-500">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{user.addresses?.length || 0}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleRole(user)}
                        disabled={updatingId === user.id}
                        className="btn-outline btn-sm gap-1.5"
                        title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      >
                        {user.role === 'admin'
                          ? <><ShieldOff className="w-3.5 h-3.5" /> Revoke Admin</>
                          : <><Shield className="w-3.5 h-3.5" /> Make Admin</>
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
