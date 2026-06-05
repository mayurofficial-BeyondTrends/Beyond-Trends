import Link from 'next/link'
import { BadgePercent } from 'lucide-react'

export default function OfferBanner() {
  return (
    <section className="premium-section px-4 py-7 sm:px-6 lg:px-8">
      <div className="shell-container px-0">
        <div className="grid items-center gap-4 rounded-[1.5rem] bg-[linear-gradient(135deg,#fff7fb_0%,#ffe4f0_55%,#ffd8ea_100%)] px-4 py-5 shadow-[0_24px_60px_rgba(236,72,153,0.16)] sm:px-8 sm:py-7 lg:grid-cols-[auto_1fr_auto] lg:rounded-[2.1rem] lg:gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/60 text-brand-500 ring-1 ring-white/70 sm:h-20 sm:w-20">
            <BadgePercent className="h-7 w-7 sm:h-10 sm:w-10" />
          </div>

          <div>
            <p className="text-xs font-medium text-neutral-500 sm:text-sm">Special Offer</p>
            <h3 className="mt-1 text-xl font-bold text-neutral-950 sm:text-2xl">Get 10% Off On Your First Order</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Use Code:
              <span className="ml-2 rounded-full bg-white px-3 py-1 font-semibold text-brand-500 ring-1 ring-brand-100 shadow-sm">
                WELCOME10
              </span>
            </p>
          </div>

          <Link href="/products" className="btn-primary min-h-11 w-full rounded-[1rem] px-6 shadow-lg shadow-brand-500/20 sm:w-auto sm:min-h-12 sm:rounded-2xl sm:px-8">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}
