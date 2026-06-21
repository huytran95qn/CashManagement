import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotionDatabaseUseCase } from '@Application/notion/use-cases/notion-database.use-case';
import { NotionDatabaseDto } from '@Application/notion/dtos/notion-database.dto';
import { NotionDatabaseDetailDto } from '@Application/notion/dtos/notion-database-detail.dto';
import { NotionPageListDto } from '@Application/notion/dtos/notion-page.dto';
import { QueryDatabaseRecordsDto } from '@Application/notion/dtos/query-database-records.dto';
import { Observable } from 'rxjs';

@ApiTags('Notion')
@Controller('notion/databases')
export class NotionDatabaseController {
  constructor(private readonly notionDatabaseUseCase: NotionDatabaseUseCase) {}

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
}
