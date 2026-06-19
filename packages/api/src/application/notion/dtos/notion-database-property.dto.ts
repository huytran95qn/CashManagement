import { ApiProperty } from '@nestjs/swagger';

export class NotionDatabasePropertyDto {
  @ApiProperty({ example: 'title', description: 'Notion internal property ID' })
  id: string;

  @ApiProperty({ example: 'Name', description: 'Display name of the property' })
  name: string;

  @ApiProperty({
    example: 'title',
    description:
      'Notion property type (title, rich_text, number, select, multi_select, date, checkbox, url, email, phone_number, files, people, relation, rollup, formula, created_time, created_by, last_edited_time, last_edited_by, status, unique_id)',
  })
  type: string;
}
