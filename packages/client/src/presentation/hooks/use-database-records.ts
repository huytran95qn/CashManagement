import { useInfiniteQuery } from '@tanstack/react-query'
import { DatabaseRecordsUseCase } from '../../application/database-records.use-case'
import { useRefInstance } from './use-ref-instance'
import { lastValueFrom } from 'rxjs'

export function useDatabaseRecords(id: string, pageSize = 20) {
	const useCase = useRefInstance(DatabaseRecordsUseCase);

	return useInfiniteQuery({
		queryKey: ['notion', 'databases', id, 'records', pageSize],
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			lastValueFrom(useCase.queryRecords(id, {
				pageSize,
				startCursor: pageParam,
			})),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: lastPage =>
			lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
		enabled: !!id,
	});
}