'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface TestimonialItem {
  name: string
  rating: number
  review: string
  product: string
  avatar: string
}

const testimonials: TestimonialItem[] = [
  {
    name: 'Priya S.',
    rating: 5,
    review: 'Amazing quality and fast delivery. Totally worth it.',
    product: 'Custom Mug',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="%23fde7f3"/><circle cx="80" cy="64" r="28" fill="%23f9a8d4"/><path d="M40 132c8-24 28-36 40-36s32 12 40 36" fill="%23ec4899"/><text x="80" y="150" text-anchor="middle" font-size="0">Priya</text></svg>',
  },
  {
    name: 'Rahul K.',
    rating: 5,
    review: 'The personalized gift exceeded my expectations.',
    product: 'Photo Frame',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="%23eef2ff"/><circle cx="80" cy="62" r="28" fill="%2393c5fd"/><path d="M42 132c10-24 28-34 38-34 14 0 31 11 38 34" fill="%233b82f6"/></svg>',
  },
  {
    name: 'Sneha P.',
    rating: 5,
    review: 'Beautiful packaging and premium quality.',
    product: 'Tote Bag',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="%23fdf2f8"/><circle cx="80" cy="63" r="28" fill="%23f9a8d4"/><path d="M42 132c10-22 27-34 38-34 15 0 31 11 38 34" fill="%23db2777"/></svg>',
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const current = testimonials[activeIndex]
  const stars = useMemo(() => Array.from({ length: current.rating }), [current.rating])

  const goTo = (index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }

  const goNext = () => goTo(activeIndex + 1)
  const goPrev = () => goTo(activeIndex - 1)

  useEffect(() => {
    timeoutRef.current = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % testimonials.length)
    }, 4000)

    return () => {
      if (timeoutRef.current) window.clearInterval(timeoutRef.current)
    }
  }, [])

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX
    const delta = endX - touchStartX

    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext()
      else goPrev()
    }

    setTouchStartX(null)
  }

  return (
    <section className="premium-section px-4 py-7 sm:px-6 lg:px-8">
      <div className="shell-container px-0">
        <div className="soft-panel overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
          <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              What Our Customers Say
            </p>

            <div className="mt-5 flex items-center justify-center gap-3 lg:mt-6 lg:gap-6">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-all hover:-translate-y-0.5 hover:bg-brand-50 lg:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                className="relative min-h-[230px] flex-1 overflow-hidden rounded-[1.3rem] bg-[linear-gradient(180deg,#fffdfd_0%,#fff6fb_100%)] px-4 py-5 ring-1 ring-brand-100 sm:min-h-[260px] sm:rounded-[1.9rem] sm:px-7 sm:py-7 lg:max-w-[760px] lg:px-10"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {testimonials.map((item, index) => (
                  <div
                    key={item.name}
                    aria-hidden={index !== activeIndex}
                    className={`absolute inset-0 flex flex-col items-center justify-center px-4 py-5 text-center transition-opacity duration-500 sm:px-7 sm:py-7 lg:px-10 ${
                      index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  >
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={72}
                      height={72}
                      className="h-[64px] w-[64px] rounded-full object-cover ring-4 ring-brand-50 sm:h-[72px] sm:w-[72px]"
                    />
                    <h3 className="mt-3 text-lg font-semibold text-neutral-950 sm:mt-4 sm:text-xl">{item.name}</h3>
                    <div className="mt-2 flex items-center gap-1 text-yellow-400" aria-label={`${item.rating} star rating`}>
                      {stars.map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:mt-4 sm:text-base sm:leading-7">
                      {item.review}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-brand-500 sm:mt-4">
                      Purchased: <span className="text-neutral-900">{item.product}</span>
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-all hover:-translate-y-0.5 hover:bg-brand-50 lg:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-colors hover:bg-brand-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-colors hover:bg-brand-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
