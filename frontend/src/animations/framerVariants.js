export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25,0.1,0.25,1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.25,0.1,0.25,1] } },
};
export const cardVariants = {
  initial: { opacity: 0, y: 15, scale: 0.97 },
  animate: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, delay: i * 0.04, ease: [0.25,0.1,0.25,1] } }),
};
export const filterVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.25,0.1,0.25,1] } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};
export const commandPaletteVariants = {
  backdrop: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.15 } }, exit: { opacity: 0, transition: { duration: 0.1 } } },
  panel: { initial: { opacity: 0, scale: 0.96, y: -10 }, animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [0.25,0.1,0.25,1] } }, exit: { opacity: 0, scale: 0.96, y: -10, transition: { duration: 0.15 } } },
};
export const toastVariants = {
  initial: { opacity: 0, x: 100, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3, ease: [0.25,0.1,0.25,1] } },
  exit: { opacity: 0, x: 100, transition: { duration: 0.2 } },
};
