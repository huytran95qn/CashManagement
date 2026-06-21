import { lastValueFrom } from 'rxjs'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { DatabaseRecordsUseCase } from '../../../application/database-records.use-case'
import type { NotionDatabase } from '../../../domain/notion/entities/notion-database.entity'
import type { DatabasePreference } from '../../../domain/database-preference/entities/database-preference.entity'
import { useDatabasePreferences } from '../../hooks/use-database-preferences'
import { useRefInstance } from '../../hooks/use-ref-instance'

// ── Types ──────────────────────────────────────────────────────────────────────

export type FormMode =
	| { type: 'add' }
	| { type: 'edit'; database: NotionDatabase; preference?: DatabasePreference }
	| { type: 'delete'; database: NotionDatabase }

interface Props {
	mode: FormMode
	onClose: () => void
	onSuccess: () => void
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const TITLES: Record<FormMode['type'], string> = {
	add: 'Add Database',
	edit: 'Edit Database',
	delete: 'Remove Database',
}

function normalizeTitle(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim()
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DatabaseFormModal({ mode, onClose, onSuccess }: Props) {
	const recordsUseCase = useRefInstance(DatabaseRecordsUseCase)
	const { preferences, save, remove } = useDatabasePreferences()

	const [databaseTitle, setDatabaseTitle] = useState('')
	const [customTitle, setCustomTitle] = useState(
		mode.type === 'edit' ? (mode.preference?.customTitle ?? '') : '',
	)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Focus first input on open
	const firstInputRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		firstInputRef.current?.focus()
	}, [])

	// Close on Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
	}, [onClose])

	// ── Submit ───────────────────────────────────────────────────────────────────

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		setIsLoading(true)

		try {
			if (mode.type === 'add') {
				const title = databaseTitle.trim()
				if (!title) throw new Error('Database title is required.')

				const allDatabases = await lastValueFrom(recordsUseCase.getDatabases())
				const normalizedTitle = normalizeTitle(title)
				const matchedDatabases = allDatabases.filter((database) => {
					const candidate = normalizeTitle(database.title)
					return (
						candidate === normalizedTitle ||
						candidate.includes(normalizedTitle) ||
						normalizedTitle.includes(candidate)
					)
				})

				if (matchedDatabases.length > 1) {
					throw new Error('Multiple databases have this title. Please rename one in Notion, then try again.')
				}

				save({ id:"", customTitle: undefined, hidden: false })
				onSuccess()
			} else if (mode.type === 'edit') {
				save({
					id: "mode.database.id",
					customTitle: customTitle.trim() || undefined,
					hidden: mode.preference?.hidden ?? false,
				})
				onSuccess()
			} else if (mode.type === 'delete') {
				save({ id: mode.database.id, customTitle: undefined, hidden: true })
				onSuccess()
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong.')
		} finally {
			setIsLoading(false)
		}
	}

	// ── Restore hidden (called from delete confirmation) ──────────────────────────

	const handleRestore = () => {
		if (mode.type !== 'delete') return
		const existing = preferences.find((preference) => preference.id === mode.database.id)
		if (existing) {
			save({ ...existing, hidden: false })
		} else {
			remove(mode.database.id)
		}
		onSuccess()
	}

	// ── Render ───────────────────────────────────────────────────────────────────

	const isDelete = mode.type === 'delete'
	const displayName =
		mode.type !== 'add'
			? (mode.type === 'edit'
				? (mode.preference?.customTitle ?? mode.database.title)
				: mode.database.title) || 'Untitled'
			: ''

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

			{/* Card */}
			<div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h2
						id="modal-title"
						className={`text-base font-semibold ${isDelete ? 'text-red-600' : 'text-slate-800'}`}
					>
						{TITLES[mode.type]}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Body */}
				<form onSubmit={(e) => void handleSubmit(e)} noValidate>
					<div className="space-y-4 px-6 py-5">

						{/* ADD: database title input */}
						{mode.type === 'add' && (
							<div>
								<label className="mb-1.5 block text-sm font-medium text-slate-700">
									Database Title <span className="text-red-500">*</span>
								</label>
								<input
									ref={firstInputRef}
									type="text"
									value={databaseTitle}
									onChange={(e) => setDatabaseTitle(e.target.value)}
									placeholder="e.g. Monthly Budget"
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
								/>
								<p className="mt-1.5 text-xs text-slate-400">
									Enter the exact title from Notion. Database ID will be resolved automatically.
								</p>
							</div>
						)}

						{/* EDIT: read-only ID */}
						{mode.type === 'edit' && (
							<div>
								<label className="mb-1.5 block text-sm font-medium text-slate-700">
									Database ID
								</label>
								<p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500 break-all">
									{mode.database.id}
								</p>
							</div>
						)}

						{/* EDIT: custom title */}
						{mode.type === 'edit' && (
							<div>
								<label className="mb-1.5 block text-sm font-medium text-slate-700">
									Custom Title{' '}
									<span className="font-normal text-slate-400">(optional)</span>
								</label>
								<input
									ref={firstInputRef}
									type="text"
									value={customTitle}
									onChange={(e) => setCustomTitle(e.target.value)}
									placeholder={mode.database.title || 'Untitled'}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
								/>
								<p className="mt-1.5 text-xs text-slate-400">
									Leave blank to use the original Notion title.
								</p>
							</div>
						)}

						{/* DELETE: confirmation */}
						{mode.type === 'delete' && (
							<div className="rounded-xl bg-red-50 p-4">
								<p className="text-sm text-slate-700">
									Hide{' '}
									<span className="font-semibold text-slate-900">&ldquo;{displayName}&rdquo;</span>{' '}
									from your dashboard?
								</p>
								<p className="mt-1 text-xs text-slate-400">
									The database stays in Notion. You can restore it any time.
								</p>
							</div>
						)}

						{/* Error */}
						{error && (
							<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
						)}
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
						{/* Restore button (delete mode only) */}
						{mode.type === 'delete' ? (
							<button
								type="button"
								onClick={handleRestore}
								className="text-xs text-slate-400 hover:text-slate-600 underline"
							>
								Restore if already hidden
							</button>
						) : (
							<span />
						)}

						<div className="flex gap-2">
							<button
								type="button"
								onClick={onClose}
								disabled={isLoading}
								className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${isDelete
									? 'bg-red-500 hover:bg-red-600'
									: 'bg-blue-600 hover:bg-blue-700'
									}`}
							>
								{isLoading && (
									<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
								)}
								{mode.type === 'add' && (isLoading ? 'Adding…' : 'Add')}
								{mode.type === 'edit' && (isLoading ? 'Saving…' : 'Save')}
								{mode.type === 'delete' && 'Hide'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
