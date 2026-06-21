import { map, Observable } from 'rxjs'
import type { NotionDatabase, NotionDatabaseDetail } from '../../../domain/notion/entities/notion-database.entity'
import type { NotionPage, NotionPageList } from '../../../domain/notion/entities/notion-page.entity'
import type {
	INotionHttpRepository,
	QueryRecordsParams,
	UpsertRecordPayload,
} from '../../../domain/notion/repositories/notion.repository.interface'
import type {
	ApiNotionDatabaseDetailDto,
	ApiNotionDatabaseDto,
	ApiNotionPageDto,
	ApiNotionPageListDto,
	ApiUpsertNotionRecordDto,
} from '../api/notion-api.types'
import { NotionDatabaseMapper } from '../mappers/notion-database.mapper'
import { NotionPageMapper } from '../mappers/notion-page.mapper'
import { Inject } from '../../../shared/Decorators/inject.decorator'
import { HttpRequest, type IHttpRequest } from '../httpRequest/http-request'

export class NotionHttpRepository implements INotionHttpRepository {
	private base = '/api/v1/notion/databases'

	constructor(
		@Inject(HttpRequest)
		private readonly httpRequest: IHttpRequest
	) {}

	public getDatabases(): Observable<NotionDatabase[]> {
		return this.httpRequest.get<ApiNotionDatabaseDto[]>(this.base).pipe(
			map(dtos => dtos.map(dto => NotionDatabaseMapper.toDomain(dto))
		));
	}

	public getDatabaseById(id: string): Observable<NotionDatabase> {
		return this.httpRequest.get<ApiNotionDatabaseDto>(`${this.base}/${id}`).pipe(
			map(dto => NotionDatabaseMapper.toDomain(dto))
		);
	}

	public getDatabaseSchema(id: string): Observable<NotionDatabaseDetail> {
		return this.httpRequest.get<ApiNotionDatabaseDetailDto>(`${this.base}/${id}/schema`).pipe(
			map(dto => NotionDatabaseMapper.toDetailDomain(dto))
		);
	}

	public queryRecords(id: string, params?: QueryRecordsParams): Observable<NotionPageList> {
		const url = new URL(`${this.base}/${id}/records`, window.location.origin);
		if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize));
		if (params?.startCursor) url.searchParams.set('startCursor', params.startCursor);

		return this.httpRequest.get<ApiNotionPageListDto>(url.pathname + url.search).pipe(
			map(dto => NotionPageMapper.toPageListDomain(dto))
		);
	}

	public createRecord(databaseId: string, payload: UpsertRecordPayload): Observable<NotionPage> {
		return this.httpRequest
			.post<ApiNotionPageDto>(`${this.base}/${databaseId}/records`, payload as ApiUpsertNotionRecordDto)
			.pipe(map(dto => NotionPageMapper.toDomain(dto)));
	}

	public updateRecord(databaseId: string, recordId: string, payload: UpsertRecordPayload): Observable<NotionPage> {
		return this.httpRequest
			.patch<ApiNotionPageDto>(`${this.base}/${databaseId}/records/${recordId}`, payload as ApiUpsertNotionRecordDto)
			.pipe(map(dto => NotionPageMapper.toDomain(dto)));
	}

	public deleteRecord(databaseId: string, recordId: string): Observable<void> {
		return this.httpRequest.delete(`${this.base}/${databaseId}/records/${recordId}`);
	}
}
