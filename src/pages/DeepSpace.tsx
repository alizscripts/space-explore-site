import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

interface SpaceVisualProps {
  src: string;
  alt: string;
  isEven: boolean;
}

const SpaceVisual = ({ src, alt, isEven }: SpaceVisualProps) => {
  return (
    <div style={{ perspective: 1600 }} className="w-full aspect-square md:aspect-[4/3] flex-shrink-0">
      <div 
        style={{ 
          transform: `rotateX(8deg) rotateY(${isEven ? '10deg' : '-10deg'})`, 
          transformStyle: 'preserve-3d' 
        }} 
        className="w-full h-full relative group transition-transform duration-500 hover:scale-[1.02]"
      >
        <div className="absolute -inset-2 rounded-3xl bg-white/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-950 relative">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

interface DeepSpaceSection {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export default function DeepSpace() {
  const sections: DeepSpaceSection[] = [
    {
      id: 'black-holes',
      title: 'سیاه‌چاله‌ها',
      subtitle: 'هیولاهای گرانشی و افق رویداد',
      desc: 'سیاه‌چاله‌ها مناطقی از فضا-زمان هستند که گرانش در آن‌ها چنان قدرتمند است که هیچ چیز، حتی نور، توان گریز از چنگال آن‌ها را ندارد. این تصویر خیره‌کننده، نخستین تصویر ثبت شده از افق رویداد سیاه‌چاله کلان‌جرم مرکز کهکشان M87 است که با تلسکوپ افق رویداد (EHT) شکار شد.',
      image: `${BASE}textures/blackhole.webp`,
      stats: [
        { label: 'فاصله از زمین', value: '۵۵ میلیون سال نوری' },
        { label: 'جرم تخمینی', value: '۶.۵ میلیارد برابر خورشید' },
        { label: 'روش رصد', value: 'شبکه تلسکوپ EHT' },
      ],
    },
    {
      id: 'nebulae',
      title: 'سحابی‌ها',
      subtitle: 'مهد ستارگان و زایش کیهانی',
      desc: 'سحابی‌ها ابرهای عظیمی از غبار، گاز هیدروژن و هلیوم هستند. این تصویر بی‌نظیر (صخره‌های کیهانی در سحابی کارینا) که با تلسکوپ فضایی جیمز وب ثبت شده، مناطقی شکوهمند را نشان می‌دهد که در دل آن‌ها نسل‌های جدید ستارگان متولد می‌شوند.',
      image: `${BASE}textures/nebula.webp`,
      stats: [
        { label: 'فاصله از زمین', value: '۷,۵۰۰ سال نوری' },
        { label: 'گستردگی', value: 'بیش از ۳۰۰ سال نوری' },
        { label: 'تلسکوپ کاشف', value: 'جیمز وب (JWST)' },
      ],
    },
    {
      id: 'pulsars',
      title: 'تپ‌اخترها',
      subtitle: 'فانوس‌های دریایی چرخان کیهان',
      desc: 'تپ‌اخترها ستاره‌های نوترونی بسیار متراکمی هستند که با سرعت خارق‌العاده‌ای می‌چرخند و طوفانی از ذرات پرانرژی و پرتوهای الکترومغناطیسی را با دقتی شبیه به ساعت‌های اتمی از قطب‌های مغناطیسی خود به بیرون پرتاب می‌کنند.',
      image: `${BASE}textures/pulsar.webp`,
      stats: [
        { label: 'سرعت چرخش', value: 'تا صدها دور در ثانیه' },
        { label: 'چگالی ماده', value: 'میلیاردها تن در سانتی‌متر مکعب' },
        { label: 'میدان مغناطیسی', value: 'تریلیون برابر میدان زمین' },
      ],
    },
  ];

  return (
    <div className="pb-32 overflow-hidden">
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            فضای عمیق
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            فراتر از منظومه شمسی، در تاریکی مطلق و سرمای بین‌ستاره‌ای، 
            پدیده‌هایی بی‌نهایت شکوهمند قوانین فیزیک را به چالش می‌کشند.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {sections.map((section, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={section.id} 
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full lg:w-1/2"
              >
                <SpaceVisual 
                  src={section.image} 
                  alt={`تصویر نجومی ${section.title} - ${section.subtitle}`} 
                  isEven={isEven} 
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="flex-1 space-y-6 text-center lg:text-right"
              >
                <div className="text-zinc-500 text-sm font-medium">
                  {section.subtitle}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {section.title}
                </h2>
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto lg:mr-0 lg:ml-auto my-6" />
                <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-light mb-6">
                  {section.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
                  {section.stats.map((stat) => (
                    <div 
                      key={stat.label} 
                      className="bg-zinc-950 border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-4 text-center"
                    >
                      <div className="text-xs text-zinc-500 mb-1">{stat.label}</div>
                      <div className="text-sm font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </section>

      <section className="py-20 border-t border-white/5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto px-4"
        >
          <p className="text-zinc-500 mb-6 font-light">پایان گشت و گذار در اعماق فضا</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 active:scale-95 transition-transform"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
            <Link 
              to="/solar-system"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              <span>کاوش منظومه شمسی</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}