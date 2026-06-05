import type { LucideIcon } from 'lucide-react'

interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureHighlightsProps {
  items: FeatureItem[]
}

export default function FeatureHighlights({ items }: FeatureHighlightsProps) {
  return (
    <section className="premium-section px-4 py-7 sm:px-6 lg:px-8">
      <div className="shell-container grid grid-cols-2 gap-3 px-0 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-[1.35rem] bg-white px-3 py-4 text-center shadow-[0_14px_36px_rgba(15,23,42,0.06)] ring-1 ring-neutral-100 transition-transform duration-300 hover:-translate-y-1 sm:rounded-[1.85rem] sm:px-5 sm:py-6"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 sm:h-16 sm:w-16">
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-neutral-950 sm:mt-4 sm:text-lg">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm sm:leading-6">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
