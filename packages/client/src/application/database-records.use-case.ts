import { Observable } from 'rxjs'
import { NotionDatabase, NotionDatabaseDetail } from '../domain/notion/entities/notion-database.entity'
import type { NotionPage, NotionPageList } from '../domain/notion/entities/notion-page.entity'
import type {
	INotionHttpRepository,
	QueryRecordsParams,
	UpsertRecordPayload,
} from '../domain/notion/repositories/notion.repository.interface'
import { Inject } from '../shared/Decorators/inject.decorator'
import { NotionHttpRepository } from '../infrastructure/notion/repositories/notion-http.repository'

export class DatabaseRecordsUseCase {
	constructor(
		@Inject(NotionHttpRepository)
		private readonly repository: INotionHttpRepository
	) { }

	public getDatabaseById(id: string): Observable<NotionDatabase> {
		return this.repository.getDatabaseById(id)
	}

	public getDatabaseSchema(id: string): Observable<NotionDatabaseDetail> {
		return this.repository.getDatabaseSchema(id)
	}

	public getDatabases(): Observable<NotionDatabase[]> {
		return this.repository.getDatabases()
	}

	public queryRecords(
		id: string,
		params?: QueryRecordsParams
	): Observable<NotionPageList> {
		return this.repository.queryRecords(id, params)
	}

	public createRecord(databaseId: string, payload: UpsertRecordPayload): Observable<NotionPage> {
		return this.repository.createRecord(databaseId, payload)
	}

	public updateRecord(recordId: string, payload: UpsertRecordPayload): Observable<NotionPage> {
		return this.repository.updateRecord(recordId, payload)
	}

	public deleteRecord(recordId: string): Observable<void> {
		return this.repository.deleteRecord(recordId)
	}
}
