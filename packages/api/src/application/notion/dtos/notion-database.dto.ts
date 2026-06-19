import { ApiProperty } from '@nestjs/swagger';

export class NotionDatabaseDto {
  @ApiProperty({ example: 'abc123', description: 'Notion database ID' })
  id: string;

  @ApiProperty({ example: 'My Budget', description: 'Database title' })
  title: string;

  @ApiProperty({
    example: 'https://notion.so/abc123',
    description: 'Notion database URL',
  })
  url: string;

  @ApiProperty({ description: 'ISO 8601 created time' })
  createdTime: string;

  @ApiProperty({ description: 'ISO 8601 last edited time' })
  lastEditedTime: string;
}
