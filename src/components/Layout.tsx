import { useState, useEffect, type FormEvent } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Rocket, Orbit, Sparkles, Menu, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MouseTrail from './MouseTrail';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? 'fa';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSubscribed) {
      const timer = setTimeout(() => setIsSubscribed(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isSubscribed]);
  useEffect(() => {
    const language = i18n.resolvedLanguage === 'en' ? 'en' : 'fa';

    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';

    localStorage.setItem('language', language);
  }, [i18n.resolvedLanguage]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'fa' ? 'en' : 'fa';
    void i18n.changeLanguage(newLanguage);
  };
  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const handlePreload = (path: string) => {
    if (path === '/solar-system') {
      import('../pages/SolarSystem');
    } else if (path === '/deep-space') {
      import('../pages/DeepSpace');
    } else if (path === '/') {
      import('../pages/Home');
    }
  };

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Rocket },
    { path: '/solar-system', label: t('nav.solarSystem'), icon: Orbit },
    { path: '/deep-space', label: t('nav.deepSpace'), icon: Sparkles },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute inset-0 stars-bg opacity-70" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] bg-zinc-800/20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] bg-zinc-900/30" />
      </div>
      
      <MouseTrail />

      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-4 pointer-events-none transition-transform duration-500">
        <div className={`pointer-events-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 w-full max-w-4xl transition-all duration-500 shadow-2xl ${scrolled ? 'border-white/20 bg-black/80' : ''}`}>
          <Link 
            to="/" 
            onMouseEnter={() => handlePreload('/')}
            className="flex items-center gap-3 group" 
            aria-label={t('layout.homeAria')}
          >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-lg">{t('layout.brand')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label={t('layout.navAria')}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => handlePreload(link.path)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-2 text-xs font-semibold rounded-full border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={currentLanguage === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'}
>
            {currentLanguage === 'fa' ? 'English' : 'فارسی'}
          </button>

          <button 
            type="button"
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('layout.menuClose') : t('layout.menuOpen')}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

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

      <main className="relative z-10 flex-1 w-full pt-28">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-auto bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <Rocket className="w-5 h-5" />
                </div>
                 <span className="font-bold text-xl">{t('layout.brand')}</span>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
                {t('layout.footerDescription')}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                {t('layout.sectionsTitle')}
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                      <span className="group-hover:-translate-x-1 transition-transform">{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                {t('layout.newsletterTitle')}
              </h4>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed font-light">
                {t('layout.newsletterDescription')}
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{t('layout.newsletterSuccess')}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t('layout.emailPlaceholder')}
                    aria-label={t('layout.emailLabel')}
                    required
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 w-full transition-colors"
                  />
                  <button 
                    type="submit" 
                    className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors flex-shrink-0"
                  >
                    {t('layout.subscribe')}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} {t('layout.copyright')}</p>
            <p className="flex items-center gap-1">
              {t('layout.developedBy')}
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