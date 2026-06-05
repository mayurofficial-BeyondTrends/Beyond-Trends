interface ProductSpecificationsProps {
  title?: string
  items: Record<string, string>
}

export default function ProductSpecifications({
  title = 'Specifications',
  items,
}: ProductSpecificationsProps) {
  const rows = Object.entries(items)

  if (rows.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h3>
      <div className="overflow-hidden rounded-2xl border border-neutral-200">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-neutral-200 last:border-b-0">
                <th className="w-1/3 bg-neutral-50 px-4 py-3 text-left font-semibold text-neutral-700">
                  {label}
                </th>
                <td className="px-4 py-3 text-neutral-600">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
