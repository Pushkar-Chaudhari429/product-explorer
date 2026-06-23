import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { pageVariants } from '../animations/framerVariants';
export function HomePage() {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen">
      <Hero />
    </motion.main>
  );
}
