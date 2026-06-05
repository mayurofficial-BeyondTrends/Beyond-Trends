interface ProductDescriptionProps {
  title?: string
  html: string
}

export default function ProductDescription({
  title = 'Product Description',
  html,
}: ProductDescriptionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h3>
      <div
        className="prose prose-sm prose-neutral max-w-none text-neutral-700 sm:prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
