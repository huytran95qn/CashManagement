import { ApiProperty } from '@nestjs/swagger';

export class NotionPagePropertyDto {
	@ApiProperty({ example: 'Name' })
	name: string;

	@ApiProperty({ example: 'title' })
	type: string;

	@ApiProperty({
		description: 'Extracted vadlue — shape depends on property type',
		example: 'Monthly Budget',
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
}

export class NotionPageDto {
	@ApiProperty({ example: 'abc-123' })
	id: string;

	@ApiProperty({ example: 'https://notion.so/...' })
	url: string;

	@ApiProperty()
	createdTime: string;

	@ApiProperty()
	lastEditedTime: string;

	@ApiProperty({ type: [NotionPagePropertyDto] })
	properties: NotionPagePropertyDto[];
}

export class NotionPageListDto {
	@ApiProperty({ type: [NotionPageDto] })
	results: NotionPageDto[];

	@ApiProperty({ example: false })
	hasMore: boolean;

	@ApiProperty({ example: null, nullable: true })
	nextCursor: string | null;
}
