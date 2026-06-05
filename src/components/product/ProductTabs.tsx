'use client'

import type { ProductTabKey } from '@/types/product'

interface TabItem {
  key: ProductTabKey
  label: string
}

interface ProductTabsProps {
  tabs: TabItem[]
  activeTab: ProductTabKey
  onChange: (tab: ProductTabKey) => void
  orientation?: 'inline' | 'sidebar'
}

export default function ProductTabs({
  tabs,
  activeTab,
  onChange,
  orientation = 'inline',
}: ProductTabsProps) {
  const isSidebar = orientation === 'sidebar'

  return (
    <div
      className={
        isSidebar
          ? '-mx-1 flex gap-2 overflow-x-auto pb-2 sm:mx-0 lg:grid lg:gap-2 lg:overflow-visible'
          : '-mx-1 flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 sm:mx-0 sm:flex-wrap'
      }
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`shrink-0 text-sm font-medium transition-colors ${
            isSidebar
              ? activeTab === tab.key
                ? 'border-l-2 border-brand-500 bg-white px-4 py-4 text-brand-500 lg:text-left'
                : 'border-l-2 border-transparent bg-white px-4 py-4 text-neutral-700 hover:bg-neutral-50 lg:text-left'
              : activeTab === tab.key
                ? 'rounded-full bg-neutral-900 px-4 py-2 text-white sm:px-5'
                : 'rounded-full border border-neutral-200 px-4 py-2 text-neutral-700 hover:bg-neutral-50 sm:px-5'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
