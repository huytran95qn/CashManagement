export interface NotionDatabase {
  id: string
  title: string
  url: string
  createdTime: string
  lastEditedTime: string
}

export interface NotionDatabaseProperty {
  id: string
  name: string
  type: string
}

export interface NotionDatabaseDetail extends NotionDatabase {
  properties: NotionDatabaseProperty[]
}
