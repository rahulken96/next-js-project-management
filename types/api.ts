// types/api.ts

// Discriminated Union: success boolean menjadi discriminator pembeda
export type ApiResult<T> =
    | {
          success: true;
          data: T;
          message?: string;
      }
    | {
          success: false;
          error: string;
          fieldErrors?: Record<string, string[]>;
      };

// Generic Pagination Wrapper
export interface PaginatedResult<T> {
    items: T[];
    meta: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
    };
}
