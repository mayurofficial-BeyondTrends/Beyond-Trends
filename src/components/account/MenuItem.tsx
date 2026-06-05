import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { MenuEntry } from './accountData'

interface MenuItemProps {
  item: MenuEntry
  onSelect?: () => void
}

export default function MenuItem({ item, onSelect }: MenuItemProps) {
  const Icon = item.icon
  const toneClass = item.tone === 'danger' ? 'text-red-500' : 'text-[#111111]'
  const iconToneClass = item.tone === 'danger' ? 'text-red-500' : 'text-[#ff4f87]'
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <Icon className={`h-[16px] w-[16px] shrink-0 ${iconToneClass}`} strokeWidth={1.8} />
        <span className={`truncate text-[13px] font-medium ${toneClass}`}>{item.label}</span>
      </span>
      <ChevronRight className={`h-4 w-4 shrink-0 ${toneClass}`} strokeWidth={1.8} />
    </>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="flex h-12 w-full items-center justify-between gap-3 text-left">
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-12 w-full items-center justify-between gap-3 text-left"
    >
      {content}
    </button>
  )
}
