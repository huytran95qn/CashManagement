import { NotionPageProperty } from './notion-page-property.entity';

/**
 * Represents a single record (row / page) inside a Notion database.
 */
export class NotionPage {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly createdTime: Date,
    public readonly lastEditedTime: Date,
    public readonly properties: NotionPageProperty[],
  ) {}
}
