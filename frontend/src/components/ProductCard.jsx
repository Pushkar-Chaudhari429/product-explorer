import { motion } from 'framer-motion';
import { Tag, Clock } from 'lucide-react';
import { cardVariants } from '../animations/framerVariants';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));
}

function formatRelativeTime(isoString) {
  const diffDays = Math.floor((Date.now() - new Date(isoString).getTime()) / 86400000);
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays/7)}w ago`;
  return `${Math.floor(diffDays/30)}mo ago`;
}

export function ProductCard({ product, featured = false, index = 0 }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className={`product-card ${featured ? 'product-card--featured' : ''}`}
      role="article"
      aria-label={`${product.name}, ${product.category}, ${formatPrice(product.price)}`}
      tabIndex={0}
    >
      <div className="flex items-center gap-1.5 mb-4">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 bg-[#181818] border border-[#222] px-2.5 py-1 rounded-full">
          <Tag size={10} aria-hidden="true" />{product.category}
        </span>
        {featured && <span className="inline-flex items-center text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">Featured</span>}
      </div>
      <h3 className={`font-semibold text-zinc-100 leading-snug mb-4 ${featured ? 'text-2xl' : 'text-base'}`}>{product.name}</h3>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <p className="text-xs text-zinc-600 mb-1">Price</p>
          <p className={`font-bold text-gradient ${featured ? 'text-3xl' : 'text-xl'}`}>{formatPrice(product.price)}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Clock size={11} aria-hidden="true" />
            <span>Updated {formatRelativeTime(product.updated_at)}</span>
          </div>
          <p className="text-xs text-zinc-700 mt-0.5">ID #{product.id}</p>
        </div>
      </div>
    </motion.article>
  );
}
