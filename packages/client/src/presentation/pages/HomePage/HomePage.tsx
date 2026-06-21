import { useState } from 'react'
import { Layout } from '../../components/shared/Layout'
import { Spinner } from '../../components/shared/Spinner'
import { ErrorCard } from '../../components/shared/ErrorCard'
import { DatabaseFormModal, type FormMode } from '../../components/notion/DatabaseFormModal'
import { DatabaseListSection } from './DatabaseListSection'
import { HomePageHeader } from './HomePageHeader'
import { useDatabases } from '../../hooks/use-databases'
import { useDatabasePreferences } from '../../hooks/use-database-preferences'
import type { NotionDatabase } from '../../../domain/notion/entities/notion-database.entity'

export function HomePage() {
	const { isLoading, isError, error, refetch } = useDatabases()
	const { preferences, save } = useDatabasePreferences()
	const [modalMode, setModalMode] = useState<FormMode | null>(null)
	const [showHidden, setShowHidden] = useState(false)
	const prefMap = new Map(preferences.map((p) => [p.id, p]))
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
			<HomePageHeader onAddDatabase={() => setModalMode({ type: 'add' })} />

			{isLoading && <Spinner className="py-16" />}

			{isError && (
				<ErrorCard
					message={error instanceof Error ? error.message : 'Failed to load databases.'}
					onRetry={() => void refetch()}
				/>
			)}

			<DatabaseListSection
				prefMap={prefMap}
				showHidden={showHidden}
				onToggleHidden={() => setShowHidden((v) => !v)}
				onEdit={openEdit}
				onDelete={openDelete}
				onRestore={restoreDatabase}
			/>

			{/* Modal */}
			{modalMode && (
				<DatabaseFormModal mode={modalMode} onClose={closeModal} onSuccess={onSuccess} />
			)}
		</Layout>
	)
}
