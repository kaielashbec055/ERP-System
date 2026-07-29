import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function getPagination(req: Request, defaultLimit = 20, maxLimit = 100): PaginationParams {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const rawLimit = parseInt(String(req.query.limit ?? String(defaultLimit)), 10) || defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginatedMeta(
  totalItems: number,
  { page, limit }: PaginationParams,
): PaginatedMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function getSort(req: Request, allowedFields: string[], defaultField = 'createdAt') {
  const sortBy = String(req.query.sortBy ?? defaultField);
  const sortOrder = String(req.query.sortOrder ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  const field = allowedFields.includes(sortBy) ? sortBy : defaultField;
  return { [field]: sortOrder } as Record<string, 'asc' | 'desc'>;
}
