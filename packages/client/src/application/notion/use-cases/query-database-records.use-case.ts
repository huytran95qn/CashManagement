import type { NotionPageList } from '../../../domain/notion/entities/notion-page.entity'
import type {
  INotionRepository,
  QueryRecordsParams,
} from '../../../domain/notion/repositories/notion.repository.interface'

export class QueryDatabaseRecordsUseCase {
  constructor(private readonly repository: INotionRepository) {}

  execute(id: string, params?: QueryRecordsParams): Promise<NotionPageList> {
    return this.repository.queryRecords(id, params)
  }
}
