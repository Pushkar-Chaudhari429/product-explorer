import { useScrollProgress } from '../hooks/useScrollProgress';
export function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-100 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}
