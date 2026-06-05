import Link from 'next/link'
import { ChevronDown, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'

const shopLinks = ['All Products', 'New Arrivals', 'Featured', 'Sale']
const helpLinks = ['My Orders', 'Track Shipment', 'Returns & Refunds', 'Size Guide', 'FAQ']

function MobileFooterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <details className="rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white">
        {title}
        <ChevronDown className="h-4 w-4 text-neutral-400 transition-transform details-open:rotate-180" />
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  )
}

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="shell-container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
          <div className="bg-white rounded-3xl p-6 shadow-sm md:col-span-1">
            <Link href="/" className="mb-4 inline-flex" aria-label="Beyond Trends home">
              <img src="/Logo.png" alt="Beyond Trends" className="h-16 w-auto max-w-[220px] object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-neutral-900">
              Cute. Trendy. For every generation and gender. Discover everyday finds with a playful, polished style.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="rounded-lg bg-neutral-950 p-2 text-white transition-colors hover:bg-brand-500">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-neutral-950 p-2 text-white transition-colors hover:bg-brand-500">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-neutral-950 p-2 text-white transition-colors hover:bg-brand-500">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <h4 className="mb-4 font-semibold text-white">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {shopLinks.map((item) => (
                <li key={item}>
                  <Link href="/products" className="transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className="mb-4 font-semibold text-white">Help</h4>
            <ul className="space-y-2.5 text-sm">
              {helpLinks.map((item) => (
                <li key={item}>
                  <Link href="/orders" className="transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className="mb-4 font-semibold text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <span>support@beyondtrends.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>123 Commerce Street,<br />Mumbai, Maharashtra 400001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          <MobileFooterSection title="Shop">
            <ul className="space-y-2.5 text-sm">
              {shopLinks.map((item) => (
                <li key={item}>
                  <Link href="/products" className="transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </MobileFooterSection>

          <MobileFooterSection title="Help">
            <ul className="space-y-2.5 text-sm">
              {helpLinks.map((item) => (
                <li key={item}>
                  <Link href="/orders" className="transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </MobileFooterSection>

          <MobileFooterSection title="Contact">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <span>support@beyondtrends.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>123 Commerce Street,<br />Mumbai, Maharashtra 400001</span>
              </li>
            </ul>
          </MobileFooterSection>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 text-center text-xs text-neutral-500 sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} Beyond Trends. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
            <Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-white">Terms of Service</Link>
            <Link href="#" className="transition-colors hover:text-white">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
