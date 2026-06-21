import type { DatabasePreference } from '../domain/database-preference/entities/database-preference.entity'
import type { IDatabasePreferenceRepository } from '../domain/database-preference/repositories/database-preference.repository.interface'
import { LocalStorageDatabasePreferenceRepository } from '../infrastructure/database-preference/repositories/local-storage-database-preference.repository'
import { Inject } from '../shared/Decorators/inject.decorator'

export class DatabasePreferenceUseCase {
	constructor(
		@Inject(LocalStorageDatabasePreferenceRepository)
		private readonly repository: IDatabasePreferenceRepository,
	) {}

	public getAll(): DatabasePreference[] {
		return this.repository.getAll()
	}

	public save(preference: DatabasePreference): void {
		this.repository.upsert(preference)
	}

	public remove(id: string): void {
		this.repository.remove(id)
	}
}
