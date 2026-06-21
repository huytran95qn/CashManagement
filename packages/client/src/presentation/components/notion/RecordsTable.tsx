import type { NotionPage } from '../../../domain/notion/entities/notion-page.entity'
import type { NotionDatabaseProperty } from '../../../domain/notion/entities/notion-database.entity'
import { PropertyValue } from './PropertyValue'

interface RecordsTableProps {
  columns: NotionDatabaseProperty[]
  records: NotionPage[]
  onEditRecord?: (record: NotionPage) => void
  onRemoveRecord?: (record: NotionPage) => void
}

export function RecordsTable({ columns, records, onEditRecord, onRemoveRecord }: RecordsTableProps) {
  const showActions = !!onEditRecord || !!onRemoveRecord

  if (records.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 py-12 text-center text-slate-400">
        No records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col.id} className="whitespace-nowrap px-4 py-3 first:pl-5 last:pr-5">
                <span>{col.name}</span>
                <span className="ml-1 font-normal normal-case text-slate-300">({col.type})</span>
              </th>
            ))}
            {showActions && <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((page) => (
            <tr key={page.id} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => {
                const prop = page.properties.find((p) => p.name === col.name)
                return (
                  <td key={col.id} className="max-w-xs px-4 py-3 first:pl-5 last:pr-5">
                    {prop ? <PropertyValue property={prop} /> : <span className="text-slate-300">—</span>}
                  </td>
                )
              })}
              {showActions && (
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {onEditRecord && (
                      <button
                        type="button"
                        onClick={() => onEditRecord(page)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onRemoveRecord && (
                      <button
                        type="button"
                        onClick={() => onRemoveRecord(page)}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
