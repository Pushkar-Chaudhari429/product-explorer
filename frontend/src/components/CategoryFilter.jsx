import { useRef, useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

const CATEGORIES = ['All','Electronics','Clothing','Books','Home & Garden','Sports','Toys','Automotive','Health & Beauty','Food & Grocery','Office Supplies'];

export function CategoryFilter({ selected, onChange }) {
  const scrollRef = useRef(null);
  const [showGradient, setShowGradient] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowGradient(el.scrollWidth > el.clientWidth && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);
  return (
    <div className="relative" role="group" aria-label="Filter by category">
      <div ref={scrollRef} className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CATEGORIES.map((cat) => {
          const isActive = (cat === 'All' && !selected) || cat === selected;
          return (
            <button key={cat} onClick={() => onChange(cat === 'All' ? null : cat)} className={`pill-btn flex-shrink-0 ${isActive ? 'active' : ''}`} aria-pressed={isActive}>
              {cat === 'All' && <Tag size={11} aria-hidden="true" />}{cat}
            </button>
          );
        })}
      </div>
      {showGradient && <div className="absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-[#070707] to-transparent pointer-events-none" />}
    </div>
  );
}
