import type { NotionDatabase } from '../../../domain/notion/entities/notion-database.entity'
import type { INotionRepository } from '../../../domain/notion/repositories/notion.repository.interface'

export class GetDatabasesUseCase {
  constructor(private readonly repository: INotionRepository) {}

  execute(): Promise<NotionDatabase[]> {
    return this.repository.getDatabases()
  }
}
