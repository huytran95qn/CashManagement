/**
 * Represents a single property (column) of a Notion database.
 */
export class NotionDatabaseProperty {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
  ) {}
}
