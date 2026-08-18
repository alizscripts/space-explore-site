import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Star, Zap } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4">
        <motion.div 
          style={{ y, opacity }}
          className="text-center w-full max-w-5xl mx-auto z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter mb-6">
              جهانِ <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-400 to-zinc-800">
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
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
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

      {/* Massive Numbers Section */}
      <section className="py-32 border-y border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
            {[
              { num: '۱۳.۸', unit: 'میلیارد سال', label: 'عمر تخمینی کیهان از زمان مهبانگ' },
              { num: '۹۳', unit: 'میلیارد سال نوری', label: 'قطر جهان قابل مشاهده برای انسان' },
              { num: '۲', unit: 'تریلیون', label: 'تعداد تقریبی کهکشان‌ها در پهنه هستی' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="text-center pt-8 md:pt-0"
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

      {/* Bento Grid Features */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">ساختار هستی</h2>
          <p className="text-zinc-400 text-lg max-w-2xl font-light leading-relaxed">
            جهان ما از ساختارهای بی‌نهایت کوچک اتمی تا ابرخوشه‌های کهکشانی تشکیل شده است. 
            قوانین فیزیک در تمام این مقیاس‌ها با هماهنگی خیره‌کننده‌ای عمل می‌کنند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-3xl bg-zinc-900 border border-white/5 p-10 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-[spin_60s_linear_infinite]"></div>
            </div>
            <div className="relative z-20">
              <Zap className="w-8 h-8 text-white mb-4" />
              <h3 className="text-3xl font-bold text-white mb-3">انرژی تاریک</h3>
              <p className="text-zinc-400 font-light max-w-md">نیروی مرموزی که باعث انبساط شتاب‌دار کیهان می‌شود و حدود ۶۸ درصد از کل محتوای جهان را تشکیل می‌دهد.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-zinc-900 border border-white/5 p-8 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
            <div className="relative z-20">
              <Globe className="w-8 h-8 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">سیارات فراخورشیدی</h3>
              <p className="text-zinc-400 font-light text-sm">جهان‌هایی که به دور ستارگانی غیر از خورشید می‌گردند و شاید میزبان حیات باشند.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-zinc-900 border border-white/5 p-8 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 opacity-50"></div>
            <div className="relative z-20">
              <Star className="w-8 h-8 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">زایشگاه‌های ستاره‌ای</h3>
              <p className="text-zinc-400 font-light text-sm">ابرهای عظیم گاز و غبار که در آن‌ها گرانش، ستارگان جدید را متولد می‌کند.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 rounded-3xl bg-zinc-900 border border-white/5 p-10 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute inset-0 stars-bg opacity-20"></div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
            <div className="relative z-20 w-full md:w-1/2">
              <h3 className="text-3xl font-bold text-white mb-3">شبکه کیهانی</h3>
              <p className="text-zinc-400 font-light">بزرگترین ساختار شناخته شده؛ رشته‌های عظیمی از ماده تاریک و کهکشان‌ها که در سراسر جهان کشیده شده‌اند و فضاهای خالی پهناوری بین آن‌ها قرار دارد.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Page Navigation */}
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
            <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
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