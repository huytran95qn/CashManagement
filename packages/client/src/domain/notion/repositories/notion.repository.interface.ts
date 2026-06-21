import { Observable } from 'rxjs'
import type { NotionDatabase, NotionDatabaseDetail } from '../entities/notion-database.entity'
import type { NotionPageList } from '../entities/notion-page.entity'

export interface QueryRecordsParams {
	pageSize?: number
	startCursor?: string
}

export interface INotionHttpRepository {
	getDatabases(): Observable<NotionDatabase[]>
	getDatabaseById(id: string): Observable<NotionDatabase>
	getDatabaseSchema(id: string): Observable<NotionDatabaseDetail>
	queryRecords(id: string, params?: QueryRecordsParams): Observable<NotionPageList>
}
