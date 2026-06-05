import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { OrderStatusItem } from './accountData'

interface OrdersSectionProps {
  title: string
  ctaLabel: string
  items: OrderStatusItem[]
  ctaHref?: string
}

export default function OrdersSection({
  title,
  ctaLabel,
  items,
  ctaHref = '/orders',
}: OrdersSectionProps) {
  return (
    <section className="rounded-2xl bg-white px-4 py-3 shadow-sm lg:min-h-[218px] lg:px-6 lg:py-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold leading-6 text-[#111111]">{title}</h2>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#ff4f87]"
        >
          {ctaLabel}
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-1 lg:mt-7 lg:gap-3">
        {items.map(({ icon: Icon, label, count }) => (
          <div key={label} className="flex flex-col items-center rounded-xl px-1 py-2 text-center transition-colors hover:bg-[#fff7fa] lg:px-2 lg:py-3">
            <Icon className="h-[18px] w-[18px] text-[#111111]" strokeWidth={1.8} />
            <p className="mt-2 text-[9px] leading-3 text-[#111111]">{label}</p>
            <p className="mt-2 text-[11px] font-medium leading-none text-[#6f6f6f]">{count}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
