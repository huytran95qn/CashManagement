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

/**
 * Concrete implementation of INotionDatabaseRepository.
 * Queries the Notion Search API filtering for database objects.
 */
@Injectable()
export class NotionDatabaseRepository implements INotionDatabaseRepository {
  constructor(private readonly notionClientProvider: NotionClientProvider) {}

  async findAll(): Promise<NotionDatabase[]> {
    const results: NotionDatabase[] = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await this.notionClientProvider.client.search({
        filter: { value: 'database', property: 'object' },
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      });

      for (const result of response.results) {
        if (isFullDatabase(result)) {
          results.push(NotionDatabaseMapper.toDomain(result));
        }
      }

      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return results;
  }

  async findById(id: string): Promise<NotionDatabase | null> {
    try {
      const response = await this.notionClientProvider.client.databases.retrieve({
        database_id: id,
      });

      if (!isFullDatabase(response)) {
        return null;
      }

      return NotionDatabaseMapper.toDomain(response);
    } catch (error: any) {
      if (error?.code === 'object_not_found') {
        return null;
      }
      throw error;
    }
  }

  async findDetailById(id: string): Promise<NotionDatabaseDetail | null> {
    try {
      const response = await this.notionClientProvider.client.databases.retrieve({
        database_id: id,
      });

      if (!isFullDatabase(response)) {
        return null;
      }

      return NotionDatabaseMapper.toDetailDomain(response);
    } catch (error: any) {
      if (error?.code === 'object_not_found') {
        return null;
      }
      throw error;
    }
  }

  async queryRecords(
    databaseId: string,
    options?: QueryOptions,
  ): Promise<PaginatedResult<NotionPage>> {
    const response = await this.notionClientProvider.client.databases.query({
      database_id: databaseId,
      page_size: options?.pageSize ?? 20,
      ...(options?.startCursor ? { start_cursor: options.startCursor } : {}),
    });

    const results = response.results
      .filter(isFullPage)
      .map((page) => NotionPageMapper.toDomain(page));

    return {
      results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor ?? null,
    };
  }
}
