'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react'
import { createProduct, getCategories, getProduct, updateProduct, uploadImage } from '@/lib/services'
import {
  buildShopifyProductPayload,
  cn,
  emptyShopifyProduct,
  getProductCategory,
  getProductComparePrice,
  getProductDescriptionHtml,
  getProductImages,
  getProductPrice,
  getProductSku,
  getProductStatus,
  getProductStock,
  getProductTags,
  getProductTitle,
  slugify,
} from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Category } from '@/types'

interface ProductFormData {
  Handle: string
  Title: string
  'Body (HTML)': string
  Vendor: string
  'Standardized Product Type': string
  'Custom Product Type': string
  Tags: string
  Published: string
  'Option1 Name': string
  'Option1 Value': string
  'Option2 Name': string
  'Option2 Value': string
  'Option3 Name': string
  'Option3 Value': string
  'Variant SKU': string
  'Variant Grams': string
  'Variant Inventory Tracker': string
  'Variant Inventory Qty': string
  'Variant Inventory Policy': string
  'Variant Fulfillment Service': string
  'Variant Price': string
  'Variant Compare At Price': string
  'Variant Requires Shipping': string
  'Variant Taxable': string
  'Variant Barcode': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'Gift Card': string
  'SEO Title': string
  'SEO Description': string
  'Google Shopping / Google Product Category': string
  'Google Shopping / Gender': string
  'Google Shopping / Age Group': string
  'Google Shopping / MPN': string
  'Google Shopping / AdWords Grouping': string
  'Google Shopping / AdWords Labels': string
  'Google Shopping / Condition': string
  'Google Shopping / Custom Product': string
  'Google Shopping / Custom Label 0': string
  'Google Shopping / Custom Label 1': string
  'Google Shopping / Custom Label 2': string
  'Google Shopping / Custom Label 3': string
  'Google Shopping / Custom Label 4': string
  'Variant Image': string
  'Variant Weight Unit': string
  'Variant Tax Code': string
  'Cost per item': string
  Status: 'active' | 'draft' | 'archived'
}

const statusOptions = ['draft', 'active', 'archived'] as const
const truthyOptions = ['TRUE', 'FALSE'] as const

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const isEdit = !!productId

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: emptyShopifyProduct as ProductFormData,
  })

  useEffect(() => {
    getCategories().then(setCategories)

    if (productId && productId !== 'new') {
      getProduct(productId).then((product) => {
        if (!product) return

        const productImages = getProductImages(product)
        reset({
          ...emptyShopifyProduct,
          ...product,
          Handle: product.Handle || slugify(getProductTitle(product)),
          Title: getProductTitle(product),
          'Body (HTML)': getProductDescriptionHtml(product),
          'Standardized Product Type': getProductCategory(product),
          Tags: product.Tags || getProductTags(product).join(', '),
          'Variant SKU': getProductSku(product),
          'Variant Price': String(getProductPrice(product) || ''),
          'Variant Compare At Price': String(getProductComparePrice(product) || ''),
          'Variant Inventory Qty': String(getProductStock(product)),
          'Variant Barcode': product['Variant Barcode'] || getProductSku(product),
          'Image Src': productImages[0] || '',
          'Image Alt Text': product['Image Alt Text'] || getProductTitle(product),
          Status: getProductStatus(product) as ProductFormData['Status'],
        })
        setImages(productImages)
      })
    }
  }, [productId, reset])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setUploading(true)
    try {
      const urls = await Promise.all(
        files.map((file) => uploadImage(file, `products/${Date.now()}-${file.name}`))
      )
      setImages((prev) => [...prev, ...urls])
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
      const payload = buildShopifyProductPayload({
        ...data,
        'Image Src': images[0] || data['Image Src'].trim(),
      })

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
          <p className="text-neutral-500 text-sm">Add products in the Shopify CSV field format.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Basic Information</h2>
            <div>
              <label className="label">Title *</label>
              <input {...register('Title', { required: 'Title is required' })} className="input" placeholder="6187 Keyboard Cover for Computer Pc for Desktop Computer" />
              {errors.Title && <p className="text-xs text-red-500 mt-1">{errors.Title.message}</p>}
            </div>
            <div>
              <label className="label">Handle</label>
              <input {...register('Handle')} className="input font-mono" placeholder="6187-keyboard-cover-for-computer-pc-for-desktop-computer" />
              <p className="text-xs text-neutral-400 mt-1">Leave empty to generate from the title.</p>
            </div>
            <div>
              <label className="label">Body (HTML) *</label>
              <textarea {...register('Body (HTML)', { required: 'Body HTML is required' })} rows={9} className="input resize-none font-mono text-sm" placeholder="<div><strong>Product title</strong></div>..." />
              {errors['Body (HTML)'] && <p className="text-xs text-red-500 mt-1">{errors['Body (HTML)'].message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Vendor</label>
                <input {...register('Vendor')} className="input" placeholder="Simply Smart" />
              </div>
              <div>
                <label className="label">Tags</label>
                <input {...register('Tags')} className="input" placeholder="Computer Accessories" />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Variant Price *</label>
                <input {...register('Variant Price', { required: true, min: 0 })} type="number" className="input" placeholder="40" />
                {errors['Variant Price'] && <p className="text-xs text-red-500 mt-1">Valid price required</p>}
              </div>
              <div>
                <label className="label">Variant Compare At Price</label>
                <input {...register('Variant Compare At Price', { min: 0 })} type="number" className="input" placeholder="199" />
              </div>
              <div>
                <label className="label">Cost per item</label>
                <input {...register('Cost per item', { min: 0 })} type="number" className="input" placeholder="20" />
              </div>
              <div>
                <label className="label">Variant Weight Unit</label>
                <select {...register('Variant Weight Unit')} className="input">
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Images</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={img} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                  {index === 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5">Image Src</span>}
                </div>
              ))}
              <label className={cn(
                'aspect-square rounded-xl border-2 border-dashed border-neutral-200 hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2',
                uploading && 'opacity-50 cursor-wait'
              )}>
                {uploading ? <Loader2 className="w-6 h-6 text-brand-400 animate-spin" /> : <Upload className="w-6 h-6 text-neutral-400" />}
                <span className="text-xs text-neutral-500">{uploading ? 'Uploading...' : 'Upload'}</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <div>
              <label className="label">Image Src</label>
              <input {...register('Image Src')} className="input" placeholder="https://cdn.shopify.com/..." />
              <p className="text-xs text-neutral-400 mt-1">Uploaded first image is saved here automatically.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Image Position</label>
                <input {...register('Image Position')} className="input" placeholder="1" />
              </div>
              <div>
                <label className="label">Variant Image</label>
                <input {...register('Variant Image')} className="input" />
              </div>
              <div>
                <label className="label">Image Alt Text</label>
                <input {...register('Image Alt Text')} className="input" />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">SEO and Google Shopping</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">SEO Title</label>
                <input {...register('SEO Title')} className="input" />
              </div>
              <div>
                <label className="label">SEO Description</label>
                <input {...register('SEO Description')} className="input" />
              </div>
              <div>
                <label className="label">Google Product Category</label>
                <input {...register('Google Shopping / Google Product Category')} className="input" />
              </div>
              <div>
                <label className="label">Google Gender</label>
                <input {...register('Google Shopping / Gender')} className="input" />
              </div>
              <div>
                <label className="label">Google Age Group</label>
                <input {...register('Google Shopping / Age Group')} className="input" />
              </div>
              <div>
                <label className="label">Google MPN</label>
                <input {...register('Google Shopping / MPN')} className="input" />
              </div>
              <div>
                <label className="label">Google Condition</label>
                <input {...register('Google Shopping / Condition')} className="input" />
              </div>
              <div>
                <label className="label">Google Custom Product</label>
                <input {...register('Google Shopping / Custom Product')} className="input" />
              </div>
              <div>
                <label className="label">AdWords Grouping</label>
                <input {...register('Google Shopping / AdWords Grouping')} className="input" />
              </div>
              <div>
                <label className="label">AdWords Labels</label>
                <input {...register('Google Shopping / AdWords Labels')} className="input" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((number) => (
                <div key={number}>
                  <label className="label">Custom Label {number}</label>
                  <input {...register(`Google Shopping / Custom Label ${number}` as keyof ProductFormData)} className="input" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Status</h2>
            <div>
              <label className="label">Status</label>
              <select {...register('Status')} className="input">
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Published</label>
              <select {...register('Published')} className="input">
                {truthyOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Gift Card</label>
              <select {...register('Gift Card')} className="input">
                {truthyOptions.slice().reverse().map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Organization</h2>
            <div>
              <label className="label">Standardized Product Type *</label>
              <select {...register('Standardized Product Type', { required: 'Product type is required' })} className="input">
                <option value="">Select category...</option>
                {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                <option value="Uncategorized">Uncategorized</option>
              </select>
              {errors['Standardized Product Type'] && <p className="text-xs text-red-500 mt-1">{errors['Standardized Product Type'].message}</p>}
            </div>
            <div>
              <label className="label">Custom Product Type</label>
              <input {...register('Custom Product Type')} className="input" />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Options</h2>
            {(['1', '2', '3'] as const).map((number) => (
              <div key={number} className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Option{number} Name</label>
                  <input {...register(`Option${number} Name` as keyof ProductFormData)} className="input" />
                </div>
                <div>
                  <label className="label">Option{number} Value</label>
                  <input {...register(`Option${number} Value` as keyof ProductFormData)} className="input" />
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Inventory</h2>
            <div>
              <label className="label">Variant SKU *</label>
              <input {...register('Variant SKU', { required: 'SKU is required' })} className="input font-mono" placeholder="6187_laptop_keyboard_cover" />
              {errors['Variant SKU'] && <p className="text-xs text-red-500 mt-1">{errors['Variant SKU'].message}</p>}
            </div>
            <div>
              <label className="label">Variant Barcode</label>
              <input {...register('Variant Barcode')} className="input font-mono" />
            </div>
            <div>
              <label className="label">Variant Inventory Qty *</label>
              <input {...register('Variant Inventory Qty', { required: true, min: 0 })} type="number" className="input" placeholder="500" />
              {errors['Variant Inventory Qty'] && <p className="text-xs text-red-500 mt-1">Valid stock quantity required</p>}
            </div>
            <div>
              <label className="label">Variant Grams</label>
              <input {...register('Variant Grams')} type="number" className="input" placeholder="327" />
            </div>
            <div>
              <label className="label">Variant Inventory Tracker</label>
              <input {...register('Variant Inventory Tracker')} className="input" />
            </div>
            <div>
              <label className="label">Variant Inventory Policy</label>
              <select {...register('Variant Inventory Policy')} className="input">
                <option value="deny">deny</option>
                <option value="continue">continue</option>
              </select>
            </div>
            <div>
              <label className="label">Variant Fulfillment Service</label>
              <input {...register('Variant Fulfillment Service')} className="input" />
            </div>
            <div>
              <label className="label">Variant Requires Shipping</label>
              <select {...register('Variant Requires Shipping')} className="input">
                {truthyOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Variant Taxable</label>
              <select {...register('Variant Taxable')} className="input">
                {truthyOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Variant Tax Code</label>
              <input {...register('Variant Tax Code')} className="input" />
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
