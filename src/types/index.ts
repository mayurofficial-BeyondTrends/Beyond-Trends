export interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  tags: string[]
  stock: number
  sku: string
  status: 'active' | 'draft' | 'archived'
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  order: number
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  sku: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  couponCode?: string
}

export interface Address {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  userEmail: string
  userName: string
  items: CartItem[]
  shippingAddress: Address
  billingAddress?: Address
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  notes?: string
  trackingNumber?: string
  couponCode?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  phone?: string
  role: 'customer' | 'admin'
  addresses: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userPhoto?: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: Date
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder?: number
  maxUses?: number
  usedCount: number
  expiresAt?: Date
  active: boolean
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
  customersChange: number
  recentOrders: Order[]
}
