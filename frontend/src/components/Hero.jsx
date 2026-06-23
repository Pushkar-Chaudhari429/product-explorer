import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Zap, Database } from 'lucide-react';

const WORDS = ['Explore', 'the', 'entire', 'product', 'universe.'];

export function Hero() {
  const containerRef = useRef(null);
  const meshRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-word', { opacity: 0, y: 30, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.9 });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 1.1 });
      gsap.fromTo('.hero-badge', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)', delay: 0.2 });
      gsap.to('.mesh-l1', { x: '3%', y: '2%', duration: 25, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.mesh-l2', { x: '-2%', y: '3%', duration: 30, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 5 });
      gsap.to('.mesh-l3', { x: '2%', y: '-2%', duration: 20, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 10 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!meshRef.current) return;
      const x = ((e.clientX / window.innerWidth) - 0.5) * 15;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 15;
      gsap.to(meshRef.current, { x, y, duration: 0.8, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-base" aria-label="Hero section">
      <div ref={meshRef} className="absolute inset-0 pointer-events-none">
        <div className="mesh-l1 absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div className="mesh-l2 absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 70%, rgba(139,92,246,0.09) 0%, transparent 70%)' }} />
        <div className="mesh-l3 absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 80%, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] text-indigo-400 text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
          Live · 200,000+ Products · Cursor Pagination
        </div>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
          {WORDS.map((word, i) => (
            <span key={i} className="hero-word inline-block mr-4 opacity-0">
              {i === WORDS.length - 1 ? <span className="text-gradient">{word}</span> : <span className="text-zinc-50">{word}</span>}
            </span>
          ))}
        </h1>

        <p className="hero-subtitle opacity-0 text-lg sm:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          A premium data exploration platform. Instant search, smart filtering, and buttery-smooth infinite scroll — powered by snapshot-stable cursor pagination.
        </p>

        <div className="hero-cta opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate('/products')}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base transition-all duration-200 shadow-glow hover:shadow-glow-lg cursor-pointer"
          >
            Start Exploring
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        <div className="hero-cta opacity-0 flex items-center justify-center gap-8 text-sm text-zinc-600">
          <div className="flex items-center gap-2"><Database size={14} /><span>200k+ records</span></div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-2"><Zap size={14} /><span>Sub-200ms queries</span></div>
          <div className="w-px h-4 bg-zinc-800" />
          <span>Zero duplicates</span>
        </div>
      </div>
    </section>
  );
}
