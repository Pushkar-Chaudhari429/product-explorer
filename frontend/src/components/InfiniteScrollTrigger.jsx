import { useEffect, useRef } from 'react';
export function InfiniteScrollTrigger({ onIntersect, enabled = true }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) onIntersect(); }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);
  return <div ref={ref} className="h-1" aria-hidden="true" />;
}
