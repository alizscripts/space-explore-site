import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const SolarSystem = lazy(() => import('./pages/SolarSystem'));
const DeepSpace = lazy(() => import('./pages/DeepSpace'));

const PageLoader = () => (
  <div 
    role="status" 
    aria-live="polite" 
    className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
  >
    <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    <span className="text-zinc-500 text-sm font-light animate-pulse">در حال بارگذاری...</span>
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="solar-system"
            element={
              <Suspense fallback={<PageLoader />}>
                <SolarSystem />
              </Suspense>
            }
          />
          <Route
            path="deep-space"
            element={
              <Suspense fallback={<PageLoader />}>
                <DeepSpace />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}