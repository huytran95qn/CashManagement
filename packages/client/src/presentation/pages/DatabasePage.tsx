import { useParams } from 'react-router'
import { Layout } from '../components/shared/Layout'
import { Spinner } from '../components/shared/Spinner'
import { ErrorCard } from '../components/shared/ErrorCard'
import { RecordsTable } from '../components/notion/RecordsTable'
import { useDatabaseSchema } from '../hooks/use-database-schema'
import { useDatabaseRecords } from '../hooks/use-database-records'

const PAGE_SIZE = 20

export function DatabasePage() {
  const { id = '' } = useParams<{ id: string }>()

  const schema = useDatabaseSchema(id)
  const records = useDatabaseRecords(id, PAGE_SIZE)

  const allRecords = records.data?.pages.flatMap((p) => p.results) ?? []
  const total = allRecords.length

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
          <a
            href={schema.data.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Notion
          </a>
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
          <RecordsTable columns={schema.data.properties} records={allRecords} />

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
    </Layout>
  )
}
