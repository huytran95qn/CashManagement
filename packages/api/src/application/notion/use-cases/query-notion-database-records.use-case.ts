import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INotionDatabaseRepository,
  NOTION_DATABASE_REPOSITORY,
} from '@Domain/notion/repositories/notion-database.repository.interface';
import { QueryDatabaseRecordsDto } from '@Application/notion/dtos/query-database-records.dto';
import { NotionPageListDto } from '@Application/notion/dtos/notion-page.dto';

@Injectable()
export class QueryNotionDatabaseRecordsUseCase {
  constructor(
    @Inject(NOTION_DATABASE_REPOSITORY)
    private readonly notionDatabaseRepository: INotionDatabaseRepository,
  ) {}

  async execute(
    databaseId: string,
    query: QueryDatabaseRecordsDto,
  ): Promise<NotionPageListDto> {
    // Verify the database exists before querying
    const exists = await this.notionDatabaseRepository.findById(databaseId);
    if (!exists) {
      throw new NotFoundException(`Notion database with id "${databaseId}" not found`);
    }

    const paginated = await this.notionDatabaseRepository.queryRecords(databaseId, {
      pageSize: query.pageSize,
      startCursor: query.startCursor,
    });

    return {
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
    };
  }
}
