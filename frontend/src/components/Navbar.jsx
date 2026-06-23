import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { useCommandPalette } from '../hooks/useCommandPalette';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useCommandPalette();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[250ms] ease-out ${
      scrolled ? 'py-3 bg-[#070707]/90 backdrop-blur-xl border-b border-[#1a1a1a]' : 'py-5 bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-white text-lg group" aria-label="Product Explorer home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
            <Layers size={16} className="text-white" />
          </div>
          <span className="tracking-tight">Explorer</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={open}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-500 text-sm border border-[#1e1e1e] hover:border-[#2a2a2a] hover:text-zinc-400 transition-all duration-150 cursor-pointer"
            aria-label="Open command palette (Ctrl+K)"
          >
            <span>Search...</span>
            <kbd className="text-xs bg-[#1a1a1a] px-1.5 py-0.5 rounded font-mono text-zinc-600">⌘K</kbd>
          </button>
          {location.pathname !== '/products' && (
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium transition-all duration-200 shadow-glow hover:shadow-glow-lg cursor-pointer"
            >
              Explore <ArrowRight size={14} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
