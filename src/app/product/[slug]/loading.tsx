export default function Loading() {
  return (
    <div className="shell-container py-10">
      <div className="mb-6 h-5 w-56 skeleton" />
      <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="skeleton aspect-square rounded-[2rem]" />
        <div className="space-y-4">
          <div className="h-4 w-24 skeleton" />
          <div className="h-12 w-3/4 skeleton" />
          <div className="h-5 w-1/3 skeleton" />
          <div className="h-10 w-1/2 skeleton" />
          <div className="h-24 w-full skeleton" />
          <div className="h-12 w-full skeleton" />
        </div>
      </div>
    </div>
  )
}
