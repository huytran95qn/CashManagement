import { Injectable } from '@nestjs/common';
import { isFullDatabase, isFullPage } from '@notionhq/client';
import { INotionDatabaseRepository } from '@Domain/notion/repositories/notion-database.repository.interface';
import { NotionDatabase } from '@Domain/notion/entities/notion-database.entity';
import { NotionDatabaseDetail } from '@Domain/notion/entities/notion-database-detail.entity';
import { NotionPage } from '@Domain/notion/entities/notion-page.entity';
import { QueryOptions, PaginatedResult } from '@Domain/shared/pagination.types';
import { NotionClientProvider } from '@Infrastructure/notion/providers/notion-client.provider';
import { NotionDatabaseMapper } from '@Infrastructure/notion/mappers/notion-database.mapper';
import { NotionPageMapper } from '@Infrastructure/notion/mappers/notion-page.mapper';
import { EMPTY, Observable, defer, from, of, throwError } from 'rxjs';
import { catchError, expand, filter, map, mergeMap, toArray } from 'rxjs/operators';

/**
 * Concrete implementation of INotionDatabaseRepository.
 * Queries the Notion Search API filtering for database objects.
 */
@Injectable()
export class NotionDatabaseRepository implements INotionDatabaseRepository {
	constructor(private readonly notionClientProvider: NotionClientProvider) {}

	public findAll(): Observable<NotionDatabase[]> {
		return defer(() =>
			from(
				this.notionClientProvider.client.search({
					filter: { value: 'database', property: 'object' },
					page_size: 100,
				}),
			),
		).pipe(
			expand((response) => {
				if (!response.has_more || !response.next_cursor) {
					return EMPTY;
				}

				return from(
					this.notionClientProvider.client.search({
						filter: { value: 'database', property: 'object' },
						page_size: 100,
						start_cursor: response.next_cursor,
					}),
				);
			}),
			mergeMap((response) => from(response.results)),
			filter(isFullDatabase),
			map((database) => NotionDatabaseMapper.toDomain(database)),
			toArray(),
		);
	}

	public findById(id: string): Observable<NotionDatabase | null> {
		return defer(() =>
			from(
				this.notionClientProvider.client.databases.retrieve({
					database_id: id,
				}),
			),
		).pipe(
			map((response) => {
				if (!isFullDatabase(response)) {
					return null;
				}

				return NotionDatabaseMapper.toDomain(response);
			}),
			catchError((error: any) => {
				if (error?.code === 'object_not_found') {
					return of(null);
				}

				return throwError(() => error);
			}),
		);
	}

	public findDetailById(id: string): Observable<NotionDatabaseDetail | null> {
		return defer(() =>
			from(
				this.notionClientProvider.client.databases.retrieve({
					database_id: id,
				}),
			),
		).pipe(
			map((response) => {
				if (!isFullDatabase(response)) {
					return null;
				}

				return NotionDatabaseMapper.toDetailDomain(response);
			}),
			catchError((error: any) => {
				if (error?.code === 'object_not_found') {
					return of(null);
				}

				return throwError(() => error);
			}),
		);
	}

	public queryRecords(
		databaseId: string,
		options?: QueryOptions,
	): Observable<PaginatedResult<NotionPage>> {
		return defer(() =>
			from(
				this.notionClientProvider.client.databases.query({
					database_id: databaseId,
					page_size: options?.pageSize ?? 20,
					...(options?.startCursor ? { start_cursor: options.startCursor } : {}),
				}),
			),
		).pipe(
			map((response) => ({
				results: response.results
					.filter(isFullPage)
					.map((page) => NotionPageMapper.toDomain(page)),
				hasMore: response.has_more,
				nextCursor: response.next_cursor ?? null,
			})),
		);
	}
}
