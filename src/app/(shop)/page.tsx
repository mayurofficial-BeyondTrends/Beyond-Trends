import { Gift, Headphones, Package, RefreshCw, Shield, Sparkles, Truck, Users, Watch } from 'lucide-react'
import Testimonials from '@/components/home/Testimonials'
import { getProducts } from '@/lib/services'
import CategoryShowcase from '@/components/shop/home/CategoryShowcase'
import FeatureHighlights from '@/components/shop/home/FeatureHighlights'
import HomeHero from '@/components/shop/home/HomeHero'
import OfferBanner from '@/components/shop/home/OfferBanner'
import ProductShowcase from '@/components/shop/home/ProductShowcase'
import WhyChooseUs from '@/components/shop/home/WhyChooseUs'

export const revalidate = 60

export default async function HomePage() {
  const featuredProducts = await getProducts({ status: 'active', featured: true, lim: 8 }).catch(() => [])
  const latestProducts = featuredProducts.length === 0
    ? await getProducts({ status: 'active', lim: 8 }).catch(() => [])
    : featuredProducts

  const slides = [
    {
      id: 'slide-1',
      imageSrc: '/banner.png',
      imageAlt: 'Beyond Trends hero banner one',
    },
    {
      id: 'slide-2',
      imageSrc: '/banner2.png',
      imageAlt: 'Beyond Trends hero banner two',
    },
    {
      id: 'slide-3',
      imageSrc: '/banner3.png',
      imageAlt: 'Beyond Trends hero banner three',
    },
  ]

  const featureItems = [
    { icon: Truck, title: 'Free Shipping', description: 'On all orders above \u20B9499' },
    { icon: Shield, title: 'Secure Payment', description: '100% protected checkout' },
    { icon: Sparkles, title: 'Premium Quality', description: 'Best products and finishes' },
    { icon: RefreshCw, title: 'Easy Returns', description: 'Simple and quick support' },
  ]

  const categoryItems = [
    { title: 'Electronics', href: '/products?q=electronics', icon: Headphones, accent: 'bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)]' },
    { title: 'Watches', href: '/products?q=watches', icon: Watch, accent: 'bg-[linear-gradient(135deg,#fff7ed_0%,#ffe4d6_100%)]' },
    { title: 'Gifts', href: '/products?q=gifts', icon: Gift, accent: 'bg-[linear-gradient(135deg,#fff1f2_0%,#ffe4ec_100%)]' },
    { title: 'Beauty', href: '/products?q=beauty', icon: Sparkles, accent: 'bg-[linear-gradient(135deg,#fdf4ff_0%,#fae8ff_100%)]' },
  ]

  const trustItems = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Package, value: '5000+', label: 'Products' },
    { icon: Shield, value: '100%', label: 'Secure Checkout' },
    { icon: Headphones, value: '24/7', label: 'Support' },
  ]

  return (
    <div className="bg-[#fffdfd] pb-8">
      <HomeHero slides={slides} />
      <FeatureHighlights items={featureItems} />
      <CategoryShowcase categories={categoryItems} />
      <ProductShowcase
        title="Trending Products"
        description="Top picks across categories, chosen for style, usefulness, and gifting appeal."
        products={latestProducts}
      />
      <OfferBanner />
      <WhyChooseUs items={trustItems} />
      <Testimonials />
    </div>
  )
}
