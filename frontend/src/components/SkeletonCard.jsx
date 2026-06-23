export function SkeletonCard({ featured = false }) {
  return (
    <div className={`rounded-xl border border-[#1a1a1a] p-6 ${featured ? 'col-span-full p-8' : ''}`} style={{ background: '#0f0f0f' }} aria-hidden="true">
      <div className="skeleton h-3 w-20 rounded-full mb-4" />
      <div className="skeleton h-5 w-4/5 rounded mb-2" />
      <div className="skeleton h-5 w-3/5 rounded mb-6" />
      <div className="flex items-end justify-between">
        <div className="skeleton h-7 w-24 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
    </div>
  );
}
