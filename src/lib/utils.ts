import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Product } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function parseProductNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|ul|ol|h[1-6])>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export const emptyShopifyProduct = {
  Handle: '',
  Title: '',
  'Body (HTML)': '',
  Vendor: 'Simply Smart',
  'Standardized Product Type': '',
  'Custom Product Type': '',
  Tags: '',
  Published: 'TRUE',
  'Option1 Name': 'Title',
  'Option1 Value': 'Default Title',
  'Option2 Name': '',
  'Option2 Value': '',
  'Option3 Name': '',
  'Option3 Value': '',
  'Variant SKU': '',
  'Variant Grams': '',
  'Variant Inventory Tracker': 'shopify',
  'Variant Inventory Qty': '500',
  'Variant Inventory Policy': 'deny',
  'Variant Fulfillment Service': 'manual',
  'Variant Price': '',
  'Variant Compare At Price': '',
  'Variant Requires Shipping': 'TRUE',
  'Variant Taxable': 'TRUE',
  'Variant Barcode': '',
  'Image Src': '',
  'Image Position': '1',
  'Image Alt Text': '',
  'Gift Card': 'FALSE',
  'SEO Title': '',
  'SEO Description': '',
  'Google Shopping / Google Product Category': '',
  'Google Shopping / Gender': '',
  'Google Shopping / Age Group': '',
  'Google Shopping / MPN': '',
  'Google Shopping / AdWords Grouping': '',
  'Google Shopping / AdWords Labels': '',
  'Google Shopping / Condition': '',
  'Google Shopping / Custom Product': '',
  'Google Shopping / Custom Label 0': '',
  'Google Shopping / Custom Label 1': '',
  'Google Shopping / Custom Label 2': '',
  'Google Shopping / Custom Label 3': '',
  'Google Shopping / Custom Label 4': '',
  'Variant Image': '',
  'Variant Weight Unit': 'g',
  'Variant Tax Code': '',
  'Cost per item': '',
  Status: 'active',
} as const

type ProductImportInput = Partial<Product> & Record<string, unknown>

export function buildShopifyProductPayload(input: ProductImportInput) {
  const title = String(input.Title || input.name || '').trim()
  const handle = String(input.Handle || slugify(title)).trim()
  const bodyHtml = String(input['Body (HTML)'] || input.description || '').trim()
  const sku = String(input['Variant SKU'] || input.sku || input['Variant Barcode'] || handle).trim()
  const imageSrc = Array.isArray(input.images) && input.images.length > 0
    ? String(input.images[0] || '')
    : String(input['Image Src'] || input['Variant Image'] || '')

  const rawTags = Array.isArray(input.tags)
    ? input.tags.join(', ')
    : String(input.Tags || '')

  const normalizedStatus = String(input.Status || input.status || emptyShopifyProduct.Status).toLowerCase()

  return {
    ...emptyShopifyProduct,
    ...input,
    Handle: handle,
    Title: title,
    'Body (HTML)': bodyHtml,
    Vendor: String(input.Vendor || emptyShopifyProduct.Vendor),
    'Standardized Product Type': String(
      input['Standardized Product Type'] ||
      input['Custom Product Type'] ||
      input.category ||
      'Uncategorized'
    ),
    'Custom Product Type': String(input['Custom Product Type'] || ''),
    Tags: rawTags,
    Published: String(input.Published || emptyShopifyProduct.Published),
    'Variant SKU': sku,
    'Variant Grams': String(input['Variant Grams'] || input.stock || ''),
    'Variant Inventory Tracker': String(input['Variant Inventory Tracker'] || emptyShopifyProduct['Variant Inventory Tracker']),
    'Variant Inventory Qty': String(input['Variant Inventory Qty'] ?? input.stock ?? emptyShopifyProduct['Variant Inventory Qty']),
    'Variant Inventory Policy': String(input['Variant Inventory Policy'] || emptyShopifyProduct['Variant Inventory Policy']),
    'Variant Fulfillment Service': String(input['Variant Fulfillment Service'] || emptyShopifyProduct['Variant Fulfillment Service']),
    'Variant Price': String(input['Variant Price'] ?? input.price ?? ''),
    'Variant Compare At Price': String(input['Variant Compare At Price'] ?? input.comparePrice ?? ''),
    'Variant Requires Shipping': String(input['Variant Requires Shipping'] || emptyShopifyProduct['Variant Requires Shipping']),
    'Variant Taxable': String(input['Variant Taxable'] || emptyShopifyProduct['Variant Taxable']),
    'Variant Barcode': String(input['Variant Barcode'] || sku),
    'Image Src': imageSrc,
    'Image Position': String(input['Image Position'] || emptyShopifyProduct['Image Position']),
    'Image Alt Text': String(input['Image Alt Text'] || `${title} Beyond Trends`),
    'Gift Card': String(input['Gift Card'] || emptyShopifyProduct['Gift Card']),
    'SEO Title': String(input['SEO Title'] || ''),
    'SEO Description': String(input['SEO Description'] || ''),
    'Google Shopping / Google Product Category': String(input['Google Shopping / Google Product Category'] || ''),
    'Google Shopping / Gender': String(input['Google Shopping / Gender'] || ''),
    'Google Shopping / Age Group': String(input['Google Shopping / Age Group'] || ''),
    'Google Shopping / MPN': String(input['Google Shopping / MPN'] || ''),
    'Google Shopping / AdWords Grouping': String(input['Google Shopping / AdWords Grouping'] || ''),
    'Google Shopping / AdWords Labels': String(input['Google Shopping / AdWords Labels'] || ''),
    'Google Shopping / Condition': String(input['Google Shopping / Condition'] || ''),
    'Google Shopping / Custom Product': String(input['Google Shopping / Custom Product'] || ''),
    'Google Shopping / Custom Label 0': String(input['Google Shopping / Custom Label 0'] || ''),
    'Google Shopping / Custom Label 1': String(input['Google Shopping / Custom Label 1'] || ''),
    'Google Shopping / Custom Label 2': String(input['Google Shopping / Custom Label 2'] || ''),
    'Google Shopping / Custom Label 3': String(input['Google Shopping / Custom Label 3'] || ''),
    'Google Shopping / Custom Label 4': String(input['Google Shopping / Custom Label 4'] || ''),
    'Variant Image': String(input['Variant Image'] || ''),
    'Variant Weight Unit': String(input['Variant Weight Unit'] || emptyShopifyProduct['Variant Weight Unit']),
    'Variant Tax Code': String(input['Variant Tax Code'] || ''),
    'Cost per item': String(input['Cost per item'] || ''),
    Status: (normalizedStatus === 'active' || normalizedStatus === 'draft' || normalizedStatus === 'archived')
      ? normalizedStatus
      : 'active',
  }
}

export function getProductTitle(product: Product) {
  return product.Title || product.name || 'Untitled product'
}

export function getProductDescription(product: Product) {
  return stripHtml(product['Body (HTML)'] || product.description || '')
}

export function getProductDescriptionHtml(product: Product) {
  return product['Body (HTML)'] || product.description || ''
}

export function getProductImages(product: Product) {
  return product.images?.length
    ? product.images
    : [product['Image Src'], product['Variant Image']].filter(Boolean) as string[]
}

export function getProductPrice(product: Product) {
  return parseProductNumber(product['Variant Price'] ?? product.price)
}

export function getProductComparePrice(product: Product) {
  const value = parseProductNumber(product['Variant Compare At Price'] ?? product.comparePrice)
  return value > 0 ? value : undefined
}

export function getProductStock(product: Product) {
  return parseProductNumber(product['Variant Inventory Qty'] ?? product.stock)
}

export function getProductSku(product: Product) {
  return product['Variant SKU'] || product.sku || product['Variant Barcode'] || ''
}

export function getProductStatus(product: Product) {
  return String(product.Status || product.status || 'draft').toLowerCase()
}

export function getProductCategory(product: Product) {
  return product['Standardized Product Type'] || product['Custom Product Type'] || product.category || 'Uncategorized'
}

export function getProductTags(product: Product) {
  if (product.tags?.length) return product.tags
  return (product.Tags || '').split(',').map(tag => tag.trim()).filter(Boolean)
}

export function isProductFeatured(product: Product) {
  return Boolean(product.featured)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${ts}-${rand}`
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, length: number) {
  return text.length > length ? `${text.slice(0, length)}...` : text
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
  refunded:   'Refunded',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  refunded:   'bg-gray-100 text-gray-800',
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-800',
  paid:     'bg-green-100 text-green-800',
  failed:   'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}
