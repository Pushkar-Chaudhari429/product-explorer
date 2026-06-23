import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Tag, Grid3X3, ArrowRight, Command } from 'lucide-react';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { commandPaletteVariants } from '../animations/framerVariants';

const CATEGORIES = ['Electronics','Clothing','Books','Home & Garden','Sports','Toys','Automotive','Health & Beauty','Food & Grocery','Office Supplies'];
const STATIC_ACTIONS = [{ id: 'all', type: 'action', label: 'Browse all products', icon: Grid3X3, path: '/products' }];

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const categoryItems = CATEGORIES
    .filter((c) => !query || c.toLowerCase().includes(query.toLowerCase()))
    .map((c) => ({ id: `cat-${c}`, type: 'category', label: c, icon: Tag, path: `/products?category=${encodeURIComponent(c)}` }));
  const staticItems = query ? STATIC_ACTIONS.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())) : STATIC_ACTIONS;
  const items = [...staticItems, ...categoryItems];

  useEffect(() => {
    if (isOpen) { setQuery(''); setSelectedIndex(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [isOpen]);
  useEffect(() => { setSelectedIndex((prev) => Math.min(prev, Math.max(0, items.length - 1))); }, [items.length]);

  const handleSelect = useCallback((item) => { navigate(item.path); close(); }, [navigate, close]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i+1, items.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i-1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[selectedIndex]) handleSelect(items[selectedIndex]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" {...commandPaletteVariants.backdrop} className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <motion.div key="panel" {...commandPaletteVariants.panel} className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[151] w-full max-w-xl px-4" role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="glass-panel rounded-2xl shadow-card-hover overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1e1e1e]">
                <Search size={16} className="text-zinc-500 flex-shrink-0" aria-hidden="true" />
                <input ref={inputRef} type="text" value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }} onKeyDown={handleKeyDown}
                  placeholder="Search actions or categories..." className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
                  aria-label="Command palette search" role="combobox" aria-expanded={true} />
                <kbd className="text-xs bg-[#1a1a1a] text-zinc-600 px-1.5 py-0.5 rounded font-mono">esc</kbd>
              </div>
              <ul className="max-h-80 overflow-y-auto py-2" role="listbox" aria-label="Results">
                {items.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-zinc-600">No results found</li>
                ) : (
                  items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} role="option" aria-selected={i === selectedIndex}>
                        <button onClick={() => handleSelect(item)} onMouseEnter={() => setSelectedIndex(i)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer text-left ${i === selectedIndex ? 'bg-[#161616] text-zinc-200' : 'text-zinc-400 hover:bg-[#141414]'}`}>
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${i === selectedIndex ? 'bg-indigo-500/15 text-indigo-400' : 'bg-[#1a1a1a] text-zinc-600'}`}>
                            <Icon size={13} aria-hidden="true" />
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.type === 'category' && <span className="text-xs text-zinc-700">Category</span>}
                          {i === selectedIndex && <ArrowRight size={13} className="text-zinc-600" />}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
              <div className="px-4 py-2.5 border-t border-[#1a1a1a] flex items-center gap-4 text-xs text-zinc-700">
                <span className="flex items-center gap-1.5"><Command size={10} />K</span>
                <span>↑↓ navigate</span><span>↵ select</span><span>esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
