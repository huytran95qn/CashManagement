import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	INotionDatabaseRepository,
	NOTION_DATABASE_REPOSITORY,
} from '@Domain/notion/repositories/notion-database.repository.interface';
import { NotionDatabaseDto } from '@Application/notion/dtos/notion-database.dto';
import { NotionDatabaseDetailDto } from '@Application/notion/dtos/notion-database-detail.dto';
import { QueryDatabaseRecordsDto } from '@Application/notion/dtos/query-database-records.dto';
import { NotionPageListDto } from '@Application/notion/dtos/notion-page.dto';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class NotionDatabaseUseCase {
	constructor(
		@Inject(NOTION_DATABASE_REPOSITORY)
		private readonly notionDatabaseRepository: INotionDatabaseRepository,
	) { }

	public getDatabases(): Observable<NotionDatabaseDto[]> {
		return this.notionDatabaseRepository
			.findAll()
			.pipe(map((databases) => databases.map((db) => this.toDatabaseDto(db))));
	}

	public getDatabaseById(id: string): Observable<NotionDatabaseDto> {
		return this.notionDatabaseRepository.findById(id).pipe(
			map((database) => {
				if (!database) {
					throw new NotFoundException(`Notion database with id "${id}" not found`);
				}

				return this.toDatabaseDto(database);
			}),
		);
	}

	public getDatabaseSchema(id: string): Observable<NotionDatabaseDetailDto> {
		return this.notionDatabaseRepository.findDetailById(id).pipe(
			map((detail) => {
				if (!detail) {
					throw new NotFoundException(`Notion database with id "${id}" not found`);
				}

				return {
					id: detail.id,
					title: detail.title,
					url: detail.url,
					createdTime: detail.createdTime.toISOString(),
					lastEditedTime: detail.lastEditedTime.toISOString(),
					properties: detail.properties.map((p) => ({
						id: p.id,
						name: p.name,
						type: p.type,
					})),
				};
			}),
		);
	}

	public queryDatabaseRecords(
		databaseId: string,
		query: QueryDatabaseRecordsDto,
	): Observable<NotionPageListDto> {
		return this.ensureDatabaseExists(databaseId).pipe(
			switchMap(() =>
				this.notionDatabaseRepository.queryRecords(databaseId, {
					pageSize: query.pageSize,
					startCursor: query.startCursor,
				}),
			),
			map((paginated) => ({
				results: paginated.results.map((page) => ({
					id: page.id,
					url: page.url,
					createdTime: page.createdTime.toISOString(),
					lastEditedTime: page.lastEditedTime.toISOString(),
					properties: page.properties.map((p) => ({
						name: p.name,
						type: p.type,
						value: p.value,
					})),
				})),
				hasMore: paginated.hasMore,
				nextCursor: paginated.nextCursor,
			})),
		);
	}

	private ensureDatabaseExists(databaseId: string): Observable<void> {
		return this.notionDatabaseRepository.findById(databaseId).pipe(
			map((exists) => {
				if (!exists) {
					throw new NotFoundException(`Notion database with id "${databaseId}" not found`);
				}
			}),
		);
	}

	protected toDatabaseDto(db: {
		id: string;
		title: string;
		url: string;
		createdTime: Date;
		lastEditedTime: Date;
	}): NotionDatabaseDto {
		return {
			id: db.id,
			title: db.title,
			url: db.url,
			createdTime: db.createdTime.toISOString(),
			lastEditedTime: db.lastEditedTime.toISOString(),
		};
	}
}