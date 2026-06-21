import { useQuery } from '@tanstack/react-query'
import { useRefInstance } from './use-ref-instance';
import { lastValueFrom } from 'rxjs';
import { DatabaseRecordsUseCase } from '../../application/database-records.use-case';

export function useDatabaseSchema(id: string) {
    const useCase = useRefInstance(DatabaseRecordsUseCase);

    return useQuery({
        queryKey: ['notion', 'databases', id, 'schema'],
        queryFn: () => lastValueFrom(useCase.getDatabaseSchema(id)),
        enabled: !!id,
    });
}
