import { NotionDatabaseProperty } from './notion-database-property.entity';

/**
 * Full detail of a Notion database including its schema (properties/columns).
 */
export class NotionDatabaseDetail {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly url: string,
    public readonly createdTime: Date,
    public readonly lastEditedTime: Date,
    public readonly properties: NotionDatabaseProperty[],
  ) {}
}
