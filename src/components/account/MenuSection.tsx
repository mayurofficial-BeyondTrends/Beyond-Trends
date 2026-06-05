import type { MenuEntry } from './accountData'
import MenuItem from './MenuItem'

interface MenuSectionProps {
  title: string
  items: MenuEntry[]
  onItemSelect?: (item: MenuEntry) => void
}

export default function MenuSection({ title, items, onItemSelect }: MenuSectionProps) {
  return (
    <section className="rounded-2xl bg-white px-4 py-3 shadow-sm lg:px-6 lg:py-5">
      <h2 className="text-[16px] font-semibold leading-6 text-[#111111]">{title}</h2>

      <div className="mt-2 lg:mt-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={index === items.length - 1 ? '' : 'border-b border-[#f1f1f1]'}
          >
            <MenuItem item={item} onSelect={() => onItemSelect?.(item)} />
          </div>
        ))}
      </div>
    </section>
  )
}
