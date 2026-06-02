import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, serverTimestamp,
  Timestamp, DocumentSnapshot
} from 'firebase/firestore/lite'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'
import { getProductCategory, getProductStatus, isProductFeatured, slugify } from '@/lib/utils'
import type { Product, Order, User, Category, Coupon, Review } from '@/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

const toDate = (v: any) => v instanceof Timestamp ? v.toDate() : new Date(v ?? Date.now())

const fromDoc = <T>(snap: DocumentSnapshot): T & { id: string } => {
  const data = snap.data() || {}
  return {
    ...data,
    id: snap.id,
    createdAt: toDate((data as any).createdAt),
    updatedAt: toDate((data as any).updatedAt),
  } as unknown as T & { id: string }
}

const matchesCategory = (product: Product, category: string) => {
  const productCategory = getProductCategory(product)
  return productCategory === category || slugify(productCategory) === category
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(opts: {
  category?: string; status?: string; featured?: boolean; lim?: number
} = {}) {
  const col = collection(db, 'products')
  try {
    const snap = await getDocs(query(col, orderBy('createdAt', 'desc')))
    let rows = snap.docs.map((d) => fromDoc<Product>(d))
    if (opts.category) rows = rows.filter((p) => matchesCategory(p, opts.category!))
    if (opts.status) rows = rows.filter((p) => getProductStatus(p) === opts.status)
    if (opts.featured) rows = rows.filter((p) => isProductFeatured(p))
    if (opts.lim) rows = rows.slice(0, opts.lim)
    return rows
  } catch (err) {
    const snap = await getDocs(col)
    let rows = snap.docs.map((d) => fromDoc<Product>(d))
    if (opts.category) rows = rows.filter((p) => matchesCategory(p, opts.category!))
    if (opts.status) rows = rows.filter((p) => getProductStatus(p) === opts.status)
    if (opts.featured) rows = rows.filter((p) => isProductFeatured(p))
    rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    if (opts.lim) rows = rows.slice(0, opts.lim)
    return rows
  }
}

export async function getProduct(id: string) {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null
  return fromDoc<Product>(snap)
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id))
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  try {
    const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category))
  } catch {
    const snap = await getDocs(collection(db, 'categories'))
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Category))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
}

export async function createCategory(data: Omit<Category, 'id'>) {
  const ref = await addDoc(collection(db, 'categories'), data)
  return ref.id
}

export async function updateCategory(id: string, data: Partial<Category>) {
  await updateDoc(doc(db, 'categories', id), data)
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, 'categories', id))
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getOrders(opts: { userId?: string; status?: string; lim?: number } = {}) {
  const constraints: any[] = [orderBy('createdAt', 'desc')]
  if (opts.userId) constraints.push(where('userId', '==', opts.userId))
  if (opts.status) constraints.push(where('status', '==', opts.status))
  if (opts.lim)    constraints.push(limit(opts.lim))
  const snap = await getDocs(query(collection(db, 'orders'), ...constraints))
  return snap.docs.map(d => fromDoc<Order>(d))
}

export async function getOrder(id: string) {
  const snap = await getDoc(doc(db, 'orders', id))
  if (!snap.exists()) return null
  return fromDoc<Order>(snap)
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  // Customers can create orders, but product stock updates are admin-only in rules.
  // Keep checkout reliable by writing the order document only.
  const ref = await addDoc(collection(db, 'orders'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateOrder(id: string, data: Partial<Order>) {
  await updateDoc(doc(db, 'orders', id), { ...data, updatedAt: serverTimestamp() })
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUsers(lim = 50) {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(lim)))
  return snap.docs.map(d => fromDoc<User>(d))
}

export async function getUser(id: string) {
  const snap = await getDoc(doc(db, 'users', id))
  if (!snap.exists()) return null
  return fromDoc<User>(snap)
}

export async function upsertUser(id: string, data: Partial<User>) {
  const ref = doc(db, 'users', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  } else {
    await setDoc(ref, {
      ...data,
      role: 'customer',
      addresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export async function setUserRole(id: string, role: 'admin' | 'customer') {
  await updateDoc(doc(db, 'users', id), { role, updatedAt: serverTimestamp() })
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getReviews(productId: string) {
  const snap = await getDocs(
    query(collection(db, 'reviews'), where('productId', '==', productId), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => fromDoc<Review>(d))
}

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'reviews'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function deleteReview(id: string) {
  await deleteDoc(doc(db, 'reviews', id))
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export async function getCoupons() {
  const snap = await getDocs(collection(db, 'coupons'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon))
}

export async function getCouponByCode(code: string) {
  const snap = await getDocs(query(collection(db, 'coupons'), where('code', '==', code.toUpperCase())))
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'usedCount'>) {
  const ref = await addDoc(collection(db, 'coupons'), { ...data, usedCount: 0 })
  return ref.id
}

export async function updateCoupon(id: string, data: Partial<Coupon>) {
  await updateDoc(doc(db, 'coupons', id), data)
}

export async function deleteCoupon(id: string) {
  await deleteDoc(doc(db, 'coupons', id))
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  const snap = await uploadBytes(storageRef, file)
  return getDownloadURL(snap.ref)
}

export async function deleteImage(url: string) {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (e) { /* ignore */ }
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'products')),
  ])

  const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const thisMonthOrders = orders.filter(o => toDate(o.createdAt) >= monthStart)
  const prevMonthOrders = orders.filter(o => {
    const d = toDate(o.createdAt)
    return d >= prevMonthStart && d < monthStart
  })

  const totalRevenue  = orders.reduce((s, o) => s + (o.total || 0), 0)
  const prevRevenue   = prevMonthOrders.reduce((s, o) => s + (o.total || 0), 0)
  const thisRevenue   = thisMonthOrders.reduce((s, o) => s + (o.total || 0), 0)

  const recentOrders = orders
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .slice(0, 5)
    .map(o => ({ ...o, createdAt: toDate(o.createdAt), updatedAt: toDate(o.updatedAt) })) as Order[]

  return {
    totalRevenue,
    totalOrders:     orders.length,
    totalCustomers:  usersSnap.size,
    totalProducts:   productsSnap.size,
    revenueChange:   prevRevenue ? ((thisRevenue - prevRevenue) / prevRevenue) * 100 : 0,
    ordersChange:    prevMonthOrders.length
      ? ((thisMonthOrders.length - prevMonthOrders.length) / prevMonthOrders.length) * 100 : 0,
    customersChange: 0,
    recentOrders,
  }
}
