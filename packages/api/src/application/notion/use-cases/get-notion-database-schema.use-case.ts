import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INotionDatabaseRepository,
  NOTION_DATABASE_REPOSITORY,
} from '@Domain/notion/repositories/notion-database.repository.interface';
import { NotionDatabaseDetailDto } from '@Application/notion/dtos/notion-database-detail.dto';

@Injectable()
export class GetNotionDatabaseSchemaUseCase {
  constructor(
    @Inject(NOTION_DATABASE_REPOSITORY)
    private readonly notionDatabaseRepository: INotionDatabaseRepository,
  ) {}

  async execute(id: string): Promise<NotionDatabaseDetailDto> {
    const detail = await this.notionDatabaseRepository.findDetailById(id);

    if (!detail) {
      throw new NotFoundException(`Notion database with id "${id}" not found`);
    }

    return {
      id: detail.id,
      title: detail.title,
      url: detail.url,
      createdTime: detail.createdTime.toISOString(),
      lastEditedTime: detail.lastEditedTime.toISOString(),
      properties: detail.properties.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
      })),
    };
  }
}
