'use client'

import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import PromoBar from '@/components/shop/home/PromoBar'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoBar />
      <Navbar />
      <main className="flex-1 pt-[104px] sm:pt-[112px]">{children}</main>
      <Footer />
    </div>
  )
}
