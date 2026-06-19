import { NotionDatabase } from '../entities/notion-database.entity';
import { NotionDatabaseDetail } from '../entities/notion-database-detail.entity';
import { NotionPage } from '../entities/notion-page.entity';
import { QueryOptions, PaginatedResult } from '../../shared/pagination.types';

/**
 * Repository contract for Notion databases.
 * Defined in the Domain layer — infrastructure must implement this.
 */
export const NOTION_DATABASE_REPOSITORY = Symbol('INotionDatabaseRepository');

export interface INotionDatabaseRepository {
  /**
   * Returns all databases accessible by the configured integration token.
   */
  findAll(): Promise<NotionDatabase[]>;

  /**
   * Returns a single database by its Notion ID.
   * Resolves to null if the database is not found or not accessible.
   */
  findById(id: string): Promise<NotionDatabase | null>;

  /**
   * Returns full database detail including all property schemas.
   * Resolves to null if the database is not found or not accessible.
   */
  findDetailById(id: string): Promise<NotionDatabaseDetail | null>;

  /**
   * Queries records (pages) inside a database. Supports cursor-based pagination.
   */
  queryRecords(
    databaseId: string,
    options?: QueryOptions,
  ): Promise<PaginatedResult<NotionPage>>;
}
