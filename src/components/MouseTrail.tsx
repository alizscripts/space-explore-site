import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect user preference for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let stars: Star[] = [];
    let animationFrameId: number;

    let clientMouseX = -10000;
    let clientMouseY = -10000;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    const initStars = () => {
      stars = [];
      const totalDocHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight * 2.5
      );

      const isMobile = window.innerWidth < 768;
      const starDensity = isMobile ? 24000 : 12000;
      const maxStars = isMobile ? 250 : 600;
      const numStars = Math.min(
        Math.floor((canvasWidth * totalDocHeight) / starDensity),
        maxStars
      );

      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * totalDocHeight;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.3 + 0.6,
          color: `hsl(${200 + Math.random() * 55}, ${75 + Math.random() * 25}%, ${70 + Math.random() * 30}%)`,
          vx: 0,
          vy: 0,
          alpha: 0.35 + Math.random() * 0.45,
        });
      }
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resize = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      initStars();
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    window.addEventListener('resize', handleResize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      clientMouseX = e.clientX;
      clientMouseY = e.clientY;
    };

    const onMouseLeave = () => {
      clientMouseX = -10000;
      clientMouseY = -10000;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        clientMouseX = e.touches[0].clientX;
        clientMouseY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      clientMouseX = -10000;
      clientMouseY = -10000;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const pullRadius = 140;
    const pullRadiusSq = pullRadius * pullRadius;

    const animate = () => {
      const scrollY = window.scrollY;
      const viewHeight = canvasHeight;
      const viewWidth = canvasWidth;

      const currentMouseDocX = clientMouseX;
      const currentMouseDocY = clientMouseY >= 0 ? clientMouseY + scrollY : -10000;

      ctx.clearRect(0, 0, viewWidth, viewHeight);

      const buffer = 100;
      const minY = scrollY - buffer;
      const maxY = scrollY + viewHeight + buffer;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        const isVisible = star.y >= minY && star.y <= maxY;

        const dx = currentMouseDocX - star.x;
        const dy = currentMouseDocY - star.y;
        const distSq = dx * dx + dy * dy;

        // Optimization: check squared distance before costly sqrt
        if (distSq < pullRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (pullRadius - dist) / pullRadius;
          const easeForce = force * force;
          star.vx += dx * easeForce * 0.008;
          star.vy += dy * easeForce * 0.008;
        } else {
          const dxBase = star.baseX - star.x;
          const dyBase = star.baseY - star.y;
          star.vx += dxBase * 0.035;
          star.vy += dyBase * 0.035;
        }

        star.vx *= 0.88;
        star.vy *= 0.88;

        star.x += star.vx;
        star.y += star.vy;

        if (isVisible) {
          const screenX = Math.round(star.x);
          const screenY = Math.round(star.y - scrollY);

          // Fast rendering without costly shadowBlur filter
          const speedSq = star.vx * star.vx + star.vy * star.vy;
          const isExcited = speedSq > 0.09;

          ctx.beginPath();
          ctx.arc(screenX, screenY, isExcited ? star.size * 1.5 : star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = isExcited ? 1 : star.alpha;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}