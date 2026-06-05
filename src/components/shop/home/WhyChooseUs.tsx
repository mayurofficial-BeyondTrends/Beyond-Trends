import type { LucideIcon } from 'lucide-react'
import SectionHeading from './SectionHeading'

interface WhyChooseUsItem {
  icon: LucideIcon
  value: string
  label: string
}

interface WhyChooseUsProps {
  items: WhyChooseUsItem[]
}

export default function WhyChooseUs({ items }: WhyChooseUsProps) {
  return (
    <section className="premium-section px-4 py-7 sm:px-6 lg:px-8 lg:pb-16">
      <div className="shell-container px-0">
        <SectionHeading
          title="Why Shop With Us?"
          description="A friendly shopping experience built around quality products, secure checkout, and dependable support."
        />

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-[1.5rem] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.07)] ring-1 ring-neutral-100 sm:mt-8 sm:p-4 lg:grid-cols-4 lg:rounded-[2.1rem] lg:p-6">
          {items.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-[1.1rem] border border-neutral-100 px-3 py-4 transition-transform duration-300 hover:-translate-y-1 sm:gap-4 sm:rounded-[1.6rem] sm:px-4 sm:py-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 sm:h-14 sm:w-14">
                <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-950 sm:text-2xl">{value}</p>
                <p className="text-[11px] text-neutral-500 sm:text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
