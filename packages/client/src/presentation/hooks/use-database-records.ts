import { useInfiniteQuery } from '@tanstack/react-query'
import { QueryDatabaseRecordsUseCase } from '../../application/notion/use-cases/query-database-records.use-case'
import { useNotionRepository } from '../providers/notion.provider'

export function useDatabaseRecords(id: string, pageSize = 20) {
  const repository = useNotionRepository()
  return useInfiniteQuery({
    queryKey: ['notion', 'databases', id, 'records', pageSize],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      new QueryDatabaseRecordsUseCase(repository).execute(id, {
        pageSize,
        startCursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
    enabled: !!id,
  })
}
