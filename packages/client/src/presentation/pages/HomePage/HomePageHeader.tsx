interface HomePageHeaderProps {
	onAddDatabase: () => void
}

export function HomePageHeader({ onAddDatabase }: HomePageHeaderProps) {
	return (
		<div className="mb-6 flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold text-slate-800">Notion Databases</h1>
				<p className="mt-1 text-sm text-slate-500">Select a database to view its report.</p>
			</div>
			<button
				type="button"
				onClick={onAddDatabase}
				className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
			>
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
				</svg>
				Add Database
			</button>
		</div>
	);
}
