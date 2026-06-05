'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface HeroSlide {
  id: string
  imageSrc: string
  imageAlt: string
}

interface HomeHeroProps {
  slides: HeroSlide[]
}

export default function HomeHero({ slides }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <section className="premium-section px-4 pt-4 sm:px-6 lg:px-8 lg:pt-10">
      <div className="shell-container px-0">
        <div className="relative overflow-hidden rounded-[1.7rem] shadow-[0_22px_60px_rgba(236,72,153,0.1)] sm:rounded-[2.25rem]">
          <div className="relative h-[190px] sm:h-[340px] lg:h-[500px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 1440px, 1440px"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 sm:left-10 lg:bottom-8 lg:left-12">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
