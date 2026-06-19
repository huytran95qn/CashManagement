import { useQuery } from '@tanstack/react-query'
import { GetDatabaseSchemaUseCase } from '../../application/notion/use-cases/get-database-schema.use-case'
import { useNotionRepository } from '../providers/notion.provider'

export function useDatabaseSchema(id: string) {
  const repository = useNotionRepository()
  return useQuery({
    queryKey: ['notion', 'databases', id, 'schema'],
    queryFn: () => new GetDatabaseSchemaUseCase(repository).execute(id),
    enabled: !!id,
  })
}
