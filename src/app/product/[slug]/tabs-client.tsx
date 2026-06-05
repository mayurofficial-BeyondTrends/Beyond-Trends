'use client'

import { useState } from 'react'
import ProductTabs from '@/components/product/ProductTabs'
import type { ProductTabKey } from '@/types/product'

interface TabsClientProps {
  tabs: Array<{ key: ProductTabKey; label: string }>
  description: React.ReactNode
  specifications: React.ReactNode
  shipping: React.ReactNode
  reviews: React.ReactNode
}

export default function ProductTabsClient({
  tabs,
  description,
  specifications,
  shipping,
  reviews,
}: TabsClientProps) {
  const [activeTab, setActiveTab] = useState<ProductTabKey>('description')

  return (
    <div className="mt-10 sm:mt-12">
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <div className="lg:border-r lg:border-neutral-200 lg:pr-6">
          <ProductTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            orientation="sidebar"
          />
        </div>

        <div className="mt-5 lg:mt-0 lg:pl-2">
          {activeTab === 'description' && description}
          {activeTab === 'specifications' && specifications}
          {activeTab === 'shipping' && shipping}
          {activeTab === 'reviews' && reviews}
        </div>
      </div>
    </div>
  )
}
