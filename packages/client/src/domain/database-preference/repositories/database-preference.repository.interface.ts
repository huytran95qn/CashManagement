import type { DatabasePreference } from '../entities/database-preference.entity'

export interface IDatabasePreferenceRepository {
	getAll(): DatabasePreference[]
	upsert(preference: DatabasePreference): void
	remove(id: string): void
}
