import { type FormEvent, useEffect, useMemo, useState } from 'react'
import type { NotionPage } from '../../../domain/notion/entities/notion-page.entity'

type EditableType =
	| 'title'
	| 'rich_text'
	| 'number'
	| 'checkbox'
	| 'select'
	| 'multi_select'
	| 'status'
	| 'date'
	| 'url'
	| 'email'
	| 'phone_number'
	| 'json'

function prettyJson(value: unknown): string {
	return JSON.stringify(value, null, 2)
}

function parsePropertiesJson(value: string): Record<string, unknown> {
	const parsed = JSON.parse(value) as Record<string, unknown>
	if (parsed == null || Array.isArray(parsed) || typeof parsed !== 'object') {
		throw new Error('Properties must be a JSON object.')
	}
	return parsed
}

function detectEditableType(property: unknown): EditableType {
	if (property == null || typeof property !== 'object' || Array.isArray(property)) {
		return 'json'
	}

	const key = Object.keys(property)[0]
	switch (key) {
		case 'title':
		case 'rich_text':
		case 'number':
		case 'checkbox':
		case 'select':
		case 'multi_select':
		case 'status':
		case 'date':
		case 'url':
		case 'email':
		case 'phone_number':
			return key
		default:
			return 'json'
	}
}

function getTextContent(property: unknown, key: 'title' | 'rich_text'): string {
	const typed = property as Record<string, unknown>
	const content = typed[key]
	if (!Array.isArray(content) || content.length === 0) return ''

	const first = content[0] as Record<string, unknown>
	const text = first?.text as Record<string, unknown> | undefined
	return typeof text?.content === 'string' ? text.content : ''
}

function getNamedOption(property: unknown, key: 'select' | 'status'): string {
	const typed = property as Record<string, unknown>
	const option = typed[key] as Record<string, unknown> | null | undefined
	return typeof option?.name === 'string' ? option.name : ''
}

function getDateStart(property: unknown): string {
	const typed = property as Record<string, unknown>
	const date = typed.date as Record<string, unknown> | null | undefined
	if (typeof date?.start !== 'string') return ''
	return date.start.slice(0, 10)
}

function getPrimitiveString(property: unknown, key: 'url' | 'email' | 'phone_number'): string {
	const typed = property as Record<string, unknown>
	const value = typed[key]
	return typeof value === 'string' ? value : ''
}

function getNumberValue(property: unknown): string {
	const typed = property as Record<string, unknown>
	const value = typed.number
	return typeof value === 'number' ? String(value) : ''
}

function getCheckboxValue(property: unknown): boolean {
	const typed = property as Record<string, unknown>
	return !!typed.checkbox
}

function getMultiSelect(property: unknown): string {
	const typed = property as Record<string, unknown>
	const value = typed.multi_select
	if (!Array.isArray(value)) return ''

	return value
		.map((entry) => {
			if (entry == null || typeof entry !== 'object') return ''
			const typedEntry = entry as Record<string, unknown>
			return typeof typedEntry.name === 'string' ? typedEntry.name : ''
		})
		.filter(Boolean)
		.join(', ')
}

export type RecordCrudMode =
	| { type: 'add' }
	| { type: 'edit'; record: NotionPage }
	| { type: 'remove'; record: NotionPage }

interface RecordCrudModalProps {
	mode: RecordCrudMode
	isSubmitting: boolean
	error: string | null
	initialPropertiesJson: string
	onClose: () => void
	onSubmit: (properties: Record<string, unknown>) => Promise<void>
	onRemove: (recordId: string) => Promise<void>
}

export function RecordCrudModal({
	mode,
	isSubmitting,
	error,
	initialPropertiesJson,
	onClose,
	onSubmit,
	onRemove,
}: RecordCrudModalProps) {
	const [propertiesDraft, setPropertiesDraft] = useState<Record<string, unknown>>({})
	const [propertiesText, setPropertiesText] = useState(initialPropertiesJson)
	const [useJsonMode, setUseJsonMode] = useState(false)
	const [localError, setLocalError] = useState<string | null>(null)

	useEffect(() => {
		setPropertiesDraft(parsePropertiesJson(initialPropertiesJson))
		setPropertiesText(initialPropertiesJson)
		setUseJsonMode(false)
		setLocalError(null)
	}, [initialPropertiesJson])

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && !isSubmitting) onClose()
		}
		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
	}, [isSubmitting, onClose])

	const title = useMemo(() => {
		if (mode.type === 'add') return 'Add Record'
		if (mode.type === 'edit') return 'Edit Record'
		return 'Remove Record'
	}, [mode.type])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setLocalError(null)

		if (mode.type === 'remove') {
			await onRemove(mode.record.id)
			return
		}

		try {
			const parsed = useJsonMode ? parsePropertiesJson(propertiesText) : propertiesDraft

			await onSubmit(parsed)
		} catch (e) {
			setLocalError(e instanceof Error ? e.message : 'Invalid properties payload.')
		}
	}

	const updateProperty = (name: string, value: unknown) => {
		setPropertiesDraft((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const toggleJsonMode = () => {
		setLocalError(null)

		if (useJsonMode) {
			try {
				setPropertiesDraft(parsePropertiesJson(propertiesText))
				setUseJsonMode(false)
			} catch (e) {
				setLocalError(e instanceof Error ? e.message : 'Invalid JSON payload.')
			}
			return
		}

		setPropertiesText(prettyJson(propertiesDraft))
		setUseJsonMode(true)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

			<div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h2 className={`text-base font-semibold ${mode.type === 'remove' ? 'text-red-600' : 'text-slate-800'}`}>
						{title}
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

				<form onSubmit={(e) => void handleSubmit(e)} noValidate>
					<div className="space-y-4 px-6 py-5">
						{mode.type === 'remove' ? (
							<div className="rounded-xl bg-red-50 p-4 text-sm text-slate-700">
								<p>
									Remove record <span className="font-semibold text-slate-900">{mode.record.id}</span>?
								</p>
								<p className="mt-1 text-xs text-slate-400">
									This archives the row in Notion and refreshes your list.
								</p>
							</div>
						) : (
							<>
								<div className="flex items-center justify-between">
									<p className="text-xs text-slate-500">
										{useJsonMode
											? 'Advanced mode: edit raw Notion properties JSON.'
											: 'Guided mode: edit values with simple inputs.'}
									</p>
									<button
										type="button"
										onClick={toggleJsonMode}
										className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
									>
										{useJsonMode ? 'Use guided form' : 'Use JSON mode'}
									</button>
								</div>

								{useJsonMode ? (
									<textarea
										value={propertiesText}
										onChange={(e) => setPropertiesText(e.target.value)}
										rows={14}
										className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
									/>
								) : (
									<div className="max-h-[26rem] space-y-3 overflow-y-auto rounded-lg border border-slate-200 p-3">
										{Object.entries(propertiesDraft).map(([name, property]) => {
											const type = detectEditableType(property)

											return (
												<div key={name} className="space-y-1">
													<label className="block text-xs font-semibold text-slate-600">{name}</label>

													{(type === 'title' || type === 'rich_text') && (
														<input
															type="text"
															value={getTextContent(property, type)}
															onChange={(e) =>
																updateProperty(name, {
																	[type]: [{ text: { content: e.target.value } }],
																})
															}
															className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
														/>
													)}

													{type === 'number' && (
														<input
															type="number"
															value={getNumberValue(property)}
															onChange={(e) =>
																updateProperty(name, {
																	number: e.target.value === '' ? null : Number(e.target.value),
																})
															}
															className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
														/>
													)}

													{type === 'checkbox' && (
														<label className="inline-flex items-center gap-2 text-sm text-slate-700">
															<input
																type="checkbox"
																checked={getCheckboxValue(property)}
																onChange={(e) => updateProperty(name, { checkbox: e.target.checked })}
																className="h-4 w-4 rounded border-slate-300"
															/>
															Checked
														</label>
													)}

													{(type === 'select' || type === 'status') && (
														<input
															type="text"
															value={getNamedOption(property, type)}
															onChange={(e) =>
																updateProperty(name, {
																	[type]: e.target.value.trim() ? { name: e.target.value } : null,
																})
															}
															placeholder="Option name"
															className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
														/>
													)}

													{type === 'multi_select' && (
														<input
															type="text"
															value={getMultiSelect(property)}
															onChange={(e) =>
																updateProperty(name, {
																	multi_select: e.target.value
																		.split(',')
																		.map((item) => item.trim())
																		.filter(Boolean)
																		.map((item) => ({ name: item })),
																})
															}
															placeholder="Comma-separated options"
															className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
														/>
													)}

													{type === 'date' && (
														<input
															type="date"
															value={getDateStart(property)}
															onChange={(e) =>
																updateProperty(name, {
																	date: e.target.value ? { start: e.target.value, end: null } : null,
																})
															}
															className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
														/>
													)}

													{(type === 'url' || type === 'email' || type === 'phone_number') && (
														<input
															type="text"
															value={getPrimitiveString(property, type)}
															onChange={(e) => updateProperty(name, { [type]: e.target.value || null })}
															className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
														/>
													)}

													{type === 'json' && (
														<p className="rounded-md bg-amber-50 px-2.5 py-2 text-xs text-amber-700">
															This property type is not supported in guided mode. Switch to JSON mode to edit it.
														</p>
													)}
												</div>
											)
										})}
									</div>
								)}
							</>
						)}

						{(localError || error) && (
							<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{localError ?? error}</p>
						)}
					</div>

					<div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${mode.type === 'remove' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
								}`}
						>
							{isSubmitting && (
								<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
							)}
							{mode.type === 'add' && (isSubmitting ? 'Creating…' : 'Create')}
							{mode.type === 'edit' && (isSubmitting ? 'Saving…' : 'Save')}
							{mode.type === 'remove' && (isSubmitting ? 'Removing…' : 'Remove')}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
