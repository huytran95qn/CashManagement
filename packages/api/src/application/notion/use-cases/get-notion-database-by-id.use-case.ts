import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INotionDatabaseRepository,
  NOTION_DATABASE_REPOSITORY,
} from '@Domain/notion/repositories/notion-database.repository.interface';
import { NotionDatabaseDto } from '@Application/notion/dtos/notion-database.dto';

@Injectable()
export class GetNotionDatabaseByIdUseCase {
  constructor(
    @Inject(NOTION_DATABASE_REPOSITORY)
    private readonly notionDatabaseRepository: INotionDatabaseRepository,
  ) {}

  async execute(id: string): Promise<NotionDatabaseDto> {
    const database = await this.notionDatabaseRepository.findById(id);

    if (!database) {
      throw new NotFoundException(`Notion database with id "${id}" not found`);
    }

    return {
      id: database.id,
      title: database.title,
      url: database.url,
      createdTime: database.createdTime.toISOString(),
      lastEditedTime: database.lastEditedTime.toISOString(),
    };
  }
}
