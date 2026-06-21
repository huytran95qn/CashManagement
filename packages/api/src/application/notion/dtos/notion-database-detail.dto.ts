import { ApiProperty } from '@nestjs/swagger';
import { NotionDatabasePropertyDto } from './notion-database-property.dto';

export class NotionDatabaseDetailDto {
  @ApiProperty({ example: 'abc123' })
  id!: string;

  @ApiProperty({ example: 'My Budget' })
  title!: string;

  @ApiProperty({ example: 'https://notion.so/abc123' })
  url!: string;

  @ApiProperty()
  createdTime!: string;

  @ApiProperty()
  lastEditedTime!: string;

  @ApiProperty({
    type: [NotionDatabasePropertyDto],
    description: 'All property schemas (columns) defined in this database',
  })
  properties!: NotionDatabasePropertyDto[];
}
