export interface Product {
  id: string
  slug: string
  title: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  colors?: string[]
  rating: number
  reviewCount: number
  stock: number
  specifications: Record<string, string>
}

export interface ProductReview {
  id: string
  userName: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt?: string
}

export interface ProductFeatureItem {
  title: string
  description: string
}

export interface ProductShippingItem {
  title: string
  body: string
}

export interface ProductVariantValue {
  label: string
  value: string
  available?: boolean
}

export interface ProductVariantGroup {
  name: string
  values: ProductVariantValue[]
}

export type ProductTabKey = 'description' | 'specifications' | 'shipping' | 'reviews'

export interface ProductTabItem {
  key: ProductTabKey
  label: string
}
