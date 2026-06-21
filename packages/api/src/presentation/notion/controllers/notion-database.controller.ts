import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotionDatabaseUseCase } from '@Application/notion/use-cases/notion-database.use-case';
import { NotionDatabaseDto } from '@Application/notion/dtos/notion-database.dto';
import { NotionDatabaseDetailDto } from '@Application/notion/dtos/notion-database-detail.dto';
import { NotionPageDto, NotionPageListDto } from '@Application/notion/dtos/notion-page.dto';
import { QueryDatabaseRecordsDto } from '@Application/notion/dtos/query-database-records.dto';
import { CreateNotionRowDto, UpdateNotionRowDto } from '@Application/notion/dtos/notion-row-mutations.dto';
import { Observable } from 'rxjs';

@ApiTags('Notion')
@Controller('notion/databases')
export class NotionDatabaseController {
	constructor(private readonly notionDatabaseUseCase: NotionDatabaseUseCase) { }

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'List all linkable Notion databases',
		description:
			'Returns every database accessible by the configured NOTION_TOKEN integration.',
	})
	@ApiResponse({
		status: 200,
		description: 'List of accessible Notion databases',
		type: [NotionDatabaseDto],
	})
	public getDatabases(): Observable<NotionDatabaseDto[]> {
		return this.notionDatabaseUseCase.getDatabases();
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get a Notion database by ID',
		description: 'Returns a single database accessible by the configured NOTION_TOKEN integration.',
	})
	@ApiParam({ name: 'id', description: 'Notion database ID' })
	@ApiResponse({
		status: 200,
		description: 'Notion database details',
		type: NotionDatabaseDto,
	})
	@ApiResponse({ status: 404, description: 'Database not found' })
	public getDatabaseById(@Param('id') id: string): Observable<NotionDatabaseDto> {
		return this.notionDatabaseUseCase.getDatabaseById(id);
	}

	@Get(':id/schema')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get schema of a Notion database',
		description: 'Returns the full property schema (columns and their types) of a specific Notion database.',
	})
	@ApiParam({ name: 'id', description: 'Notion database ID' })
	@ApiResponse({
		status: 200,
		description: 'Database schema with all properties',
		type: NotionDatabaseDetailDto,
	})
	@ApiResponse({ status: 404, description: 'Database not found' })
	public getDatabaseSchema(@Param('id') id: string): Observable<NotionDatabaseDetailDto> {
		return this.notionDatabaseUseCase.getDatabaseSchema(id);
	}

	@Get(':id/records')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Query records from a Notion database',
		description:
			'Returns paginated rows/pages stored inside the specified Notion database. ' +
			'Each record includes all its property values, extracted to human-readable format.',
	})
	@ApiParam({ name: 'id', description: 'Notion database ID' })
	@ApiQuery({ name: 'pageSize', required: false, type: Number, example: 20 })
	@ApiQuery({ name: 'startCursor', required: false, type: String, description: 'Pagination cursor from previous response' })
	@ApiResponse({
		status: 200,
		description: 'Paginated list of database records',
		type: NotionPageListDto,
	})
	@ApiResponse({ status: 404, description: 'Database not found' })
	public getDatabaseRecords(
		@Param('id') id: string,
		@Query() query: QueryDatabaseRecordsDto,
	): Observable<NotionPageListDto> {
		return this.notionDatabaseUseCase.queryDatabaseRecords(id, query);
	}

	@Post(':id/records')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Create a new row in a Notion database',
		description:
			'Creates a new page (row) inside the specified database. ' +
			'Property values must match the schema defined in the target database.',
	})
	@ApiParam({ name: 'id', description: 'Notion database ID' })
	@ApiResponse({ status: 201, description: 'Newly created row', type: NotionPageDto })
	@ApiResponse({ status: 404, description: 'Database not found' })
	public createRow(
		@Param('id') id: string,
		@Body() dto: CreateNotionRowDto,
	): Observable<NotionPageDto> {
		return this.notionDatabaseUseCase.createRow(id, dto);
	}

	@Patch(':id/records/:rowId')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Edit an existing row in a Notion database',
		description:
			'Updates the specified page (row) with the provided property values. ' +
			'Only the supplied properties are changed; others are left untouched.',
	})
	@ApiParam({ name: 'id', description: 'Notion database ID' })
	@ApiParam({ name: 'rowId', description: 'Notion page (row) ID' })
	@ApiResponse({ status: 200, description: 'Updated row', type: NotionPageDto })
	@ApiResponse({ status: 404, description: 'Row not found' })
	public updateRow(
		@Param('rowId') rowId: string,
		@Body() dto: UpdateNotionRowDto,
	): Observable<NotionPageDto> {
		return this.notionDatabaseUseCase.updateRow(rowId, dto);
	}

	@Delete(':id/records/:rowId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Remove a row from a Notion database',
		description: 'Archives (soft-deletes) the specified page (row). The record is no longer accessible via the API.',
	})
	@ApiParam({ name: 'id', description: 'Notion database ID' })
	@ApiParam({ name: 'rowId', description: 'Notion page (row) ID' })
	@ApiResponse({ status: 204, description: 'Row archived successfully' })
	@ApiResponse({ status: 404, description: 'Row not found' })
	public deleteRow(@Param('rowId') rowId: string): Observable<void> {
		return this.notionDatabaseUseCase.deleteRow(rowId);
	}
}
