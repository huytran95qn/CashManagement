import type { NotionPage, NotionPageList } from '../../../domain/notion/entities/notion-page.entity'
import type { ApiNotionPageDto, ApiNotionPageListDto } from '../api/notion-api.types'

export const NotionPageMapper = {
  toDomain(dto: ApiNotionPageDto): NotionPage {
    return {
      id: dto.id,
      url: dto.url,
      createdTime: dto.createdTime,
      lastEditedTime: dto.lastEditedTime,
      properties: dto.properties.map((p) => ({
        name: p.name,
        type: p.type,
        value: p.value,
      })),
    }
  },

  toPageListDomain(dto: ApiNotionPageListDto): NotionPageList {
    return {
      results: dto.results.map(NotionPageMapper.toDomain),
      hasMore: dto.hasMore,
      nextCursor: dto.nextCursor,
    }
  },
}
