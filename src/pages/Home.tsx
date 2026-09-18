import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Star, Zap } from 'lucide-react';

interface SpotlightCardProps {
  className?: string;
  delay?: number;
  children: ReactNode;
}

function SpotlightCard({ className = '', delay = 0, children }: SpotlightCardProps) {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl bg-zinc-950 border border-white/10 hover:border-white/20 transition-colors duration-300 overflow-hidden flex flex-col justify-end ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        style={{
          background: 'radial-gradient(240px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 255, 255, 0.08), transparent 80%)',
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 md:p-10">
        {children}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { num: '۱۳.۸', unit: 'میلیارد سال', label: 'عمر تخمینی کیهان از زمان بیگ بنگ' },
    { num: '۹۳', unit: 'میلیارد سال نوری', label: 'قطر جهان قابل مشاهده برای انسان' },
    { num: '۲', unit: 'تریلیون', label: 'تعداد تقریبی کهکشان‌ها در پهنه هستی' },
  ];

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden">
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4">
        <motion.div 
          style={{ y, opacity }}
          className="text-center w-full max-w-5xl mx-auto z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-tight">
              جهانِ <br className="md:hidden" />
              <span className="inline-block pb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-400 to-zinc-800">
                بی‌کران
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            در قلمرویی که نور برای رسیدن به چشم‌های ما میلیاردها سال در سفر است، 
            هر ستاره داستانی از گذشته‌های دور را روایت می‌کند.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link 
              to="/deep-space"
              className="group relative px-8 py-4 bg-white text-black rounded-full font-medium overflow-hidden flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">سفر به اعماق فضا</span>
              <ArrowLeft className="w-4 h-4 relative z-10" />
            </Link>
            <Link 
              to="/solar-system"
              className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              کاوش منظومه شمسی
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-32 border-y border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className={`text-center px-6 py-8 md:py-0 ${
                  idx !== stats.length - 1 
                    ? 'border-b md:border-b-0 md:border-l border-white/10' 
                    : ''
                }`}
              >
                <div className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter">
                  {stat.num}
                </div>
                <div className="text-xl font-medium text-zinc-300 mb-4">{stat.unit}</div>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">ساختار هستی</h2>
          <p className="text-zinc-400 text-lg max-w-2xl font-light leading-relaxed">
            جهان ما از ساختارهای بی‌نهایت کوچک اتمی تا ابرخوشه‌های کهکشانی تشکیل شده است. 
            قوانین فیزیک در تمام این مقیاس‌ها با هماهنگی خیره‌کننده‌ای عمل می‌کنند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <SpotlightCard className="md:col-span-2">
            <Zap className="w-8 h-8 text-white mb-4" />
            <h3 className="text-3xl font-bold text-white mb-3">انرژی تاریک</h3>
            <p className="text-zinc-400 font-light max-w-md">نیروی مرموزی که باعث انبساط شتاب‌دار کیهان می‌شود و حدود ۶۸ درصد از کل محتوای جهان را تشکیل می‌دهد.</p>
          </SpotlightCard>

          <SpotlightCard delay={0.15}>
            <Globe className="w-8 h-8 text-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">سیارات فراخورشیدی</h3>
            <p className="text-zinc-400 font-light text-sm">جهان‌هایی که به دور ستارگانی غیر از خورشید می‌گردند و شاید میزبان حیات باشند.</p>
          </SpotlightCard>

          <SpotlightCard delay={0.25}>
            <Star className="w-8 h-8 text-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">مهد ستارگان</h3>
            <p className="text-zinc-400 font-light text-sm">ابرهای عظیم گاز و غبار که در دل آن‌ها گرانش، ستارگان جدید را متولد می‌کند.</p>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2" delay={0.35}>
            <h3 className="text-3xl font-bold text-white mb-3">شبکه کیهانی</h3>
            <p className="text-zinc-400 font-light max-w-2xl">بزرگترین ساختار شناخته شده؛ رشته‌های عظیمی از ماده تاریک و کهکشان‌ها که در سراسر جهان کشیده شده‌اند و فضاهای خالی پهناوری بین آن‌ها قرار دارد.</p>
          </SpotlightCard>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto px-4"
        >
          <p className="text-zinc-500 mb-6 font-light">آماده‌اید تا سفر را آغاز کنیم؟</p>
          <Link 
            to="/solar-system"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black rounded-full font-bold overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 flex items-center gap-3">
              ورود به منظومه شمسی
              <ArrowLeft className="w-5 h-5 relative z-10" />
            </span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}