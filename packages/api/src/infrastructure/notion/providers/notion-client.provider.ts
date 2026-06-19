import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';

/**
 * Wraps the official Notion SDK client.
 * Reads NOTION_TOKEN from environment via ConfigService.
 */
@Injectable()
export class NotionClientProvider {
  public readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.getOrThrow<string>('NOTION_TOKEN');
    this.client = new Client({ auth: token });
  }
}
