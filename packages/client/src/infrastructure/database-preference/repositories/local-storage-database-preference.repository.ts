import type { DatabasePreference } from '../../../domain/database-preference/entities/database-preference.entity'
import type { IDatabasePreferenceRepository } from '../../../domain/database-preference/repositories/database-preference.repository.interface'

const STORAGE_KEY = 'cm:database_preferences'

export class LocalStorageDatabasePreferenceRepository
  implements IDatabasePreferenceRepository
{
  getAll(): DatabasePreference[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as DatabasePreference[]) : []
    } catch {
      return []
    }
  }

  upsert(preference: DatabasePreference): void {
    const all = this.getAll()
    const idx = all.findIndex((p) => p.id === preference.id)
    if (idx >= 0) all[idx] = preference
    else all.push(preference)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  }

  remove(id: string): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.getAll().filter((p) => p.id !== id)),
    )
  }
}
