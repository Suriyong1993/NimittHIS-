export interface PaginationInput {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const getPagination = ({ page, limit }: PaginationInput) => {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  }
}

export const createPaginatedResponse = <T>(
  items: T[],
  total: number,
  pagination: PaginationInput
): PaginatedResult<T> => ({
  data: items,
  total,
  page: pagination.page,
  limit: pagination.limit,
  totalPages: Math.max(1, Math.ceil(total / pagination.limit))
})
