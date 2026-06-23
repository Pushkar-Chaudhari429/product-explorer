import { useRef } from 'react';
import { Search, X } from 'lucide-react';
export function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  const inputRef = useRef(null);
  return (
    <div className="relative w-full">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" aria-hidden="true" />
      <input
        ref={inputRef} type="search" id="product-search" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-10 bg-[#111111] border border-[#1e1e1e] rounded-xl text-sm text-zinc-200 placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 focus:bg-[#141414]"
        aria-label={placeholder} autoComplete="off" spellCheck={false}
      />
      {value && (
        <button onClick={() => { onChange(''); inputRef.current?.focus(); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer" aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
