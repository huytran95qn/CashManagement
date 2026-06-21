import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lastValueFrom } from 'rxjs'
import { DatabaseRecordsUseCase } from '../../application/database-records.use-case'
import { useRefInstance } from './use-ref-instance'

interface UpsertInput {
  databaseId: string
  properties: Record<string, unknown>
}

interface UpdateInput extends UpsertInput {
  recordId: string
}

interface RemoveInput {
  databaseId: string
  recordId: string
}

export function useDatabaseRecordMutations() {
  const queryClient = useQueryClient()
  const useCase = useRefInstance(DatabaseRecordsUseCase)

  const invalidateRecords = async (databaseId: string) => {
    await queryClient.invalidateQueries({
      queryKey: ['notion', 'databases', databaseId, 'records'],
      exact: false,
    })
  }

  const addRecord = useMutation({
    mutationFn: ({ databaseId, properties }: UpsertInput) =>
      lastValueFrom(useCase.createRecord(databaseId, { properties })),
    onSuccess: async (_, variables) => {
      await invalidateRecords(variables.databaseId)
    },
  })

  const editRecord = useMutation({
    mutationFn: ({ databaseId, recordId, properties }: UpdateInput) =>
      lastValueFrom(useCase.updateRecord(recordId, { properties })),
    onSuccess: async (_, variables) => {
      await invalidateRecords(variables.databaseId)
    },
  })

  const removeRecord = useMutation({
    mutationFn: ({ databaseId, recordId }: RemoveInput) =>
      lastValueFrom(useCase.deleteRecord(recordId)),
    onSuccess: async (_, variables) => {
      await invalidateRecords(variables.databaseId)
    },
  })

  return {
    addRecord,
    editRecord,
    removeRecord,
  }
}
