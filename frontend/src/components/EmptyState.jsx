export function EmptyState({ search, category }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center" role="status" aria-label="No products found">
      <div className="animate-float mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="39" stroke="#1e1e1e" strokeWidth="2"/>
          <circle cx="40" cy="40" r="28" stroke="#252525" strokeWidth="1.5" strokeDasharray="4 4"/>
          <path d="M28 40h24M40 28v24" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="4" fill="#2a2a2a"/>
          <circle cx="40" cy="40" r="2" fill="#3a3a3a"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">No products found</h3>
      <p className="text-sm text-zinc-600 max-w-xs">
        {search ? `No results for "${search}"${category ? ` in ${category}` : ''}. Try a different search term.`
          : category ? `No products in ${category}. Try a different category.`
          : 'No products available.'}
      </p>
    </div>
  );
}
