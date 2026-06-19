export interface NotionPageProperty {
  name: string
  type: string
  value: unknown
}

export interface NotionPage {
  id: string
  url: string
  createdTime: string
  lastEditedTime: string
  properties: NotionPageProperty[]
}

export interface NotionPageList {
  results: NotionPage[]
  hasMore: boolean
  nextCursor: string | null
}
