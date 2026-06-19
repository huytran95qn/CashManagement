import type { NotionDatabaseDetail } from '../../../domain/notion/entities/notion-database.entity'
import type { INotionRepository } from '../../../domain/notion/repositories/notion.repository.interface'

export class GetDatabaseSchemaUseCase {
  constructor(private readonly repository: INotionRepository) {}

  execute(id: string): Promise<NotionDatabaseDetail> {
    return this.repository.getDatabaseSchema(id)
  }
}
