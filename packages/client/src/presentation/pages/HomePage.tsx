import { Layout } from '../components/shared/Layout'
import { Spinner } from '../components/shared/Spinner'
import { ErrorCard } from '../components/shared/ErrorCard'
import { DatabaseCard } from '../components/notion/DatabaseCard'
import { useDatabases } from '../hooks/use-databases'

export function HomePage() {
  const { data: databases, isLoading, isError, error, refetch } = useDatabases()

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Notion Databases</h1>
        <p className="mt-1 text-sm text-slate-500">Select a database to view its report.</p>
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
          {databases.length === 0 ? (
            <p className="text-center text-slate-400 py-16">No databases found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {databases.map((db) => (
                <DatabaseCard key={db.id} database={db} />
              ))}
            </div>
          )}
          <p className="mt-4 text-right text-xs text-slate-400">{databases.length} database(s)</p>
        </>
      )}
    </Layout>
  )
}
