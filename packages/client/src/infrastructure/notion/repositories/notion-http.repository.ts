import type { NotionDatabase, NotionDatabaseDetail } from '../../../domain/notion/entities/notion-database.entity'
import type { NotionPageList } from '../../../domain/notion/entities/notion-page.entity'
import type {
  INotionRepository,
  QueryRecordsParams,
} from '../../../domain/notion/repositories/notion.repository.interface'
import type {
  ApiNotionDatabaseDetailDto,
  ApiNotionDatabaseDto,
  ApiNotionPageListDto,
} from '../api/notion-api.types'
import { NotionDatabaseMapper } from '../mappers/notion-database.mapper'
import { NotionPageMapper } from '../mappers/notion-page.mapper'

const BASE = '/api/v1/notion/databases'

async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export class NotionHttpRepository implements INotionRepository {
  async getDatabases(): Promise<NotionDatabase[]> {
    const dtos = await httpGet<ApiNotionDatabaseDto[]>(BASE)
    return dtos.map(NotionDatabaseMapper.toDomain)
  }

  async getDatabaseById(id: string): Promise<NotionDatabase> {
    const dto = await httpGet<ApiNotionDatabaseDto>(`${BASE}/${id}`)
    return NotionDatabaseMapper.toDomain(dto)
  }

  async getDatabaseSchema(id: string): Promise<NotionDatabaseDetail> {
    const dto = await httpGet<ApiNotionDatabaseDetailDto>(`${BASE}/${id}/schema`)
    return NotionDatabaseMapper.toDetailDomain(dto)
  }

  async queryRecords(id: string, params?: QueryRecordsParams): Promise<NotionPageList> {
    const url = new URL(`${BASE}/${id}/records`, window.location.origin)
    if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize))
    if (params?.startCursor) url.searchParams.set('startCursor', params.startCursor)
    const dto = await httpGet<ApiNotionPageListDto>(url.pathname + url.search)
    return NotionPageMapper.toPageListDomain(dto)
  }
}
