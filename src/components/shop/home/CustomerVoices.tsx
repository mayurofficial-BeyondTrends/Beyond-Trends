import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    id: 'priya-s',
    name: 'Priya S',
    rating: 5,
    quote: 'Amazing quality and fast delivery. Totally worth it.',
    role: 'Happy Customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
]

const servicePoints = [
  { title: 'Cash on Delivery', description: 'Pay on delivery' },
  { title: 'Easy Returns', description: 'Hassle free returns' },
  { title: 'Fast Delivery', description: 'Quick and safe delivery' },
  { title: 'Best Prices', description: 'Unbeatable deals' },
]

export default function CustomerVoices() {
  const testimonial = testimonials[0]

  return (
    <section className="premium-section px-4 py-10 sm:px-6 lg:px-8">
      <div className="shell-container overflow-hidden rounded-[2.1rem] bg-white px-0 shadow-[0_20px_60px_rgba(15,23,42,0.07)] ring-1 ring-neutral-100">
        <div className="px-5 py-8 sm:px-8 lg:px-12">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            What Our Customers Say
          </p>

          <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
            <div className="hidden text-xs leading-6 text-neutral-400 lg:block">
              <div className="mb-2 flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p>Loved the product quality</p>
              <p>and quick support from</p>
              <p>the team.</p>
            </div>

            <button
              type="button"
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-colors hover:bg-brand-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-brand-50"
              />
              <div className="mt-3 flex items-center gap-1 text-yellow-400">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-950">{testimonial.name}</h3>
              <p className="mt-1 max-w-md text-sm leading-6 text-neutral-600">{testimonial.quote}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                {testimonial.role}
              </p>
            </div>

            <button
              type="button"
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-colors hover:bg-brand-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="hidden justify-self-end text-right text-xs leading-6 text-neutral-400 lg:block">
              <div className="mb-2 flex items-center justify-end gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p>Stylish picks, smooth checkout,</p>
              <p>and a lovely shopping</p>
              <p>experience overall.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-4">
          {servicePoints.map((item) => (
            <div key={item.title} className="bg-white px-5 py-4 text-center">
              <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
              <p className="mt-1 text-xs text-neutral-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
