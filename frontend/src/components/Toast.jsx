import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { toastVariants } from '../animations/framerVariants';

const ToastContext = createContext(null);
const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  info: <Info size={16} className="text-indigo-400" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);
  const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);
  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none" role="region" aria-label="Notifications" aria-live="polite">
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <motion.div key={toast.id} variants={toastVariants} initial="initial" animate="animate" exit="exit"
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1e1e1e] bg-[#111111] shadow-card min-w-[260px] max-w-sm" role="alert">
              {ICONS[toast.type]}
              <p className="text-sm text-zinc-200 flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer" aria-label="Dismiss">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
