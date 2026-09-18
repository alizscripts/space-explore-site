import { useRef, useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { Sphere, Ring, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

interface MoonConfig {
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  inclination: [number, number, number];
}

const PLANET_MOONS: Record<string, MoonConfig[]> = {
  'زمین': [
    { name: 'ماه', distance: 1.85, size: 0.095, color: '#d4d4d8', speed: 0.45, inclination: [0.25, 0, 0.1] },
  ],
  'مریخ (بهرام)': [
    { name: 'فوبوس', distance: 1.65, size: 0.052, color: '#78716c', speed: 0.7, inclination: [0.15, 0, 0.1] },
    { name: 'دیموس', distance: 1.95, size: 0.042, color: '#a8a29e', speed: 0.48, inclination: [-0.2, 0, 0.15] },
  ],
  'مشتری (برجیس)': [
    { name: 'آیو', distance: 1.68, size: 0.065, color: '#facc15', speed: 0.75, inclination: [0.1, 0, 0] },
    { name: 'اروپا', distance: 1.92, size: 0.06, color: '#f8fafc', speed: 0.52, inclination: [-0.15, 0, 0.1] },
    { name: 'گانیمید', distance: 2.18, size: 0.095, color: '#94a3b8', speed: 0.35, inclination: [0.25, 0, -0.1] },
  ],
  'زحل (کیوان)': [
    { name: 'انسلادوس', distance: 2.22, size: 0.048, color: '#ffffff', speed: 0.58, inclination: [-0.15, 0, -0.1] },
    { name: 'تایتان', distance: 2.42, size: 0.1, color: '#f59e0b', speed: 0.32, inclination: [0.3, 0, 0.1] },
  ],
  'اورانوس': [
    { name: 'تایتانیا', distance: 1.75, size: 0.07, color: '#cbd5e1', speed: 0.48, inclination: [0.35, 0, 0.2] },
    { name: 'اوبرون', distance: 2.05, size: 0.062, color: '#94a3b8', speed: 0.32, inclination: [-0.25, 0, -0.15] },
  ],
  'نپتون': [
    { name: 'تریتون', distance: 1.8, size: 0.088, color: '#e2e8f0', speed: -0.36, inclination: [0.4, 0, 0.1] },
    { name: 'پروتئوس', distance: 2.1, size: 0.048, color: '#64748b', speed: 0.5, inclination: [-0.2, 0, 0.2] },
  ],
};

const OrbitingMoon = ({ distance, size, color, speed, inclination }: MoonConfig) => {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group rotation={inclination}>
      <group ref={orbitRef}>
        <mesh position={[distance, 0, 0]}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

interface TextureSphereProps {
  textureUrl: string;
  isGasGiant: boolean;
  args: [number, number, number];
}

const TextureSphere = ({ textureUrl, isGasGiant, args }: TextureSphereProps) => {
  const texture = useTexture(textureUrl) as THREE.Texture;

  useEffect(() => {
    if (texture && 'colorSpace' in texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <Sphere args={args}>
      <meshStandardMaterial 
        map={texture} 
        roughness={isGasGiant ? 0.35 : 0.75} 
        metalness={0.05} 
        color="#ffffff"
      />
    </Sphere>
  );
};

interface PlanetData {
  name: string;
  type: string;
  desc: string;
  baseColor: string;
  atmosColor: string;
  textureMap: string;
  stats: {
    distance: string;
    year: string;
    moons: string;
  };
}

const Planet3DModel = ({ planet }: { planet: PlanetData }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  const isSaturn = planet.name.includes('زحل');
  const isGasGiant = planet.type.includes('گازی') || planet.type.includes('یخی');
  const moons = PLANET_MOONS[planet.name] || [];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} />
      <directionalLight position={[-5, -2, -4]} intensity={0.9} />
      
      <Suspense fallback={
        <Sphere args={[1.3, 32, 32]}>
          <meshStandardMaterial color={planet.baseColor} roughness={0.7} />
        </Sphere>
      }>
        <TextureSphere 
          textureUrl={planet.textureMap} 
          isGasGiant={isGasGiant}
          args={[1.3, 48, 48]} 
        />
      </Suspense>
      
      <Sphere args={[1.34, 36, 36]}>
        <meshStandardMaterial 
          color={planet.atmosColor} 
          transparent 
          opacity={0.12} 
          roughness={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {moons.map((moon) => (
        <OrbitingMoon key={moon.name} {...moon} />
      ))}

      {isSaturn && (
        <Ring args={[1.5, 2.1, 48]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <meshStandardMaterial 
            color="#d8ca9d" 
            transparent 
            opacity={0.8} 
            side={THREE.DoubleSide} 
          />
        </Ring>
      )}
    </group>
  );
};

const PlanetVisual = ({ planet }: { planet: PlanetData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 z-10 relative flex items-center justify-center"
    >
      {isVisible ? (
        <Canvas 
          camera={{ position: [0, 0, 5.0], fov: 45 }} 
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        >
          <Suspense fallback={null}>
            <Planet3DModel planet={planet} />
          </Suspense>
        </Canvas>
      ) : (
        <div 
          className="w-32 h-32 md:w-44 md:h-44 rounded-full transition-opacity duration-500 opacity-60 animate-pulse"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${planet.atmosColor}, ${planet.baseColor} 70%, #000 100%)`,
            boxShadow: `0 0 35px ${planet.atmosColor}33`,
          }}
        />
      )}
    </div>
  );
};

export default function SolarSystem() {
  const planets: PlanetData[] = [
    {
      name: 'عطارد (تیر)',
      type: 'سیاره سنگی',
      desc: 'نزدیک‌ترین و کوچک‌ترین سیاره به خورشید. سطحی پر از دهانه‌های برخوردی شبیه به ماه دارد و هیچ اتمسفر پایداری برای حفظ گرما ندارد.',
      baseColor: '#71717a',
      atmosColor: '#a1a1aa',
      textureMap: `${BASE}textures/mercury.webp`,
      stats: { distance: '۵۸ میلیون', year: '۸۸ روز', moons: '۰' },
    },
    {
      name: 'زهره (ناهید)',
      type: 'سیاره سنگی',
      desc: 'با اتمسفری ضخیم از دی‌اکسید کربن که اثر گلخانه‌ای شدیدی ایجاد می‌کند، داغ‌ترین سیاره منظومه شمسی است.',
      baseColor: '#b45309',
      atmosColor: '#fbbf24',
      textureMap: `${BASE}textures/venus.webp`,
      stats: { distance: '۱۰۸ میلیون', year: '۲۲۵ روز', moons: '۰' },
    },
    {
      name: 'زمین',
      type: 'سیاره سنگی زیست‌پذیر',
      desc: 'نقطه آبی کمرنگ ما. تنها مکان شناخته شده در جهان که شرایط ایده‌آل (آب مایع و جو مناسب) برای تکامل حیات را داراست.',
      baseColor: '#1d4ed8',
      atmosColor: '#60a5fa',
      textureMap: `${BASE}textures/earth.webp`,
      stats: { distance: '۱۵۰ میلیون', year: '۳۶۵.۲ روز', moons: '۱' },
    },
    {
      name: 'مریخ (بهرام)',
      type: 'سیاره سنگی',
      desc: 'سیاره‌ای سرد و بیابانی با جوی رقیق. دارای بزرگترین آتشفشان و عمیق‌ترین دره‌های کشف شده در منظومه شمسی.',
      baseColor: '#b91c1c',
      atmosColor: '#f87171',
      textureMap: `${BASE}textures/mars.webp`,
      stats: { distance: '۲۲۸ میلیون', year: '۶۸۷ روز', moons: '۲' },
    },
    {
      name: 'مشتری (برجیس)',
      type: 'غول گازی عظیم',
      desc: 'پادشاه سیارات منظومه شمسی. جرمی بیش از دو برابر تمام سیارات دیگر روی هم دارد و طوفان‌های عظیمی در آن در جریان است.',
      baseColor: '#9a3412',
      atmosColor: '#fcd34d',
      textureMap: `${BASE}textures/jupiter.webp`,
      stats: { distance: '۷۷۸ میلیون', year: '۱۱.۸ سال', moons: '۹۵' },
    },
    {
      name: 'زحل (کیوان)',
      type: 'غول گازی حلقه‌دار',
      desc: 'نگین منظومه شمسی که به خاطر حلقه‌های گسترده و درخشانش که از میلیاردها قطعه یخ و سنگ تشکیل شده‌اند، مشهور است.',
      baseColor: '#854d0e',
      atmosColor: '#fde047',
      textureMap: `${BASE}textures/saturn.webp`,
      stats: { distance: '۱.۴ میلیارد', year: '۲۹.۴ سال', moons: '۱۴۶' },
    },
    {
      name: 'اورانوس',
      type: 'غول یخی کج‌محور',
      desc: 'تنها سیاره‌ای که محور چرخش آن به شدت کج شده و تقریباً روی پهلو به دور خورشید می‌گردد. اتمسفری بسیار سرد دارد.',
      baseColor: '#0e7490',
      atmosColor: '#a5f3fc',
      textureMap: `${BASE}textures/uranus.webp`,
      stats: { distance: '۲.۹ میلیارد', year: '۸۴ سال', moons: '۲۸' },
    },
    {
      name: 'نپتون',
      type: 'غول یخی دوردست',
      desc: 'دورترین سیاره منظومه شمسی. جهانی تاریک، سرد و با بادهای مافوق صوت که سرعت آن‌ها به ۲۰۰۰ کیلومتر در ساعت می‌رسد.',
      baseColor: '#1e3a8a',
      atmosColor: '#3b82f6',
      textureMap: `${BASE}textures/neptune.webp`,
      stats: { distance: '۴.۵ میلیارد', year: '۱۶۵ سال', moons: '۱۶' },
    }
  ];

  return (
    <div className="pb-32 overflow-hidden">
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            منظومه شمسی
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
            خانه ما در گستره کیهان. یک ستاره مرکزی و هشت سیاره شگفت‌انگیز که هر کدام داستانی منحصر‌به‌فرد از پیدایش منظومه ما را روایت می‌کنند.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12 md:space-y-24">
          {planets.map((planet) => (
            <motion.div
              key={planet.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 md:p-12 rounded-3xl bg-zinc-950 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden"
            >
              <PlanetVisual planet={planet} />
              
              <div className="flex-1 w-full text-center md:text-right">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{planet.name}</h2>
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                      {planet.type}
                    </span>
                  </div>
                  
                  <div className="hidden md:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                    <ArrowLeft className="w-4 h-4 -rotate-45" />
                  </div>
                </div>
                
                <p className="text-zinc-400 font-light leading-relaxed text-base md:text-lg mb-8">
                  {planet.desc}
                </p>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">فاصله از خورشید</div>
                    <div className="text-lg md:text-xl font-bold text-white">
                      {planet.stats.distance} <span className="text-xs font-normal text-zinc-500">کیلومتر</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">یک سال (مدار)</div>
                    <div className="text-lg md:text-xl font-bold text-white">
                      {planet.stats.year}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">تعداد قمرها</div>
                    <div className="text-lg md:text-xl font-bold text-white">
                      {planet.stats.moons}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-28 text-center"
        >
          <p className="text-zinc-500 mb-6 font-light">می‌خواهید فراتر بروید؟</p>
          <Link to="/deep-space" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 active:scale-95 transition-transform">
            <span>ورود به فضای عمیق</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}