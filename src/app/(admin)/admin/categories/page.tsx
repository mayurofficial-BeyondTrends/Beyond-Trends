'use client'

import { useEffect, useState } from 'react'
import { Edit, FolderTree, Plus, Search, Trash2, X } from 'lucide-react'
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/services'
import { slugify } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Category } from '@/types'

interface CategoryForm {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  order: number
}

const defaultValues: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  image: '',
  parentId: '',
  order: 0,
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CategoryForm>({
    defaultValues,
  })

  const name = watch('name')
  const slug = watch('slug')

  const load = () => {
    setLoading(true)
    getCategories().then((rows) => {
      setCategories(rows)
      setLoading(false)
    }).catch(() => {
      toast.error('Failed to load categories')
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!editingCategory && name && (!slug || slug === slugify(name.slice(0, -1)))) {
      setValue('slug', slugify(name))
    }
  }, [editingCategory, name, setValue, slug])

  const filtered = categories.filter((category) => {
    const q = search.toLowerCase()
    return category.name.toLowerCase().includes(q) || category.slug.toLowerCase().includes(q)
  })

  const openCreate = () => {
    setEditingCategory(null)
    reset({
      ...defaultValues,
      order: categories.length + 1,
    })
    setShowForm(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || '',
      order: category.order ?? categories.length + 1,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    reset(defaultValues)
  }

  const onSubmit = async (data: CategoryForm) => {
    const normalizedSlug = slugify(data.slug || data.name)
    const duplicate = categories.find((category) =>
      category.id !== editingCategory?.id &&
      (category.slug === normalizedSlug || category.name.toLowerCase() === data.name.trim().toLowerCase())
    )

    if (duplicate) {
      toast.error('Category already exists')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: data.name.trim(),
        slug: normalizedSlug,
        description: data.description?.trim() || '',
        image: data.image?.trim() || '',
        parentId: data.parentId || '',
        order: Number(data.order) || 0,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload)
        toast.success('Category updated')
      } else {
        await createCategory(payload)
        toast.success('Category created')
      }

      closeForm()
      load()
    } catch {
      toast.error('Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
      toast.success('Category deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="text-neutral-500 text-sm">{categories.length} product categories</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="input pl-9"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" onClick={closeForm} className="btn-ghost p-2 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name *</label>
                  <input {...register('name', { required: 'Name is required' })} className="input" placeholder="Computer Accessories" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Slug *</label>
                  <input {...register('slug', { required: 'Slug is required' })} className="input font-mono" placeholder="computer-accessories" />
                  {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea {...register('description')} rows={3} className="input resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Image URL</label>
                  <input {...register('image')} className="input" placeholder="https://..." />
                </div>
                <div>
                  <label className="label">Order</label>
                  <input {...register('order', { min: 0, valueAsNumber: true })} type="number" className="input" />
                </div>
              </div>
              <div>
                <label className="label">Parent Category</label>
                <select {...register('parentId')} className="input">
                  <option value="">None</option>
                  {categories
                    .filter((category) => category.id !== editingCategory?.id)
                    .map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
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
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FolderTree className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['Category', 'Slug', 'Parent', 'Order', 'Actions'].map((heading) => (
                    <th key={heading} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((category) => {
                  const parent = categories.find((item) => item.id === category.parentId)

                  return (
                    <tr key={category.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center">
                            {category.image
                              ? <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                              : <FolderTree className="w-5 h-5 text-neutral-300" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{category.name}</p>
                            {category.description && <p className="text-xs text-neutral-500 line-clamp-1">{category.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-neutral-600">{category.slug}</td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{parent?.name || 'None'}</td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{category.order ?? 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => openEdit(category)} className="btn-ghost p-2 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(category.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-neutral-900 mb-2">Delete Category?</h3>
            <p className="text-sm text-neutral-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button type="button" onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
