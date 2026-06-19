import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionPage } from '@Domain/notion/entities/notion-page.entity';
import { NotionPageProperty } from '@Domain/notion/entities/notion-page-property.entity';

/**
 * Maps a raw Notion page (row) to a clean domain entity.
 * Extracts human-readable values for every known property type.
 */
export class NotionPageMapper {
  static toDomain(raw: PageObjectResponse): NotionPage {
    const properties = Object.entries(raw.properties).map(
      ([name, prop]) => new NotionPageProperty(name, prop.type, NotionPageMapper.extractValue(prop)),
    );

    return new NotionPage(
      raw.id,
      raw.url,
      new Date(raw.created_time),
      new Date(raw.last_edited_time),
      properties,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static extractValue(prop: any): any {
    switch (prop.type) {
      case 'title':
        return prop.title.map((t: any) => t.plain_text).join('');
      case 'rich_text':
        return prop.rich_text.map((t: any) => t.plain_text).join('');
      case 'number':
        return prop.number;
      case 'select':
        return prop.select?.name ?? null;
      case 'multi_select':
        return prop.multi_select.map((s: any) => s.name);
      case 'status':
        return prop.status?.name ?? null;
      case 'date':
        return prop.date
          ? { start: prop.date.start, end: prop.date.end ?? null }
          : null;
      case 'checkbox':
        return prop.checkbox;
      case 'url':
        return prop.url;
      case 'email':
        return prop.email;
      case 'phone_number':
        return prop.phone_number;
      case 'people':
        return prop.people.map((p: any) => ({
          id: p.id,
          name: p.name ?? null,
        }));
      case 'files':
        return prop.files.map((f: any) =>
          f.type === 'external' ? f.external.url : f.file?.url ?? null,
        );
      case 'relation':
        return prop.relation.map((r: any) => r.id);
      case 'formula':
        return NotionPageMapper.extractFormulaValue(prop.formula);
      case 'rollup':
        return NotionPageMapper.extractRollupValue(prop.rollup);
      case 'unique_id':
        return prop.unique_id
          ? `${prop.unique_id.prefix ?? ''}${prop.unique_id.number}`
          : null;
      case 'created_time':
        return prop.created_time;
      case 'last_edited_time':
        return prop.last_edited_time;
      case 'created_by':
        return { id: prop.created_by.id, name: prop.created_by.name ?? null };
      case 'last_edited_by':
        return { id: prop.last_edited_by.id, name: prop.last_edited_by.name ?? null };
      default:
        return null;
    }
  }

  private static extractFormulaValue(formula: any): any {
    switch (formula?.type) {
      case 'string':  return formula.string;
      case 'number':  return formula.number;
      case 'boolean': return formula.boolean;
      case 'date':    return formula.date;
      default:        return null;
    }
  }

  private static extractRollupValue(rollup: any): any {
    switch (rollup?.type) {
      case 'number': return rollup.number;
      case 'date':   return rollup.date;
      case 'array':
        return rollup.array.map((item: any) => NotionPageMapper.extractValue(item));
      default: return null;
    }
  }
}
