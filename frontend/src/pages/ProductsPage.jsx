import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Database } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { VirtualProductGrid } from '../components/VirtualProductGrid';
import { pageVariants } from '../animations/framerVariants';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useProducts({ category, search: debouncedSearch || undefined });

  const allProducts = data?.pages.flatMap((p) => p.products) ?? [];
  const snapshotTime = data?.pages[0]?.snapshotTime;

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  }, [setSearchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-2">Failed to load products</p>
          <p className="text-sm text-zinc-600">{error.message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/10 transition-colors cursor-pointer">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-1">Product Explorer</h1>
            <p className="text-sm text-zinc-600 flex items-center gap-1.5">
              <Database size={13} />
              {isLoading ? 'Loading...' : `${allProducts.length.toLocaleString()} loaded`}
              {snapshotTime && <span className="text-zinc-700">· Session snapshot active</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <SlidersHorizontal size={13} />
            <span>Cursor-paginated · No duplicates guaranteed</span>
          </div>
        </div>

        <div className="sticky top-[56px] z-40 -mx-2 px-2 py-3 bg-[#070707]/95 backdrop-blur-md border-b border-[#141414] mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:max-w-sm">
              <SearchBar value={search} onChange={setSearch} placeholder="Search 200k+ products..." />
            </div>
            <div className="flex-1 overflow-hidden">
              <CategoryFilter selected={category} onChange={handleCategoryChange} />
            </div>
          </div>
        </div>

        <VirtualProductGrid
          products={allProducts}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          search={debouncedSearch}
          category={category}
        />
      </div>
    </motion.main>
  );
}
