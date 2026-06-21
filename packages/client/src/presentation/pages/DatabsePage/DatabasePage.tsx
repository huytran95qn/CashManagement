import { useState } from 'react'
import { useParams } from 'react-router'
import { Layout } from '../../components/shared/Layout'
import { Spinner } from '../../components/shared/Spinner'
import { ErrorCard } from '../../components/shared/ErrorCard'
import { RecordsTable } from '../../components/notion/RecordsTable'
import { RecordCrudModal, type RecordCrudMode } from '../../components/notion/RecordCrudModal'
import { useDatabaseSchema } from '../../hooks/use-database-schema'
import { useDatabaseRecords } from '../../hooks/use-database-records'
import { useDatabaseRecordMutations } from '../../hooks/use-database-record-mutations'
import type { NotionDatabaseProperty } from '../../../domain/notion/entities/notion-database.entity'
import type { NotionPage } from '../../../domain/notion/entities/notion-page.entity'

const PAGE_SIZE = 20

type RecordModalState = {
    mode: RecordCrudMode
    initialPropertiesJson: string
}

function prettyJson(value: unknown): string {
    return JSON.stringify(value, null, 2)
}

function buildCreateTemplate(columns: NotionDatabaseProperty[]): Record<string, unknown> {
    const properties: Record<string, unknown> = {}

    for (const column of columns) {
        switch (column.type) {
            case 'title':
                properties[column.name] = { title: [{ text: { content: '' } }] }
                break
            case 'rich_text':
                properties[column.name] = { rich_text: [{ text: { content: '' } }] }
                break
            case 'number':
                properties[column.name] = { number: null }
                break
            case 'checkbox':
                properties[column.name] = { checkbox: false }
                break
            case 'select':
                properties[column.name] = { select: null }
                break
            case 'multi_select':
                properties[column.name] = { multi_select: [] }
                break
            case 'status':
                properties[column.name] = { status: null }
                break
            case 'date':
                properties[column.name] = { date: null }
                break
            case 'url':
                properties[column.name] = { url: null }
                break
            case 'email':
                properties[column.name] = { email: null }
                break
            case 'phone_number':
                properties[column.name] = { phone_number: null }
                break
            default:
                break
        }
    }

    return properties
}

function buildEditTemplate(record: NotionPage, columns: NotionDatabaseProperty[]): Record<string, unknown> {
    const properties: Record<string, unknown> = {}

    for (const column of columns) {
        const existing = record.properties.find((property) => property.name === column.name)
        if (!existing) continue

        switch (column.type) {
            case 'title':
                properties[column.name] = {
                    title: [{ text: { content: typeof existing.value === 'string' ? existing.value : '' } }],
                }
                break
            case 'rich_text':
                properties[column.name] = {
                    rich_text: [{ text: { content: typeof existing.value === 'string' ? existing.value : '' } }],
                }
                break
            case 'number':
                properties[column.name] = {
                    number: typeof existing.value === 'number' ? existing.value : null,
                }
                break
            case 'checkbox':
                properties[column.name] = { checkbox: !!existing.value }
                break
            case 'select':
                properties[column.name] = {
                    select: typeof existing.value === 'string' ? { name: existing.value } : null,
                }
                break
            case 'multi_select':
                properties[column.name] = {
                    multi_select: Array.isArray(existing.value)
                        ? existing.value.map((value) => ({ name: String(value) }))
                        : [],
                }
                break
            case 'status':
                properties[column.name] = {
                    status: typeof existing.value === 'string' ? { name: existing.value } : null,
                }
                break
            case 'date':
                if (
                    existing.value != null &&
                    typeof existing.value === 'object' &&
                    'start' in existing.value
                ) {
                    const dateValue = existing.value as { start: unknown; end?: unknown }
                    properties[column.name] = {
                        date: {
                            start: typeof dateValue.start === 'string' ? dateValue.start : null,
                            end: typeof dateValue.end === 'string' ? dateValue.end : null,
                        },
                    }
                }
                break
            case 'url':
                properties[column.name] = { url: typeof existing.value === 'string' ? existing.value : null }
                break
            case 'email':
                properties[column.name] = { email: typeof existing.value === 'string' ? existing.value : null }
                break
            case 'phone_number':
                properties[column.name] = {
                    phone_number: typeof existing.value === 'string' ? existing.value : null,
                }
                break
            default:
                break
        }
    }

    return properties
}

export function DatabasePage() {
    const { id = '' } = useParams<{ id: string }>()
    const schema = useDatabaseSchema(id)
    const records = useDatabaseRecords(id, PAGE_SIZE)
    const { addRecord, editRecord, removeRecord } = useDatabaseRecordMutations()
    const [recordModal, setRecordModal] = useState<RecordModalState | null>(null)

    const allRecords = records.data?.pages.flatMap((p) => p.results) ?? []
    const total = allRecords.length

    const closeRecordModal = () => {
        addRecord.reset()
        editRecord.reset()
        removeRecord.reset()
        setRecordModal(null)
    }

    const openAddModal = () => {
        if (!schema.data) return

        setRecordModal({
            mode: { type: 'add' },
            initialPropertiesJson: prettyJson(buildCreateTemplate(schema.data.properties)),
        })
    }

    const openEditModal = (record: NotionPage) => {
        if (!schema.data) return

        setRecordModal({
            mode: { type: 'edit', record },
            initialPropertiesJson: prettyJson(buildEditTemplate(record, schema.data.properties)),
        })
    }

    const openRemoveModal = (record: NotionPage) => {
        setRecordModal({
            mode: { type: 'remove', record },
            initialPropertiesJson: '{}',
        })
    }

    const submitProperties = async (properties: Record<string, unknown>) => {
        if (!recordModal) return

        try {
            if (recordModal.mode.type === 'add') {
                await addRecord.mutateAsync({ databaseId: id, properties })
            }

            if (recordModal.mode.type === 'edit') {
                await editRecord.mutateAsync({
                    databaseId: id,
                    recordId: recordModal.mode.record.id,
                    properties,
                })
            }

            closeRecordModal()
        } catch {
            // Mutation error is surfaced through react-query state.
        }
    }

    const removeById = async (recordId: string) => {
        try {
            await removeRecord.mutateAsync({ databaseId: id, recordId })
            closeRecordModal()
        } catch {
            // Mutation error is surfaced through react-query state.
        }
    }

    const activeMutationError =
        recordModal?.mode.type === 'add'
            ? addRecord.error
            : recordModal?.mode.type === 'edit'
            ? editRecord.error
            : removeRecord.error

    const mutationErrorMessage =
        activeMutationError instanceof Error ? activeMutationError.message : null

    const isSubmittingMutation =
        recordModal?.mode.type === 'add'
            ? addRecord.isPending
            : recordModal?.mode.type === 'edit'
            ? editRecord.isPending
            : removeRecord.isPending

    return (
        <Layout
            title={schema.data?.title ?? 'Database'}
            backTo="/"
            backLabel="Databases"
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {schema.isLoading ? (
                            <span className="inline-block h-7 w-48 animate-pulse rounded bg-slate-200" />
                        ) : (
                            schema.data?.title ?? 'Untitled'
                        )}
                    </h1>
                    {schema.data && (
                        <p className="mt-1 text-xs text-slate-400">
                            {schema.data.properties.length} columns · {total} records loaded
                        </p>
                    )}
                </div>
                {schema.data && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                            Add record
                        </button>
                        <a
                            href={schema.data.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                            Open in Notion
                        </a>
                    </div>
                )}
            </div>

            {/* Schema error */}
            {schema.isError && (
                <ErrorCard
                    message={schema.error instanceof Error ? schema.error.message : 'Failed to load schema.'}
                    onRetry={() => void schema.refetch()}
                />
            )}

            {/* Records */}
            {schema.isLoading || records.isLoading ? (
                <Spinner className="py-16" />
            ) : records.isError ? (
                <ErrorCard
                    message={records.error instanceof Error ? records.error.message : 'Failed to load records.'}
                    onRetry={() => void records.refetch()}
                />
            ) : schema.data ? (
                <>
                    <RecordsTable
                        columns={schema.data.properties}
                        records={allRecords}
                        onEditRecord={openEditModal}
                        onRemoveRecord={openRemoveModal}
                    />

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                        <span>{total} record{total !== 1 ? 's' : ''} loaded</span>
                        {records.hasNextPage && (
                            <button
                                onClick={() => void records.fetchNextPage()}
                                disabled={records.isFetchingNextPage}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                            >
                                {records.isFetchingNextPage ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Loading…
                                    </>
                                ) : (
                                    `Load more (${PAGE_SIZE} at a time)`
                                )}
                            </button>
                        )}
                        {!records.hasNextPage && total > 0 && (
                            <span className="text-xs text-slate-400">All records loaded</span>
                        )}
                    </div>
                </>
            ) : null}

            {recordModal && (
                <RecordCrudModal
                    mode={recordModal.mode}
                    isSubmitting={isSubmittingMutation}
                    error={mutationErrorMessage}
                    initialPropertiesJson={recordModal.initialPropertiesJson}
                    onClose={closeRecordModal}
                    onSubmit={submitProperties}
                    onRemove={removeById}
                />
            )}
        </Layout>
    )
}
