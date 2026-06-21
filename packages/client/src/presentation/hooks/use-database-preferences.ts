import { useCallback, useState } from 'react'
import type { DatabasePreference } from '../../domain/database-preference/entities/database-preference.entity'
import { useRefInstance } from './use-ref-instance'
import { DatabasePreferenceUseCase } from '../../application/database-preference.use-case'

export function useDatabasePreferences() {
	const useCase = useRefInstance(DatabasePreferenceUseCase)

	const [preferences, setPreferences] = useState<DatabasePreference[]>(() =>
		useCase.getAll()
	)

	const refresh = useCallback(() => {
		setPreferences(useCase.getAll())
	}, [])

	const save = useCallback(
		(preference: DatabasePreference) => {
			useCase.save(preference)
			refresh()
		},
		[refresh],
	)

	const remove = useCallback(
		(id: string) => {
			useCase.remove(id)
			refresh()
		},
		[refresh],
	)

	return { preferences, save, remove }
}
