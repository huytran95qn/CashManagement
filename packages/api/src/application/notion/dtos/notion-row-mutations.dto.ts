import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class CreateNotionRowDto {
	@ApiProperty({
		description:
			'Notion property values keyed by property name. ' +
			'Shape of each value must match the Notion property type defined in the database schema.',
		example: {
			Name: { title: [{ text: { content: 'Monthly Budget' } }] },
			Status: { select: { name: 'Active' } },
			Amount: { number: 1500 },
		},
	})
	@IsObject()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	properties!: Record<string, any>;
}

export class UpdateNotionRowDto {
	@ApiProperty({
		description:
			'Partial property values to update, keyed by property name. ' +
			'Only the provided properties will be changed.',
		example: {
			Status: { select: { name: 'Done' } },
			Amount: { number: 2000 },
		},
	})
	@IsObject()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	properties!: Record<string, any>;
}
