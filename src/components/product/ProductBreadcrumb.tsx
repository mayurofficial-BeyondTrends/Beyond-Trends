import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ProductBreadcrumbProps {
  homeLabel?: string
  category: string
  title: string
}

export default function ProductBreadcrumb({
  homeLabel = 'Home',
  category,
  title,
}: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-neutral-500 sm:mb-8">
      <Link href="/" className="transition-colors hover:text-neutral-900">{homeLabel}</Link>
      <ChevronRight className="h-4 w-4 text-neutral-300" />
      <Link href={`/products?category=${category.toLowerCase().replace(/\s+/g, '-')}`} className="transition-colors hover:text-neutral-900">
        {category}
      </Link>
      <ChevronRight className="h-4 w-4 text-neutral-300" />
      <span className="max-w-[240px] truncate text-neutral-900">{title}</span>
    </nav>
  )
}
