import { NotionDatabase } from '../entities/notion-database.entity';
import { NotionDatabaseDetail } from '../entities/notion-database-detail.entity';
import { NotionPage } from '../entities/notion-page.entity';
import { QueryOptions, PaginatedResult } from '../../shared/pagination.types';
import { Observable } from 'rxjs';

/**
 * Repository contract for Notion databases.
 * Defined in the Domain layer — infrastructure must implement this.
 */
export const NOTION_DATABASE_REPOSITORY = Symbol('INotionDatabaseRepository');

export interface INotionDatabaseRepository {
  /**
   * Returns all databases accessible by the configured integration token.
   */
  findAll(): Observable<NotionDatabase[]>;

  /**
   * Returns a single database by its Notion ID.
   * Resolves to null if the database is not found or not accessible.
   */
  findById(id: string): Observable<NotionDatabase | null>;

  /**
   * Returns full database detail including all property schemas.
   * Resolves to null if the database is not found or not accessible.
   */
  findDetailById(id: string): Observable<NotionDatabaseDetail | null>;

  /**
   * Queries records (pages) inside a database. Supports cursor-based pagination.
   */
  queryRecords(
    databaseId: string,
    options?: QueryOptions,
  ): Observable<PaginatedResult<NotionPage>>;

  /**
   * Creates a new record (page) inside the specified database.
   */
  createRecord(
    databaseId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>,
  ): Observable<NotionPage>;

  /**
   * Updates an existing record (page) by its page ID.
   */
  updateRecord(
    pageId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>,
  ): Observable<NotionPage>;

  /**
   * Archives (soft-deletes) a record (page) by its page ID.
   */
  deleteRecord(pageId: string): Observable<void>;
}
