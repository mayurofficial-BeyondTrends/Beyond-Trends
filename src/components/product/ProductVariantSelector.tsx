'use client'

import { useEffect, useState } from 'react'
import type { ProductVariantGroup } from '@/types/product'

interface ProductVariantSelectorProps {
  options: ProductVariantGroup[]
  onChange?: (selected: Record<string, string>) => void
}

export default function ProductVariantSelector({ options, onChange }: ProductVariantSelectorProps) {
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(options.map((option) => [option.name, option.values[0]?.value || '']))
  )

  useEffect(() => {
    onChange?.(selected)
  }, [onChange, selected])

  if (options.length === 0) return null

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name}>
          <p className="mb-3 text-sm font-semibold text-neutral-900">{option.name}: <span className="font-medium text-neutral-700">{selected[option.name]}</span></p>
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const isActive = selected[option.name] === value.value
              const isColorOption = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour')

              return (
                <button
                  key={value.value}
                  type="button"
                  disabled={value.available === false}
                  onClick={() => setSelected((current) => ({ ...current, [option.name]: value.value }))}
                  className={`transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isColorOption
                      ? `relative h-9 w-9 rounded-full border ${
                          isActive ? 'border-brand-500 ring-2 ring-brand-200' : 'border-neutral-200'
                        }`
                      : `rounded-full border px-4 py-2 text-sm font-medium ${
                          isActive
                            ? 'border-brand-500 bg-brand-50 text-brand-600'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                        }`
                  }`}
                  aria-label={`${option.name} ${value.label}`}
                >
                  {isColorOption ? (
                    <span
                      className="absolute inset-[4px] rounded-full border border-black/5"
                      style={{ backgroundColor: value.value.toLowerCase() }}
                    />
                  ) : (
                    value.label
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
