import { Module } from '@nestjs/common';
import { NotionDatabaseController } from '@Presentation/notion/controllers/notion-database.controller';
import { NotionDatabaseUseCase } from '@Application/notion/use-cases/notion-database.use-case';
import { NotionDatabaseRepository } from '@Infrastructure/notion/repositories/notion-database.repository';
import { NotionClientProvider } from '@Infrastructure/notion/providers/notion-client.provider';
import { NOTION_DATABASE_REPOSITORY } from '@Domain/notion/repositories/notion-database.repository.interface';

@Module({
  controllers: [NotionDatabaseController],
  providers: [
    NotionClientProvider,
    {
      provide: NOTION_DATABASE_REPOSITORY,
      useClass: NotionDatabaseRepository
    },
    NotionDatabaseUseCase
  ],
})
export class NotionModule {}
