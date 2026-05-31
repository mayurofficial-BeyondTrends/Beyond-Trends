'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Plus, X, Upload, ArrowLeft, Loader2 } from 'lucide-react'
import { createProduct, updateProduct, getProduct, getCategories, uploadImage } from '@/lib/services'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product, Category } from '@/types'

interface ProductFormData {
  name: string; description: string; price: number; comparePrice?: number
  category: string; sku: string; stock: number; status: 'active' | 'draft' | 'archived'
  featured: boolean; tags: string
}

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const isEdit = !!productId

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: { status: 'draft', featured: false, stock: 0 }
  })

  useEffect(() => {
    getCategories().then(setCategories)
    if (productId && productId !== 'new') {
      getProduct(productId).then(p => {
        if (!p) return
        reset({
          name: p.name, description: p.description, price: p.price,
          comparePrice: p.comparePrice, category: p.category, sku: p.sku,
          stock: p.stock, status: p.status, featured: p.featured,
          tags: p.tags.join(', '),
        })
        setImages(p.images)
      })
    }
  }, [productId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(
        files.map(f => uploadImage(f, `products/${Date.now()}-${f.name}`))
      )
      setImages(prev => [...prev, ...urls])
      toast.success('Images uploaded!')
    } catch {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true)
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
        category: data.category,
        sku: data.sku,
        stock: Number(data.stock),
        status: data.status,
        featured: data.featured,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        images,
      }
      if (isEdit) {
        await updateProduct(productId, payload)
        toast.success('Product updated!')
      } else {
        await createProduct(payload as any)
        toast.success('Product created!')
      }
      router.push('/admin/products')
    } catch {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="btn-ghost p-2 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-neutral-500 text-sm">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Basic Information</h2>
            <div>
              <label className="label">Product Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="e.g. Premium Leather Wallet" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea {...register('description', { required: 'Description is required' })} rows={5} className="input resize-none" placeholder="Describe the product in detail..." />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="label">Tags</label>
              <input {...register('tags')} className="input" placeholder="leather, wallet, premium (comma separated)" />
              <p className="text-xs text-neutral-400 mt-1">Separate tags with commas</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Selling Price (₹) *</label>
                <input {...register('price', { required: true, min: 0 })} type="number" className="input" placeholder="999" />
                {errors.price && <p className="text-xs text-red-500 mt-1">Valid price required</p>}
              </div>
              <div>
                <label className="label">Compare Price (₹)</label>
                <input {...register('comparePrice', { min: 0 })} type="number" className="input" placeholder="1499 (shows strikethrough)" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Images</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                  {i === 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5">Main</span>}
                </div>
              ))}
              <label className={cn(
                'aspect-square rounded-xl border-2 border-dashed border-neutral-200 hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2',
                uploading && 'opacity-50 cursor-wait'
              )}>
                {uploading ? <Loader2 className="w-6 h-6 text-brand-400 animate-spin" /> : <Upload className="w-6 h-6 text-neutral-400" />}
                <span className="text-xs text-neutral-500">{uploading ? 'Uploading...' : 'Add Image'}</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-xs text-neutral-400">First image is the main product image. Max 10 images.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Status</h2>
            <div>
              <label className="label">Product Status</label>
              <select {...register('status')} className="input">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input {...register('featured')} type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Featured Product</p>
                <p className="text-xs text-neutral-500">Show on homepage</p>
              </div>
            </label>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Organization</h2>
            <div>
              <label className="label">Category *</label>
              <select {...register('category', { required: 'Category is required' })} className="input">
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                <option value="Uncategorized">Uncategorized</option>
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="label">SKU *</label>
              <input {...register('sku', { required: 'SKU is required' })} className="input font-mono" placeholder="PROD-001" />
              {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Inventory</h2>
            <div>
              <label className="label">Stock Quantity *</label>
              <input {...register('stock', { required: true, min: 0 })} type="number" className="input" placeholder="0" />
              {errors.stock && <p className="text-xs text-red-500 mt-1">Valid stock quantity required</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={saving} className="btn-primary w-full btn-lg">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-outline w-full">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
