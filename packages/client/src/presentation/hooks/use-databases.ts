import { useQuery } from '@tanstack/react-query'
import { lastValueFrom } from 'rxjs';
import { DatabaseRecordsUseCase } from '../../application/database-records.use-case';
import { useRefInstance } from './use-ref-instance';

export function useDatabases() {
	const useCase = useRefInstance(DatabaseRecordsUseCase);

	return useQuery({
		queryKey: ['notion', 'databases'],
		queryFn: () => lastValueFrom(useCase.getDatabases()),
	})
}
