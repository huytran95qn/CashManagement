import { Link } from 'react-router'
import type { NotionDatabase } from '../../../domain/notion/entities/notion-database.entity'
import type { DatabasePreference } from '../../../domain/database-preference/entities/database-preference.entity'

interface DatabaseCardProps {
	database: NotionDatabase
	preference?: DatabasePreference
	onEdit: () => void
	onDelete: () => void
}

export function DatabaseCard({ database, preference, onEdit, onDelete }: DatabaseCardProps) {
	const displayTitle = preference?.customTitle || database.title || 'Untitled'
	const edited = new Date(database.lastEditedTime).toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	return (
		<div className="group relative rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
			{/* Action buttons */}
			<div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					type="button"
					onClick={(e) => { e.preventDefault(); onEdit() }}
					title="Edit"
					className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
				>
					<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
					</svg>
				</button>
				<button
					type="button"
					onClick={(e) => { e.preventDefault(); onDelete() }}
					title="Hide"
					className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
				>
					<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
					</svg>
				</button>
			</div>

			<Link to={`/databases/${database.id}`} className="block p-5">
				<div className="flex items-start gap-3 pr-12">
					<div className="min-w-0">
						<h3 className="truncate text-base font-semibold text-slate-800 group-hover:text-blue-600">
							{displayTitle}
						</h3>
						{preference?.customTitle && (
							<p className="mt-0.5 truncate text-xs text-slate-400 italic">{database.title}</p>
						)}
						<p className="mt-1 text-xs text-slate-400">Last edited: {edited}</p>
					</div>
				</div>
				<p className="mt-3 text-xs text-slate-400 truncate">{database.id}</p>
			</Link>
		</div>
	)
}
