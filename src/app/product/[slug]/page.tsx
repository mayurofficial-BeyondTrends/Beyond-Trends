import { notFound } from 'next/navigation'
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb'
import ProductDescription from '@/components/product/ProductDescription'
import ProductFeatures from '@/components/product/ProductFeatures'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductReviews from '@/components/product/ProductReviews'
import ProductShipping from '@/components/product/ProductShipping'
import ProductSpecifications from '@/components/product/ProductSpecifications'
import RelatedProducts from '@/components/product/RelatedProducts'
import { getProducts, getReviews } from '@/lib/services'
import {
  formatDate,
  getProductCategory,
  getProductComparePrice,
  getProductDescription,
  getProductDescriptionHtml,
  getProductImages,
  getProductPrice,
  getProductSku,
  getProductStatus,
  getProductTags,
  getProductTitle,
  parseProductNumber,
  slugify,
} from '@/lib/utils'
import type { Product as CatalogProduct, Review as CatalogReview } from '@/types'
import type {
  Product,
  ProductFeatureItem,
  ProductReview,
  ProductShippingItem,
  ProductTabItem,
  ProductVariantGroup,
} from '@/types/product'
import ProductTabsClient from './tabs-client'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

const DEFAULT_FEATURES: ProductFeatureItem[] = [
  { title: 'Free Shipping', description: 'Fast doorstep delivery on eligible orders across India.' },
  { title: 'Easy Returns', description: 'Simple return support for eligible items and orders.' },
  { title: 'Secure Checkout', description: 'Protected payment flow with trusted checkout handling.' },
  { title: 'Cash On Delivery', description: 'Pay when your order arrives on supported locations.' },
]

const DEFAULT_SHIPPING_ITEMS: ProductShippingItem[] = [
  {
    title: 'Delivery Time',
    body: 'Orders are usually packed within 24 hours and delivered in 3 to 7 business days.',
  },
  {
    title: 'Return Policy',
    body: 'Unused items in original condition are eligible for easy return support within 7 days.',
  },
  {
    title: 'Refund Policy',
    body: 'Approved refunds are processed to the original payment method after quality inspection.',
  },
]

function getOptionPairs(product: CatalogProduct) {
  return [
    { name: product['Option1 Name'], value: product['Option1 Value'] },
    { name: product['Option2 Name'], value: product['Option2 Value'] },
    { name: product['Option3 Name'], value: product['Option3 Value'] },
  ]
}

function isMeaningfulOptionValue(value?: string) {
  return Boolean(value && value.trim() && value.trim().toLowerCase() !== 'default title')
}

function uniqueStrings(values: Array<string | undefined | null>) {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  )
}

function buildVariants(product: CatalogProduct): ProductVariantGroup[] {
  return getOptionPairs(product)
    .filter((option) => option.name && isMeaningfulOptionValue(option.value))
    .map((option) => ({
      name: option.name!.trim(),
      values: uniqueStrings([option.value]).map((value) => ({
        label: value,
        value,
        available: parseProductNumber(product['Variant Inventory Qty'] ?? product.stock, 0) > 0,
      })),
    }))
    .filter((group) => group.values.length > 0)
}

function inferColors(product: CatalogProduct, variants: ProductVariantGroup[]) {
  const variantColors = variants
    .filter((group) => group.name.toLowerCase().includes('color') || group.name.toLowerCase().includes('colour'))
    .flatMap((group) => group.values.map((value) => value.label))

  const tagColors = getProductTags(product).filter((tag) =>
    ['black', 'white', 'pink', 'blue', 'red', 'green', 'yellow', 'gold', 'silver', 'brown', 'beige'].includes(
      tag.toLowerCase()
    )
  )

  return uniqueStrings([...variantColors, ...tagColors])
}

function buildSpecifications(product: CatalogProduct, stock: number, category: string) {
  const tags = getProductTags(product)
  const weight = product['Variant Grams']
    ? `${product['Variant Grams']}${product['Variant Weight Unit'] ? ` ${product['Variant Weight Unit']}` : ' g'}`
    : ''

  const specs: Record<string, string> = {}

  const entries: Array<[string, string | undefined]> = [
    ['SKU', getProductSku(product) || undefined],
    ['Vendor', product.Vendor || undefined],
    ['Category', category],
    ['Availability', stock > 0 ? `${stock} in stock` : 'Out of stock'],
    ['Status', getProductStatus(product)],
    ['Weight', weight || undefined],
    ['Tags', tags.length > 0 ? tags.join(', ') : undefined],
  ]

  entries.forEach(([label, value]) => {
    if (value && value.trim()) specs[label] = value.trim()
  })

  return specs
}

function normalizeReviews(reviews: CatalogReview[]): ProductReview[] {
  return reviews.map((review) => ({
    id: review.id,
    userName: review.userName,
    rating: review.rating,
    title: review.title,
    body: review.body,
    verified: review.verified,
    createdAt: formatDate(review.createdAt),
  }))
}

function normalizeProduct(product: CatalogProduct, reviews: ProductReview[]): Product {
  const title = getProductTitle(product)
  const category = getProductCategory(product)
  const images = uniqueStrings(getProductImages(product))
  const price = getProductPrice(product)
  const comparePrice = getProductComparePrice(product)
  const stock = Math.max(0, parseProductNumber(product['Variant Inventory Qty'] ?? product.stock, 0))
  const variants = buildVariants(product)
  const colors = inferColors(product, variants)
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0

  return {
    id: product.id,
    slug: product.Handle ? slugify(product.Handle) : slugify(title),
    title,
    description: getProductDescription(product),
    price,
    comparePrice,
    images,
    category,
    colors: colors.length > 0 ? colors : undefined,
    rating: averageRating,
    reviewCount: reviews.length,
    stock,
    specifications: buildSpecifications(product, stock, category),
  }
}

function mapRelatedProducts(products: CatalogProduct[], currentProductId: string) {
  return products.filter((product) => product.id !== currentProductId)
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params
  const products = await getProducts({ status: 'active' }).catch(() => [])

  const currentProduct = products.find((item) => {
    const titleSlug = slugify(getProductTitle(item))
    const handleSlug = item.Handle ? slugify(item.Handle) : ''
    return item.id === slug || titleSlug === slug || handleSlug === slug
  })

  if (!currentProduct) notFound()

  const rawReviews = await getReviews(currentProduct.id).catch(() => [])
  const reviews = normalizeReviews(rawReviews)
  const product = normalizeProduct(currentProduct, reviews)
  const descriptionHtml = getProductDescriptionHtml(currentProduct)
  const variants = buildVariants(currentProduct)
  const relatedProducts = mapRelatedProducts(
    products.filter((item) => getProductCategory(item) === product.category),
    currentProduct.id
  )
    .slice(0, 4)
    .map((item) => normalizeProduct(item, []))

  const tabs: ProductTabItem[] = [
    { key: 'description', label: 'Description' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'shipping', label: 'Shipping & Returns' },
    { key: 'reviews', label: `Reviews (${product.reviewCount})` },
  ]

  return (
    <div className="shell-container py-6 sm:py-8 lg:py-10">
      <ProductBreadcrumb category={product.category} title={product.title} />

      <section className="rounded-[2.25rem] border border-neutral-200 bg-[#fffdfb] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:items-start lg:gap-8">
          <ProductGallery images={product.images} title={product.title} />
          <ProductInfo
            product={product}
            reviews={reviews}
            variants={variants}
            featureHighlights={DEFAULT_FEATURES.slice(0, 2)}
          />
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6">
          <ProductFeatures items={DEFAULT_FEATURES} />
        </div>
      </section>

      <ProductTabsClient
        tabs={tabs}
        description={<ProductDescription html={descriptionHtml || product.description} />}
        specifications={<ProductSpecifications items={product.specifications} />}
        shipping={<ProductShipping items={DEFAULT_SHIPPING_ITEMS} />}
        reviews={<ProductReviews reviews={reviews} />}
      />

      <div className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  )
}
