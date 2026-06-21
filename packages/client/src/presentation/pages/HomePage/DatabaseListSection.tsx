import { DatabaseCard } from '../../components/notion/DatabaseCard'
import type { DatabasePreference } from '../../../domain/database-preference/entities/database-preference.entity'
import type { NotionDatabase } from '../../../domain/notion/entities/notion-database.entity'
import { useDatabases } from '../../hooks/use-databases'
import { useDatabasePreferences } from '../../hooks/use-database-preferences'

interface DatabaseListSectionProps {
	prefMap: Map<string, DatabasePreference>
	showHidden: boolean
	onToggleHidden: () => void
	onEdit: (database: NotionDatabase) => void
	onDelete: (database: NotionDatabase) => void
	onRestore: (database: NotionDatabase) => void
}

export function DatabaseListSection({
	prefMap,
	showHidden,
	onToggleHidden,
	onEdit,
	onDelete,
	onRestore,
}: DatabaseListSectionProps) {
	const { data: databases, isLoading } = useDatabases();
	const { preferences } = useDatabasePreferences();
	const hiddenIds = new Set(preferences.filter((p) => p.hidden).map((p) => p.id));
	const visible = (databases ?? []).filter((db) => !hiddenIds.has(db.id));
	const hidden = (databases ?? []).filter((db) => hiddenIds.has(db.id));
	
	if (!databases) return null

	return (
		<>
			{visible.length === 0 && !isLoading ? (
				<p className="py-16 text-center text-slate-400">No databases found.</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{visible.map((db) => (
						<DatabaseCard
							key={db.id}
							database={db}
							preference={prefMap.get(db.id)}
							onEdit={() => onEdit(db)}
							onDelete={() => onDelete(db)}
						/>
					))}
				</div>
			)}

			<div className="mt-4 flex items-center justify-between text-xs text-slate-400">
				<div>
					{hidden.length > 0 && (
						<button
							type="button"
							onClick={onToggleHidden}
							className="underline hover:text-slate-600"
						>
							{showHidden ? 'Hide' : 'Show'} {hidden.length} hidden database{hidden.length !== 1 ? 's' : ''}
						</button>
					)}
				</div>
				<span>{visible.length} database{visible.length !== 1 ? 's' : ''}</span>
			</div>

			{showHidden && hidden.length > 0 && (
				<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{hidden.map((db) => (
						<div
							key={db.id}
							className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3"
						>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-slate-400">
									{prefMap.get(db.id)?.customTitle ?? db.title ?? 'Untitled'}
								</p>
								<p className="text-xs text-slate-300">Hidden</p>
							</div>
							<button
								type="button"
								onClick={() => onRestore(db)}
								className="ml-3 shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
							>
								Restore
							</button>
						</div>
					))}
				</div>
			)}
		</>
	)
}
