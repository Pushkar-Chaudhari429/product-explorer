import { useRef, useCallback, useMemo } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { InfiniteScrollTrigger } from './InfiniteScrollTrigger';
import { filterVariants } from '../animations/framerVariants';

function buildRows(products) {
  const rows = [];
  let i = 0;
  while (i < products.length) {
    if (i > 0 && i % 12 === 11) {
      rows.push({ type: 'featured', product: products[i], flatIndex: i });
      i++;
    } else {
      const items = [];
      while (items.length < 3 && i < products.length && !(i > 0 && i % 12 === 11)) {
        items.push({ product: products[i], flatIndex: i });
        i++;
      }
      if (items.length > 0) rows.push({ type: 'grid', items });
    }
  }
  return rows;
}

export function VirtualProductGrid({ products, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, search, category }) {
  const rows = useMemo(() => buildRows(products), [products]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) => (rows[index]?.type === 'featured' ? 220 : 160),
    overscan: 4,
    gap: 16,
  });

  const handleFetchMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 12 }, (_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (products.length === 0) return <EmptyState search={search} category={category} />;

  return (
    <>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }} role="feed" aria-label={`${products.length} products loaded`}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;
          return (
            <div key={virtualRow.key} data-index={virtualRow.index} ref={rowVirtualizer.measureElement}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${virtualRow.start}px)`, paddingBottom: '16px' }}>
              {row.type === 'featured' ? (
                <ProductCard product={row.product} featured index={row.flatIndex % 24} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {row.items.map(({ product, flatIndex }) => (
                    <ProductCard key={product.id} product={product} index={flatIndex % 24} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <InfiniteScrollTrigger onIntersect={handleFetchMore} enabled={hasNextPage && !isFetchingNextPage} />

      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" aria-busy="true" aria-label="Loading more">
          {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!hasNextPage && products.length > 0 && (
        <p className="text-center text-sm text-zinc-700 py-12">All {products.length.toLocaleString()} products loaded</p>
      )}
    </>
  );
}
