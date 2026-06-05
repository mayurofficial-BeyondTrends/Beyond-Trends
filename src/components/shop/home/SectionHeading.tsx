import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.02em] text-neutral-950 sm:text-[2.35rem] lg:text-[2.75rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-6 text-neutral-600 sm:mt-3 sm:leading-7 lg:text-lg">{description}</p>
        )}
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 transition-all hover:translate-x-1 hover:text-brand-600"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
