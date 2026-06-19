/** Raw shapes returned by the NestJS API – infrastructure concern only. */

export interface ApiNotionDatabaseDto {
  id: string
  title: string
  url: string
  createdTime: string
  lastEditedTime: string
}

export interface ApiNotionDatabasePropertyDto {
  id: string
  name: string
  type: string
}

export interface ApiNotionDatabaseDetailDto extends ApiNotionDatabaseDto {
  properties: ApiNotionDatabasePropertyDto[]
}

export interface ApiNotionPagePropertyDto {
  name: string
  type: string
  value: unknown
}

export interface ApiNotionPageDto {
  id: string
  url: string
  createdTime: string
  lastEditedTime: string
  properties: ApiNotionPagePropertyDto[]
}

export interface ApiNotionPageListDto {
  results: ApiNotionPageDto[]
  hasMore: boolean
  nextCursor: string | null
}
