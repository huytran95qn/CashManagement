import { useQuery } from '@tanstack/react-query'
import { GetDatabasesUseCase } from '../../application/notion/use-cases/get-databases.use-case'
import { useNotionRepository } from '../providers/notion.provider'

export function useDatabases() {
  const repository = useNotionRepository()
  return useQuery({
    queryKey: ['notion', 'databases'],
    queryFn: () => new GetDatabasesUseCase(repository).execute(),
  })
}
