import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import SolarSystem from './pages/SolarSystem';
import DeepSpace from './pages/DeepSpace';

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="solar-system" element={<SolarSystem />} />
          <Route path="deep-space" element={<DeepSpace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}