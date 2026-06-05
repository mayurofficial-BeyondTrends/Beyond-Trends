import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import SectionHeading from './SectionHeading'

interface CategoryItem {
  title: string
  href: string
  icon: LucideIcon
  accent: string
}

interface CategoryShowcaseProps {
  categories: CategoryItem[]
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null

  return (
    <section className="premium-section px-4 py-7 sm:px-6 lg:px-8">
      <div className="shell-container px-0">
        <SectionHeading title="Shop by Category" actionLabel="View All" actionHref="/products" />

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map(({ title, href, icon: Icon, accent }) => (
            <Link
              key={title}
              href={href}
              aria-label={`Browse ${title}`}
              className="group overflow-hidden rounded-[1.35rem] bg-white p-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.07)] ring-1 ring-neutral-100 transition-all duration-300 hover:-translate-y-1 sm:rounded-[1.9rem] sm:p-3 sm:hover:-translate-y-2 sm:hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)]"
            >
              <div className={`flex aspect-square items-center justify-center rounded-[1rem] ${accent} sm:rounded-[1.35rem]`}>
                <Icon className="h-11 w-11 text-neutral-900 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14" />
              </div>
              <div className="px-1 pb-1 pt-3 text-center sm:px-2 sm:pb-2 sm:pt-4">
                <p className="text-sm font-semibold text-neutral-950 sm:text-base">{title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
