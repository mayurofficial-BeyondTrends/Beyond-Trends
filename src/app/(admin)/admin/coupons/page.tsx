'use client'

import { useEffect, useState } from 'react'
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { getCoupons, createCoupon, deleteCoupon, updateCoupon } from '@/lib/services'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Coupon } from '@/types'

interface CouponForm {
  code: string; type: 'percentage' | 'fixed'; value: number; minOrder?: number; maxUses?: number
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponForm>({
    defaultValues: { type: 'percentage' }
  })

  const load = () => {
    setLoading(true)
    getCoupons().then(c => { setCoupons(c); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data: CouponForm) => {
    setSaving(true)
    try {
      await createCoupon({
        code: data.code.toUpperCase(),
        type: data.type,
        value: Number(data.value),
        minOrder: data.minOrder ? Number(data.minOrder) : undefined,
        maxUses: data.maxUses ? Number(data.maxUses) : undefined,
        active: true,
      })
      toast.success('Coupon created!')
      setShowForm(false)
      reset()
      load()
    } catch {
      toast.error('Failed to create coupon')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id)
      toast.success('Coupon deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const toggleActive = async (coupon: Coupon) => {
    try {
      await updateCoupon(coupon.id, { active: !coupon.active })
      toast.success(`Coupon ${coupon.active ? 'disabled' : 'enabled'}`)
      load()
    } catch {
      toast.error('Failed to update coupon')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Coupons</h1>
          <p className="text-neutral-500 text-sm">{coupons.length} coupon codes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-md animate-slide-up">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900">Create Coupon</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="label">Coupon Code *</label>
                <input {...register('code', { required: 'Code required' })} className="input font-mono uppercase" placeholder="SAVE20" />
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Discount Type *</label>
                  <select {...register('type')} className="input">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Value *</label>
                  <input {...register('value', { required: true, min: 1 })} type="number" className="input" placeholder="20" />
                  {errors.value && <p className="text-xs text-red-500 mt-1">Value required</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Order (₹)</label>
                  <input {...register('minOrder', { min: 0 })} type="number" className="input" placeholder="Optional" />
                </div>
                <div>
                  <label className="label">Max Uses</label>
                  <input {...register('maxUses', { min: 1 })} type="number" className="input" placeholder="Unlimited" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); reset() }} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['Code', 'Type', 'Value', 'Min Order', 'Max Uses', 'Used', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm font-bold text-neutral-900">{coupon.code}</td>
                    <td className="px-5 py-4 text-sm text-neutral-600 capitalize">{coupon.type}</td>
                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {coupon.minOrder ? formatCurrency(coupon.minOrder) : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{coupon.maxUses || '∞'}</td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{coupon.usedCount}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(coupon)} className="flex items-center gap-1.5 text-sm">
                        {coupon.active
                          ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Active</span></>
                          : <><ToggleLeft className="w-5 h-5 text-neutral-400" /><span className="text-neutral-500">Disabled</span></>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setDeleteId(coupon.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-neutral-900 mb-2">Delete Coupon?</h3>
            <p className="text-sm text-neutral-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
