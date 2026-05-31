import Link from 'next/link'
import { ArrowRight, Shield, Truck, RefreshCw, Headphones, Star } from 'lucide-react'
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
      <section className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-300 text-sm mb-6">
              <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
              Premium Quality Products
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Discover <span className="text-brand-400">Extraordinary</span> Products
            </h1>
            <p className="text-neutral-300 text-lg leading-relaxed mb-8 max-w-lg">
              Curated collections of premium products delivered right to your doorstep. Shop with confidence, style, and ease.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary btn-lg">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/products?featured=true" className="btn border border-white/20 text-white hover:bg-white/10 btn-lg">
                View Featured
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" /> Secure Payments
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-400" /> Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-brand-400" /> Easy Returns
              </div>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-brand-100 text-lg mb-8">Join thousands of happy customers today.</p>
          <Link href="/auth?tab=signup" className="btn bg-white text-brand-600 hover:bg-brand-50 btn-lg font-bold shadow-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
