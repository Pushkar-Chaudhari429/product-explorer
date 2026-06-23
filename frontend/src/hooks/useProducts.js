import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/apiClient';

export function useProducts({ category, search, limit = 24 } = {}) {
  return useInfiniteQuery({
    queryKey: ['products', { category, search, limit }],
    queryFn: async ({ pageParam, signal }) => {
      const cursor = pageParam?.cursor ?? undefined;
      const snapshotTime = pageParam?.snapshotTime ?? undefined;
      const params = {
        limit,
        ...(cursor && { cursor }),
        ...(snapshotTime && { snapshotTime }),
        ...(category && { category }),
        ...(search && { search }),
      };
      const response = await fetchProducts(params, signal);
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNextPage || !lastPage?.nextCursor) return undefined;
      return { cursor: lastPage.nextCursor, snapshotTime: lastPage.snapshotTime };
    },
    staleTime: 1000 * 60 * 2,
  });
}
