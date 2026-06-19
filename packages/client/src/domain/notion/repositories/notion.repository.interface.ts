import type { NotionDatabase, NotionDatabaseDetail } from '../entities/notion-database.entity'
import type { NotionPageList } from '../entities/notion-page.entity'

export interface QueryRecordsParams {
  pageSize?: number
  startCursor?: string
}

export interface INotionRepository {
  getDatabases(): Promise<NotionDatabase[]>
  getDatabaseById(id: string): Promise<NotionDatabase>
  getDatabaseSchema(id: string): Promise<NotionDatabaseDetail>
  queryRecords(id: string, params?: QueryRecordsParams): Promise<NotionPageList>
}
