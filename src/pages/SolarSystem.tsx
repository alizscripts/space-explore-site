import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { Sphere, Ring, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

interface TextureSphereProps {
  textureUrl: string;
  isGasGiant: boolean;
  args: [number, number, number];
}

const TextureSphere = ({ textureUrl, isGasGiant, args }: TextureSphereProps) => {
  const texture = useTexture(textureUrl) as THREE.Texture;
  if (texture && 'colorSpace' in texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

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
  const isUranus = planet.name.includes('اورانوس');
  const isGasGiant = planet.type.includes('گازی') || planet.type.includes('یخی');

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} />
      <directionalLight position={[-5, -2, -4]} intensity={0.9} />
      
      {/* Base Planet Sphere with Texture */}
      <Suspense fallback={
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial color={planet.baseColor} roughness={0.7} />
        </Sphere>
      }>
        <TextureSphere 
          textureUrl={planet.textureMap} 
          isGasGiant={isGasGiant}
          args={[1.5, 48, 48]} 
        />
      </Suspense>
      
      {/* Atmosphere Glow */}
      <Sphere args={[1.54, 36, 36]}>
        <meshStandardMaterial 
          color={planet.atmosColor} 
          transparent 
          opacity={0.12} 
          roughness={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Orbiting Moon */}
      {parseInt(planet.stats.moons) > 0 && !isSaturn && !isUranus && (
        <group rotation={[Math.PI / 8, 0, 0]}>
          <mesh position={[2.2, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#888888" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Rings */}
      {isSaturn && (
        <Ring args={[1.7, 2.6, 48]} rotation={[-Math.PI / 2.2, 0, 0]}>
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
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 z-10 relative">
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 45 }} 
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Planet3DModel planet={planet} />
        </Suspense>
      </Canvas>
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
      textureMap: `${BASE}textures/mercury.jpg`,
      stats: { distance: '۵۸ میلیون', year: '۸۸ روز', moons: '۰' },
    },
    {
      name: 'زهره (ناهید)',
      type: 'سیاره سنگی',
      desc: 'با اتمسفری ضخیم از دی‌اکسید کربن که اثر گلخانه‌ای شدیدی ایجاد می‌کند، داغ‌ترین سیاره منظومه شمسی است.',
      baseColor: '#b45309',
      atmosColor: '#fbbf24',
      textureMap: `${BASE}textures/venus.jpg`,
      stats: { distance: '۱۰۸ میلیون', year: '۲۲۵ روز', moons: '۰' },
    },
    {
      name: 'زمین',
      type: 'سیاره سنگی زیست‌پذیر',
      desc: 'نقطه آبی کمرنگ ما. تنها مکان شناخته شده در جهان که شرایط ایده‌آل (آب مایع و جو مناسب) برای تکامل حیات را داراست.',
      baseColor: '#1d4ed8',
      atmosColor: '#60a5fa',
      textureMap: `${BASE}textures/earth.jpg`,
      stats: { distance: '۱۵۰ میلیون', year: '۳۶۵.۲ روز', moons: '۱' },
    },
    {
      name: 'مریخ (بهرام)',
      type: 'سیاره سنگی',
      desc: 'سیاره‌ای سرد و بیابانی با جوی رقیق. دارای بزرگترین آتشفشان و عمیق‌ترین دره‌های کشف شده در منظومه شمسی.',
      baseColor: '#b91c1c',
      atmosColor: '#f87171',
      textureMap: `${BASE}textures/mars.jpg`,
      stats: { distance: '۲۲۸ میلیون', year: '۶۸۷ روز', moons: '۲' },
    },
    {
      name: 'مشتری (برجیس)',
      type: 'غول گازی عظیم',
      desc: 'پادشاه سیارات منظومه شمسی. جرمی بیش از دو برابر تمام سیارات دیگر روی هم دارد و طوفان‌های عظیمی در آن در جریان است.',
      baseColor: '#9a3412',
      atmosColor: '#fcd34d',
      textureMap: `${BASE}textures/jupiter.jpg`,
      stats: { distance: '۷۷۸ میلیون', year: '۱۱.۸ سال', moons: '۹۵' },
    },
    {
      name: 'زحل (کیوان)',
      type: 'غول گازی حلقه‌دار',
      desc: 'نگین منظومه شمسی که به خاطر حلقه‌های گسترده و درخشانش که از میلیاردها قطعه یخ و سنگ تشکیل شده‌اند، مشهور است.',
      baseColor: '#854d0e',
      atmosColor: '#fde047',
      textureMap: `${BASE}textures/saturn.jpg`,
      stats: { distance: '۱.۴ میلیارد', year: '۲۹.۴ سال', moons: '۱۴۶' },
    },
    {
      name: 'اورانوس',
      type: 'غول یخی کج‌محور',
      desc: 'تنها سیاره‌ای که محور چرخش آن به شدت کج شده و تقریباً روی پهلو به دور خورشید می‌گردد. اتمسفری بسیار سرد دارد.',
      baseColor: '#0e7490',
      atmosColor: '#a5f3fc',
      textureMap: `${BASE}textures/uranus.jpg`,
      stats: { distance: '۲.۹ میلیارد', year: '۸۴ سال', moons: '۲۸' },
    },
    {
      name: 'نپتون',
      type: 'غول یخی دوردست',
      desc: 'دورترین سیاره منظومه شمسی. جهانی تاریک، سرد و با بادهای مافوق صوت که سرعت آن‌ها به ۲۰۰۰ کیلومتر در ساعت می‌رسد.',
      baseColor: '#1e3a8a',
      atmosColor: '#3b82f6',
      textureMap: `${BASE}textures/neptune.jpg`,
      stats: { distance: '۴.۵ میلیارد', year: '۱۶۵ سال', moons: '۱۶' },
    }
  ];

  return (
    <div className="pb-32 overflow-hidden">
      {/* Header */}
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

      {/* Planets List */}
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
              
              {/* Content */}
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

                {/* Stats */}
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

        {/* Next Section Button */}
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