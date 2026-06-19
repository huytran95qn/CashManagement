import { Inject, Injectable } from '@nestjs/common';
import {
  INotionDatabaseRepository,
  NOTION_DATABASE_REPOSITORY,
} from '@Domain/notion/repositories/notion-database.repository.interface';
import { NotionDatabaseDto } from '@Application/notion/dtos/notion-database.dto';

/**
 * Use case: retrieve all linkable Notion databases.
 * Orchestrates domain logic and maps to the DTO consumed by the presentation layer.
 */
@Injectable()
export class GetNotionDatabasesUseCase {
  constructor(
    @Inject(NOTION_DATABASE_REPOSITORY)
    private readonly notionDatabaseRepository: INotionDatabaseRepository,
  ) {}

  async execute(): Promise<NotionDatabaseDto[]> {
    const databases = await this.notionDatabaseRepository.findAll();

    return databases.map((db) => ({
      id: db.id,
      title: db.title,
      url: db.url,
      createdTime: db.createdTime.toISOString(),
      lastEditedTime: db.lastEditedTime.toISOString(),
    }));
  }
}
