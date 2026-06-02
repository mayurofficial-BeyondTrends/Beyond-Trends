'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Package, Upload } from 'lucide-react'
import { createCategory, createProduct, getCategories, getProducts, deleteProduct } from '@/lib/services'
import {
  buildShopifyProductPayload,
  formatCurrency,
  formatDate,
  getProductCategory,
  getProductComparePrice,
  getProductImages,
  getProductPrice,
  getProductSku,
  getProductStatus,
  getProductStock,
  getProductTitle,
  isProductFeatured,
  slugify,
} from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Category, Product } from '@/types'

const STATUS_COLORS = {
  active:   'bg-green-100 text-green-700',
  draft:    'bg-yellow-100 text-yellow-700',
  archived: 'bg-neutral-100 text-neutral-600',
}

type ImportRow = Partial<Product> & Record<string, unknown>

const SHOPIFY_IMPORT_PRODUCT_FIELDS = [
  'Title',
  'Body (HTML)',
  'Vendor',
  'Standardized Product Type',
  'Custom Product Type',
  'Tags',
  'Variant SKU',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Inventory Qty',
  'Variant Barcode',
] as const

function rowHasProductData(row: ImportRow) {
  return SHOPIFY_IMPORT_PRODUCT_FIELDS.some((field) => String(row[field] || '').trim())
}

function getImportCategory(row: ImportRow) {
  return String(
    row['Standardized Product Type'] ||
    row['Custom Product Type'] ||
    row.category ||
    ''
  ).trim()
}

function addUniqueImage(images: string[], image: unknown) {
  const value = String(image || '').trim()
  if (value && !images.includes(value)) images.push(value)
}

function normalizeJsonImportRows(rows: ImportRow[]) {
  const byHandle = new Map<string, ImportRow & { images: string[] }>()
  const products: Array<ImportRow & { images: string[] }> = []

  rows.forEach((row, index) => {
    const title = String(row.Title || row.name || '').trim()
    const handle = String(row.Handle || (title ? slugify(title) : '')).trim()
    const hasImage = Boolean(String(row['Image Src'] || row['Variant Image'] || '').trim())

    if (!handle && !rowHasProductData(row) && !hasImage) return

    const key = handle || `row-${index}`
    const existing = byHandle.get(key)

    if (existing) {
      addUniqueImage(existing.images, row['Image Src'])
      addUniqueImage(existing.images, row['Variant Image'])

      if (!existing.Title && title) existing.Title = title
      return
    }

    if (!rowHasProductData(row) && hasImage) {
      return
    }

    const images: string[] = []
    addUniqueImage(images, row['Image Src'])
    addUniqueImage(images, row['Variant Image'])

    const product = {
      ...row,
      Handle: handle,
      Title: title,
      images,
    }

    byHandle.set(key, product)
    products.push(product)
  })

  return products
}

async function ensureImportCategory(
  categoryName: string,
  categories: Category[],
  createdCategories: Map<string, Category>
) {
  const name = categoryName || 'Uncategorized'
  const slug = slugify(name)
  const existing = categories.find((category) => category.slug === slug || category.name.toLowerCase() === name.toLowerCase())
  if (existing) return existing.name

  const created = createdCategories.get(slug)
  if (created) return created.name

  const category: Omit<Category, 'id'> = {
    name,
    slug,
    order: categories.length + createdCategories.size + 1,
  }

  const id = await createCategory(category)
  createdCategories.set(slug, { id, ...category })
  return name
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const load = () => {
    setLoading(true)
    getProducts().then(p => { setProducts(p); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const filtered = products.filter(p => {
    const matchSearch = getProductTitle(p).toLowerCase().includes(search.toLowerCase()) ||
      getProductSku(p).toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || getProductStatus(p) === statusFilter
    return matchSearch && matchStatus
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleJsonUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const rawText = await file.text()
      const parsed = JSON.parse(rawText)
      const rows = (Array.isArray(parsed) ? parsed : [parsed]) as ImportRow[]
      const importProducts = normalizeJsonImportRows(rows)

      if (importProducts.length === 0) {
        toast.error('JSON file is empty')
        return
      }

      const categories = await getCategories()
      const createdCategories = new Map<string, Category>()

      for (const row of importProducts) {
        const category = await ensureImportCategory(getImportCategory(row), categories, createdCategories)
        const payload = buildShopifyProductPayload({
          ...row,
          'Standardized Product Type': category,
          category,
        })

        if (!payload.Title) {
          throw new Error('Each product needs a Title field')
        }

        await createProduct(payload as any)
      }

      toast.success(`${importProducts.length} product${importProducts.length > 1 ? 's' : ''} imported`)
      load()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import JSON'
      toast.error(message)
    } finally {
      event.target.value = ''
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 text-sm">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleJsonUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="btn-outline"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : 'Upload JSON'}
          </button>
          <Link href="/admin/products/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No products found</p>
            <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex">
              <Plus className="w-4 h-4" /> Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['Product', 'SKU', 'Price', 'Stock', 'Status', 'Category', 'Updated', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map(p => {
                  const title = getProductTitle(p)
                  const images = getProductImages(p)
                  const price = getProductPrice(p)
                  const comparePrice = getProductComparePrice(p)
                  const stock = getProductStock(p)
                  const status = getProductStatus(p)
                  return (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          {images[0]
                            ? <img src={images[0]} alt={title} className="w-full h-full object-cover" />
                            : <Package className="w-5 h-5 text-neutral-300 m-auto mt-2.5" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 line-clamp-1">{title}</p>
                          {isProductFeatured(p) && <span className="text-[10px] text-brand-500 font-medium">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-neutral-600">{getProductSku(p)}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-neutral-900">{formatCurrency(price)}</p>
                      {comparePrice && (
                        <p className="text-xs text-neutral-400 line-through">{formatCurrency(comparePrice)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('text-sm font-medium', stock <= 0 ? 'text-red-500' : stock <= 5 ? 'text-orange-500' : 'text-neutral-900')}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.draft}`}>{status}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{getProductCategory(p)}</td>
                    <td className="px-5 py-4 text-xs text-neutral-500">{formatDate(p.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/products/${p.id}/edit`} className="btn-ghost p-2 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card p-6 max-w-sm w-full mx-4 animate-slide-up">
            <h3 className="font-semibold text-neutral-900 mb-2">Delete Product?</h3>
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
