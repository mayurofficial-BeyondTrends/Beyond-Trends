'use client'

import { ShoppingCart } from 'lucide-react'

interface ProductActionsProps {
  onAddToCart: () => void
  onBuyNow: () => void
  disabled?: boolean
}

export default function ProductActions({ onAddToCart, onBuyNow, disabled }: ProductActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart className="h-5 w-5" /> ADD TO CART
      </button>
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white px-6 text-base font-semibold text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        BUY NOW
      </button>
    </div>
  )
}
