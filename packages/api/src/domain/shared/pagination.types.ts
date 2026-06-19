export interface QueryOptions {
  pageSize?: number;
  startCursor?: string;
}

export interface PaginatedResult<T> {
  results: T[];
  hasMore: boolean;
  nextCursor: string | null;
}
