import { Observable } from 'rxjs'
import { NotionDatabase, NotionDatabaseDetail } from '../domain/notion/entities/notion-database.entity'
import type { NotionPageList } from '../domain/notion/entities/notion-page.entity'
import type {
	INotionHttpRepository,
	QueryRecordsParams,
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
}
