import { useState } from 'react'
import { Layout } from '../components/shared/Layout'
import { Spinner } from '../components/shared/Spinner'
import { ErrorCard } from '../components/shared/ErrorCard'
import { DatabaseCard } from '../components/notion/DatabaseCard'
import { DatabaseFormModal, type FormMode } from '../components/notion/DatabaseFormModal'
import { useDatabases } from '../hooks/use-databases'
import { useDatabasePreferences } from '../hooks/use-database-preferences'
import type { NotionDatabase } from '../../domain/notion/entities/notion-database.entity'

export function HomePage() {
	const { data: databases, isLoading, isError, error, refetch } = useDatabases()
	const { preferences, save } = useDatabasePreferences()
	const [modalMode, setModalMode] = useState<FormMode | null>(null)
	const [showHidden, setShowHidden] = useState(false)

	// Build a lookup map: databaseId → preference
	const prefMap = new Map(preferences.map((p) => [p.id, p]))
	const hiddenIds = new Set(preferences.filter((p) => p.hidden).map((p) => p.id))

	const visible = (databases ?? []).filter((db) => !hiddenIds.has(db.id))
	const hidden = (databases ?? []).filter((db) => hiddenIds.has(db.id))

	const closeModal = () => setModalMode(null)
	const onSuccess = () => {
		closeModal()
		void refetch()
	}

	const openEdit = (db: NotionDatabase) =>
		setModalMode({ type: 'edit', database: db, preference: prefMap.get(db.id) })

	const openDelete = (db: NotionDatabase) =>
		setModalMode({ type: 'delete', database: db })

	const restoreDatabase = (db: NotionDatabase) => {
		const pref = prefMap.get(db.id)
		if (pref) save({ ...pref, hidden: false })
	}

	return (
		<Layout>
			{/* Header */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Notion Databases</h1>
					<p className="mt-1 text-sm text-slate-500">Select a database to view its report.</p>
				</div>
				<button
					type="button"
					onClick={() => setModalMode({ type: 'add' })}
					className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
				>
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Add Database
				</button>
			</div>

			{isLoading && <Spinner className="py-16" />}

			{isError && (
				<ErrorCard
					message={error instanceof Error ? error.message : 'Failed to load databases.'}
					onRetry={() => void refetch()}
				/>
			)}

			{databases && (
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
									onEdit={() => openEdit(db)}
									onDelete={() => openDelete(db)}
								/>
							))}
						</div>
					)}

					{/* Footer row */}
					<div className="mt-4 flex items-center justify-between text-xs text-slate-400">
						<div>
							{hidden.length > 0 && (
								<button
									type="button"
									onClick={() => setShowHidden((v) => !v)}
									className="underline hover:text-slate-600"
								>
									{showHidden ? 'Hide' : 'Show'} {hidden.length} hidden database{hidden.length !== 1 ? 's' : ''}
								</button>
							)}
						</div>
						<span>{visible.length} database{visible.length !== 1 ? 's' : ''}</span>
					</div>

					{/* Hidden databases */}
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
										onClick={() => restoreDatabase(db)}
										className="ml-3 shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
									>
										Restore
									</button>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{/* Modal */}
			{modalMode && (
				<DatabaseFormModal mode={modalMode} onClose={closeModal} onSuccess={onSuccess} />
			)}
		</Layout>
	)
}
