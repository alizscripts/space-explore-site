import { Outlet, Link, useLocation } from 'react-router-dom';
import { Rocket, Orbit, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MouseTrail from './MouseTrail';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'مقدمه', icon: Rocket },
    { path: '/solar-system', label: 'منظومه شمسی', icon: Orbit },
    { path: '/deep-space', label: 'فضای عمیق', icon: Sparkles },
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-['Vazirmatn'] bg-black text-white">
      {/* Background Starfield and Ambient Light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -20 }}>
        <div className="absolute inset-0 stars-bg opacity-70"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] bg-zinc-800/20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] bg-zinc-900/30"></div>
      </div>
      
      <MouseTrail />

      {/* Floating Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-4 pointer-events-none transition-transform duration-500">
        <div className={`pointer-events-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 w-full max-w-4xl transition-all duration-500 shadow-2xl ${scrolled ? 'border-white/20 bg-black/80' : ''}`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-lg">شگفتی‌های فضا</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 inset-x-4 z-40 md:hidden bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full pt-28">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl">شگفتی‌های فضا</span>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
                پروژه‌ای تعاملی برای کاوش در شگفتی‌های بی‌پایان کیهان، از نزدیک‌ترین سیارات تا دوردست‌ترین پدیده‌های فضا.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                بخش‌های سایت
              </h4>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                خبرنامه کیهانی
              </h4>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed font-light">
                برای دریافت آخرین تصاویر و کشفیات نجومی عضو شوید.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="ایمیل شما..." 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 w-full transition-colors"
                />
                <button type="submit" className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">
                  ثبت
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} تمامی حقوق برای کاوشگران فضا محفوظ است.</p>
            <p className="flex items-center gap-1">
              توسعه داده شده توسط
              <a href="https://github.com/alizscripts" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors underline">
                Aliz_scripts
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}