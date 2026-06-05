'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const galleryImages = useMemo(() => images.filter(Boolean), [images])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const goTo = (index: number) => {
    if (galleryImages.length === 0) return
    setSelectedIndex((index + galleryImages.length) % galleryImages.length)
  }
  const extraCount = Math.max(0, galleryImages.length - 4)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX
    const delta = endX - touchStartX

    if (Math.abs(delta) > 40) {
      if (delta < 0) goTo(selectedIndex + 1)
      else goTo(selectedIndex - 1)
    }

    setTouchStartX(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[72px_minmax(0,1fr)] lg:items-start lg:gap-5">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
        {galleryImages.slice(0, 5).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`relative h-[86px] w-[66px] shrink-0 overflow-hidden rounded-xl border bg-white transition-all lg:h-[104px] lg:w-[72px] ${
              selectedIndex === index ? 'border-brand-500' : 'border-[#f0e5df] hover:border-neutral-300'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image src={image} alt="" width={80} height={80} className="h-full w-full object-cover" />
            {index === 4 && extraCount > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-xl font-semibold text-white">
                +{extraCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        className="order-1 relative overflow-hidden rounded-2xl bg-[#f7ebe4] lg:order-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {galleryImages.length > 0 ? (
          <>
            <div className="group relative aspect-[4/4.5] sm:aspect-square lg:aspect-[0.93]">
              <Image
                src={galleryImages[selectedIndex] ?? galleryImages[0]}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
            </div>

            <div className="absolute left-4 top-4 rounded-lg bg-brand-500 px-3 py-2 text-lg font-semibold leading-none text-white">
              -42%
            </div>
            <button
              type="button"
              aria-label="Expand image"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(selectedIndex - 1)}
                  className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md transition hover:bg-white lg:flex"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(selectedIndex + 1)}
                  className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md transition hover:bg-white lg:flex"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex aspect-[4/4.5] items-center justify-center bg-neutral-100 px-6 text-center text-sm text-neutral-500 sm:aspect-square">
            No product images available yet.
          </div>
        )}
      </div>
    </div>
  )
}
