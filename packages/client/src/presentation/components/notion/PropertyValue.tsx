import type { NotionPageProperty } from '../../../domain/notion/entities/notion-page.entity'

interface PropertyValueProps {
  property: NotionPageProperty
}

export function PropertyValue({ property }: PropertyValueProps) {
  const { type, value } = property

  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-300">—</span>
  }

  if (type === 'checkbox') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${value ? 'text-green-600' : 'text-slate-400'}`}>
        {value ? '✓ Yes' : '✗ No'}
      </span>
    )
  }

  if (type === 'select' && value && typeof value === 'object' && 'name' in (value as object)) {
    const option = value as { name: string; color?: string }
    return (
      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
        {option.name}
      </span>
    )
  }

  if (type === 'multi_select' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {(value as Array<{ name: string }>).map((item) => (
          <span key={item.name} className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            {item.name}
          </span>
        ))}
      </div>
    )
  }

  if (type === 'url' && typeof value === 'string') {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="truncate text-blue-600 hover:underline text-xs max-w-[200px] inline-block">
        {value}
      </a>
    )
  }

  if (type === 'number') {
    return (
      <span className="font-mono text-sm tabular-nums text-slate-700">
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : String(value)}
      </span>
    )
  }

  if (type === 'date' && value && typeof value === 'object' && 'start' in (value as object)) {
    const d = value as { start: string; end?: string }
    const formatted = new Date(d.start).toLocaleDateString('vi-VN')
    return <span className="text-sm text-slate-600">{formatted}{d.end ? ` → ${new Date(d.end).toLocaleDateString('vi-VN')}` : ''}</span>
  }

  return <span className="text-sm text-slate-700 line-clamp-2">{String(value)}</span>
}
