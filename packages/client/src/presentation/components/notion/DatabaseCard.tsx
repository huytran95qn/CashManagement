import { Link } from 'react-router'
import type { NotionDatabase } from '../../../domain/notion/entities/notion-database.entity'

interface DatabaseCardProps {
  database: NotionDatabase
}

export function DatabaseCard({ database }: DatabaseCardProps) {
  const edited = new Date(database.lastEditedTime).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <Link
      to={`/databases/${database.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-800 group-hover:text-blue-600">
            {database.title || 'Untitled'}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Last edited: {edited}</p>
        </div>
        <svg
          className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="mt-3 text-xs text-slate-400 truncate">{database.id}</p>
    </Link>
  )
}
