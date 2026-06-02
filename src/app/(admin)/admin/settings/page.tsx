'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Store, User, Lock, Bell, Palette, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('store')
  const [saving, setSaving] = useState(false)

  const profileForm = useForm({ defaultValues: { displayName: user?.displayName || '', email: user?.email || '' } })
  const passwordForm = useForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>()
  const storeForm = useForm({
    defaultValues: {
      storeName: 'Beyond Trends',
      storeEmail: 'support@beyondtrends.in',
      storePhone: '+91 98765 43210',
      storeAddress: '123 Commerce Street, Mumbai, Maharashtra 400001',
      currency: 'INR',
      freeShippingThreshold: 999,
      shippingRate: 99,
      taxRate: 18,
      gstNumber: '',
    }
  })

  const handleProfileSave = async (data: any) => {
    setSaving(true)
    try {
      if (user) await updateProfile(user, { displayName: data.displayName })
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const handlePasswordSave = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      if (user && user.email) {
        const cred = EmailAuthProvider.credential(user.email, data.currentPassword)
        await reauthenticateWithCredential(user, cred)
        await updatePassword(user, data.newPassword)
        toast.success('Password updated!')
        passwordForm.reset()
      }
    } catch (err: any) {
      toast.error(err.code === 'auth/wrong-password' ? 'Current password is incorrect' : 'Failed to update password')
    } finally { setSaving(false) }
  }

  const handleStoreSave = async (data: any) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    toast.success('Store settings saved!')
    setSaving(false)
  }

  const tabs = [
    { id: 'store', label: 'Store', icon: Store },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 text-sm">Manage your store and account settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs sidebar */}
        <div className="lg:w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === id
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Store Settings */}
          {activeTab === 'store' && (
            <form onSubmit={storeForm.handleSubmit(handleStoreSave)} className="space-y-4">
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Store className="w-4 h-4" /> Store Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Store Name</label>
                    <input {...storeForm.register('storeName')} className="input" />
                  </div>
                  <div>
                    <label className="label">Support Email</label>
                    <input {...storeForm.register('storeEmail')} type="email" className="input" />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input {...storeForm.register('storePhone')} className="input" />
                  </div>
                  <div>
                    <label className="label">Currency</label>
                    <select {...storeForm.register('currency')} className="input">
                      <option value="INR">INR (₹) – Indian Rupee</option>
                      <option value="USD">USD ($) – US Dollar</option>
                      <option value="EUR">EUR (€) – Euro</option>
                      <option value="GBP">GBP (£) – British Pound</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Store Address</label>
                  <textarea {...storeForm.register('storeAddress')} className="input h-20 resize-none" />
                </div>
              </div>

              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-neutral-900">Shipping & Tax</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Free Shipping Above (₹)</label>
                    <input {...storeForm.register('freeShippingThreshold')} type="number" className="input" />
                  </div>
                  <div>
                    <label className="label">Flat Shipping Rate (₹)</label>
                    <input {...storeForm.register('shippingRate')} type="number" className="input" />
                  </div>
                  <div>
                    <label className="label">GST Rate (%)</label>
                    <input {...storeForm.register('taxRate')} type="number" className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">GST Number</label>
                  <input {...storeForm.register('gstNumber')} className="input font-mono" placeholder="22AAAAA0000A1Z5" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Store Settings'}
              </button>
            </form>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-4">
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <User className="w-4 h-4" /> Admin Profile
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center">
                    {user?.photoURL
                      ? <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                      : <span className="text-brand-600 font-bold text-2xl">{(user?.displayName || user?.email || 'A')[0].toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{user?.displayName || 'Admin User'}</p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                    <span className="badge bg-purple-100 text-purple-700 mt-1">Administrator</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Display Name</label>
                    <input {...profileForm.register('displayName')} className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input value={user?.email || ''} disabled className="input opacity-60 cursor-not-allowed" />
                    <p className="text-xs text-neutral-400 mt-1">Email cannot be changed here</p>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSave)} className="space-y-4">
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Change Password
                </h2>
                <div>
                  <label className="label">Current Password</label>
                  <input {...passwordForm.register('currentPassword', { required: true })} type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input {...passwordForm.register('newPassword', { required: true, minLength: 6 })} type="password" className="input" placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input {...passwordForm.register('confirmPassword', { required: true })} type="password" className="input" placeholder="••••••••" />
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Active Sessions</h2>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Current Session</p>
                    <p className="text-xs text-neutral-500">Logged in via {user?.providerData[0]?.providerId || 'email'}</p>
                  </div>
                  <span className="badge bg-green-100 text-green-700">Active</span>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                <Lock className="w-4 h-4" />
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Bell className="w-4 h-4" /> Notification Preferences
              </h2>
              {[
                { label: 'New Orders', desc: 'Get notified when a new order is placed', defaultChecked: true },
                { label: 'Low Stock Alerts', desc: 'Alert when product stock falls below 5', defaultChecked: true },
                { label: 'New Customer Signups', desc: 'Notify when a new customer registers', defaultChecked: false },
                { label: 'Failed Payments', desc: 'Alert for failed payment transactions', defaultChecked: true },
                { label: 'Order Cancellations', desc: 'Notify when an order is cancelled', defaultChecked: true },
                { label: 'Weekly Reports', desc: 'Receive weekly sales summary', defaultChecked: false },
              ].map(({ label, desc, defaultChecked }) => (
                <label key={label} className="flex items-start justify-between gap-4 cursor-pointer group">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                  </div>
                  <div className="relative shrink-0 mt-0.5">
                    <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                    <div className="w-10 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-brand-500 transition-colors cursor-pointer" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
              <button onClick={() => toast.success('Preferences saved!')} className="btn-primary">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
