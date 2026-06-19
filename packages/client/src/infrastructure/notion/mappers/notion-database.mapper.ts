import type { NotionDatabase, NotionDatabaseDetail } from '../../../domain/notion/entities/notion-database.entity'
import type {
  ApiNotionDatabaseDetailDto,
  ApiNotionDatabaseDto,
} from '../api/notion-api.types'

export const NotionDatabaseMapper = {
  toDomain(dto: ApiNotionDatabaseDto): NotionDatabase {
    return {
      id: dto.id,
      title: dto.title,
      url: dto.url,
      createdTime: dto.createdTime,
      lastEditedTime: dto.lastEditedTime,
    }
  },

  toDetailDomain(dto: ApiNotionDatabaseDetailDto): NotionDatabaseDetail {
    return {
      id: dto.id,
      title: dto.title,
      url: dto.url,
      createdTime: dto.createdTime,
      lastEditedTime: dto.lastEditedTime,
      properties: dto.properties.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
      })),
    }
  },
}
