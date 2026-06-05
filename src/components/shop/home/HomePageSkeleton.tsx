function HeroSkeleton() {
  return (
    <section className="px-4 pt-5 sm:px-6 lg:px-8 lg:pt-10">
      <div className="shell-container px-0">
        <div className="skeleton h-[250px] rounded-[2.25rem] sm:h-[340px] lg:h-[500px]" />
      </div>
    </section>
  )
}

function CategorySkeleton() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="shell-container px-0">
        <div className="mb-8 h-10 w-64 skeleton" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[1.9rem] bg-white p-3 ring-1 ring-black/5 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
              <div className="skeleton aspect-square rounded-[1.35rem]" />
              <div className="mx-auto mt-4 h-5 w-24 skeleton" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductSkeleton() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="shell-container px-0">
        <div className="mb-8 h-10 w-72 skeleton" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[1.9rem] bg-white p-4 ring-1 ring-black/5 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
              <div className="skeleton aspect-[4/4.4] rounded-[1.5rem]" />
              <div className="mt-4 h-3 w-20 skeleton" />
              <div className="mt-3 h-6 w-3/4 skeleton" />
              <div className="mt-3 h-4 w-1/3 skeleton" />
              <div className="mt-5 h-10 w-full rounded-[1rem] skeleton" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePageSkeleton() {
  return (
    <div className="bg-[#fffdfd] pb-8">
      <HeroSkeleton />
      <CategorySkeleton />
      <ProductSkeleton />
    </div>
  )
}
