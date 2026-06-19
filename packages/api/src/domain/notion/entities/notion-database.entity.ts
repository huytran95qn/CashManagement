/**
 * Represents a Notion Database that can be linked.
 * Domain Entity — pure business object, no framework dependencies.
 */
export class NotionDatabase {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly url: string,
    public readonly createdTime: Date,
    public readonly lastEditedTime: Date,
  ) {}
}
