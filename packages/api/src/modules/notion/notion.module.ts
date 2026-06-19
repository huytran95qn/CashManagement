import { Module } from '@nestjs/common';
import { NotionDatabaseController } from '@Presentation/notion/controllers/notion-database.controller';
import { GetNotionDatabasesUseCase } from '@Application/notion/use-cases/get-notion-databases.use-case';
import { GetNotionDatabaseByIdUseCase } from '@Application/notion/use-cases/get-notion-database-by-id.use-case';
import { GetNotionDatabaseSchemaUseCase } from '@Application/notion/use-cases/get-notion-database-schema.use-case';
import { QueryNotionDatabaseRecordsUseCase } from '@Application/notion/use-cases/query-notion-database-records.use-case';
import { NotionDatabaseRepository } from '@Infrastructure/notion/repositories/notion-database.repository';
import { NotionClientProvider } from '@Infrastructure/notion/providers/notion-client.provider';
import { NOTION_DATABASE_REPOSITORY } from '@Domain/notion/repositories/notion-database.repository.interface';

@Module({
  controllers: [NotionDatabaseController],
  providers: [
    NotionClientProvider,
    {
      provide: NOTION_DATABASE_REPOSITORY,
      useClass: NotionDatabaseRepository,
    },
    GetNotionDatabasesUseCase,
    GetNotionDatabaseByIdUseCase,
    GetNotionDatabaseSchemaUseCase,
    QueryNotionDatabaseRecordsUseCase,
  ],
})
export class NotionModule {}
