/**
 * A single property value extracted from a Notion page (row).
 * `value` is the human-readable extracted value — its shape depends on `type`.
 */
export class NotionPageProperty {
  constructor(
    public readonly name: string,
    public readonly type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly value: any,
  ) {}
}
