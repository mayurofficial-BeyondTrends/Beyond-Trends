'use client'

import { Minus, Plus } from 'lucide-react'

interface ProductQuantitySelectorProps {
  quantity: number
  max: number
  onChange: (quantity: number) => void
}

export default function ProductQuantitySelector({
  quantity,
  max,
  onChange,
}: ProductQuantitySelectorProps) {
  return (
    <div className="flex h-12 w-fit items-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
        className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-neutral-50"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex h-12 min-w-12 items-center justify-center border-x border-neutral-200 px-4 text-sm font-semibold">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
