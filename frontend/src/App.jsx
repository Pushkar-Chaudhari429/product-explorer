import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { ScrollProgress } from './components/ScrollProgress';
import { CommandPalette } from './components/CommandPalette';
import { ToastProvider } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CommandPaletteProvider } from './hooks/useCommandPalette';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000*60*5, gcTime: 1000*60*10, retry: 1, refetchOnWindowFocus: false },
  },
});

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CommandPaletteProvider>
          <ToastProvider>
            <ScrollProgress />
            <Navbar />
            <CommandPalette />
            <AnimatedRoutes />
          </ToastProvider>
        </CommandPaletteProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
