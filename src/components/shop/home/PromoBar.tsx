import { Truck } from 'lucide-react'

interface PromoBarProps {
  message?: string
}

export default function PromoBar({
  message = 'FREE SHIPPING on all orders above \u20B9499',
}: PromoBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-[70] bg-black px-4 py-2.5 text-white">
      <div className="shell-container flex items-center justify-center gap-2 px-0 text-center text-xs font-medium tracking-[0.08em] sm:text-sm">
        <Truck className="h-4 w-4 shrink-0 text-brand-400" />
        <span>{message}</span>
      </div>
    </div>
  )
}
