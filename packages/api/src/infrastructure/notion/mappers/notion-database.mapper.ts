import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionDatabase } from '@Domain/notion/entities/notion-database.entity';
import { NotionDatabaseDetail } from '@Domain/notion/entities/notion-database-detail.entity';
import { NotionDatabaseProperty } from '@Domain/notion/entities/notion-database-property.entity';

/**
 * Maps raw Notion API response objects to clean domain entities.
 */
export class NotionDatabaseMapper {
  static toDomain(raw: DatabaseObjectResponse): NotionDatabase {
    const titleParts = raw.title ?? [];
    const title = titleParts.map((t) => t.plain_text).join('') || 'Untitled';

    return new NotionDatabase(
      raw.id,
      title,
      raw.url,
      new Date(raw.created_time),
      new Date(raw.last_edited_time),
    );
  }

  static toDetailDomain(raw: DatabaseObjectResponse): NotionDatabaseDetail {
    const titleParts = raw.title ?? [];
    const title = titleParts.map((t) => t.plain_text).join('') || 'Untitled';

    const properties = Object.entries(raw.properties).map(
      ([name, prop]) => new NotionDatabaseProperty(prop.id, name, prop.type),
    );

    return new NotionDatabaseDetail(
      raw.id,
      title,
      raw.url,
      new Date(raw.created_time),
      new Date(raw.last_edited_time),
      properties,
    );
  }
}

