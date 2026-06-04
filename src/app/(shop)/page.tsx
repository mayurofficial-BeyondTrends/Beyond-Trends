import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield, Truck, RefreshCw, Headphones } from 'lucide-react'
import { getProducts, getCategories } from '@/lib/services'
import ProductCard from '@/components/shop/ProductCard'

export const revalidate = 60

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getProducts({ status: 'active', featured: true, lim: 8 }).catch(() => []),
    getCategories().catch(() => []),
  ])

  const allProducts = featuredProducts.length === 0
    ? await getProducts({ status: 'active', lim: 8 }).catch(() => [])
    : featuredProducts

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
            <Image
              src="/banner.png"
              alt="Beyond Trends banner"
              width={1852346}
              height={1852346}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-neutral-900 mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-square flex items-end p-4 hover:shadow-lg transition-shadow"
                >
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 w-full">
                    <p className="font-medium text-neutral-900 text-sm">{cat.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-900">
                {featuredProducts.length > 0 ? 'Featured Products' : 'Our Products'}
              </h2>
              <p className="text-neutral-500 mt-1">Handpicked just for you</p>
            </div>
            <Link href="/products" className="btn-outline hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {allProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">No products yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {allProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link href="/products" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-6 rounded-xl border border-neutral-100 hover:border-brand-200 hover:bg-brand-50/50 transition-colors">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
                  <p className="text-sm text-neutral-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Cute Finds, Trendy Picks</h2>
          <p className="text-brand-100 text-lg mb-8">For every generation and gender.</p>
          <Link href="/auth?tab=signup" className="btn bg-white text-brand-600 hover:bg-brand-50 btn-lg font-bold shadow-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
