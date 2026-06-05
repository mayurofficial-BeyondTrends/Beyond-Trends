import { Pencil } from 'lucide-react'
import type { AccountProfile, AccountStat } from './accountData'
import StatsRow from './StatsRow'

interface ProfileCardProps {
  profile: AccountProfile
  stats: AccountStat[]
  subtitle?: string
}

export default function ProfileCard({
  profile,
  stats,
  subtitle = 'Manage your account details',
}: ProfileCardProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm lg:min-h-[218px] lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ffe1eb] text-[18px] font-semibold text-[#ff4f87]">
            {profile.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.imageUrl} alt={profile.imageAlt} className="h-full w-full object-cover" />
            ) : (
              <span>{profile.initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[16px] font-semibold leading-5 text-[#111111]">{profile.name}</h1>
            <p className="mt-1 truncate text-[11px] leading-4 text-[#888888]">{profile.email}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#888888]">{profile.phone}</p>
            <p className="mt-1 text-[11px] leading-4 text-[#b17d8f] lg:hidden">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Edit profile"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffe6ef] text-[#ff4f87]"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-5 hidden lg:block">
        <p className="text-[12px] leading-5 text-[#888888]">{subtitle}</p>
      </div>

      <div className="mt-5">
        <StatsRow items={stats} />
      </div>
    </section>
  )
}
