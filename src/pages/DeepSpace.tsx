import { motion } from 'motion/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

interface SpaceVisualProps {
  src: string;
  alt: string;
  isEven: boolean;
}

const SpaceVisual = ({ src, alt, isEven }: SpaceVisualProps) => {
  return (
    <div style={{ perspective: 2000 }} className="w-full aspect-square md:aspect-[4/3] flex-shrink-0">
      <div 
        style={{ 
          transform: `rotateX(10deg) rotateY(${isEven ? '15deg' : '-15deg'})`, 
          transformStyle: "preserve-3d" 
        }} 
        className="w-full h-full relative group"
      >
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 relative">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
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
}

export default function DeepSpace() {
  const sections: DeepSpaceSection[] = [
    {
      id: 'black-holes',
      title: 'سیاه‌چاله‌ها',
      subtitle: 'هیولاهای گرانشی و افق رویداد',
      desc: 'سیاه‌چاله‌ها مناطقی از فضا-زمان هستند که گرانش در آن‌ها چنان قدرتمند است که هیچ چیز، حتی نور، توان گریز از چنگال آن‌ها را ندارد. این تصویر خیره‌کننده، نخستین تصویر ثبت شده از افق رویداد سیاه‌چاله کلان‌جرم مرکز کهکشان M87 است که با تلسکوپ افق رویداد (EHT) شکار شد.',
      image: `${BASE}textures/blackhole.jpg`,
    },
    {
      id: 'nebulae',
      title: 'سحابی‌ها',
      subtitle: 'مهدکودک‌ها و زایشگاه‌های ستاره‌ای',
      desc: 'سحابی‌ها ابرهای عظیمی از غبار، گاز هیدروژن و هلیوم هستند. این تصویر بی‌نظیر (صخره‌های کیهانی در سحابی کارینا) که با تلسکوپ فضایی جیمز وب ثبت شده، زایشگاه‌هایی را نشان می‌دهد که ستارگان جدید در میان امواج متلاطم غبار متولد می‌شوند.',
      image: `${BASE}textures/nebula.jpg`,
    },
    {
      id: 'pulsars',
      title: 'تپ‌اخترها',
      subtitle: 'فانوس‌های دریایی چرخان کیهان',
      desc: 'تپ‌اخترها ستاره‌های نوترونی بسیار متراکمی هستند که با سرعت خارق‌العاده‌ای می‌چرخند و طوفانی از ذرات پرانرژی و پرتوهای الکترومغناطیسی را با دقتی شبیه به ساعت‌های اتمی از قطب‌های مغناطیسی خود به بیرون پرتاب می‌کنند.',
      image: `${BASE}textures/pulsar.jpg`,
    }
  ];

  return (
    <div className="pb-32 overflow-hidden">
      {/* Header */}
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

      {/* Feature Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {sections.map((section, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={section.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full lg:w-[50%]"
              >
                <SpaceVisual src={section.image} alt={section.title} isEven={isEven} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1 space-y-6 text-center lg:text-right"
              >
                <div className="text-zinc-500 text-sm font-medium">
                  {section.subtitle}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {section.title}
                </h2>
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto lg:ml-0 lg:mr-auto my-6"></div>
                <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-light">
                  {section.desc}
                </p>
              </motion.div>
            </div>
          );
        })}
      </section>

      {/* Return Navigation */}
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
              <span>بازگشت به صفحه اصلی</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link 
              to="/solar-system"
              className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              کاوش منظومه شمسی
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}