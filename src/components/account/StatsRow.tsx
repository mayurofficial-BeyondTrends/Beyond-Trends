import type { AccountStat } from './accountData'

interface StatsRowProps {
  items: AccountStat[]
}

export default function StatsRow({ items }: StatsRowProps) {
  return (
    <div className="grid grid-cols-4 divide-x divide-[#f1f1f1] border-t border-[#f1f1f1] pt-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex flex-col items-center px-1 text-center lg:px-2">
          <Icon className="h-[18px] w-[18px] text-[#ff4f87]" strokeWidth={1.8} />
          <p className="mt-2 text-[13px] font-semibold leading-none text-[#111111]">{value}</p>
          <p className="mt-1 text-[9px] leading-none text-[#7b7b7b]">{label}</p>
        </div>
      ))}
    </div>
  )
}
