import { useEffect, useRef } from 'react';

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

    let viewWidth = window.innerWidth;
    let viewHeight = window.innerHeight;
    let lastScrollY = window.scrollY;

    const initStars = () => {
      stars = [];
      const isMobile = viewWidth < 768;
      const numStars = isMobile ? 110 : 220;

      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * viewWidth;
        const y = Math.random() * viewHeight;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.4 + 0.6,
          color: `hsl(${200 + Math.random() * 55}, ${75 + Math.random() * 25}%, ${75 + Math.random() * 25}%)`,
          vx: 0,
          vy: 0,
          alpha: 0.35 + Math.random() * 0.5,
        });
      }
    };

    const resize = () => {
      viewWidth = window.innerWidth;
      viewHeight = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewWidth * dpr);
      canvas.height = Math.floor(viewHeight * dpr);
      canvas.style.width = `${viewWidth}px`;
      canvas.style.height = `${viewHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initStars();
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
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
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      ctx.clearRect(0, 0, viewWidth, viewHeight);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (scrollDelta !== 0) {
          star.y -= scrollDelta * 0.35;
          star.baseY -= scrollDelta * 0.35;

          if (star.y < -30) {
            star.y += viewHeight + 60;
            star.baseY += viewHeight + 60;
          } else if (star.y > viewHeight + 30) {
            star.y -= viewHeight + 60;
            star.baseY -= viewHeight + 60;
          }
        }

        const dx = clientMouseX - star.x;
        const dy = clientMouseY - star.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < pullRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (pullRadius - dist) / pullRadius;
          const easeForce = force * force;
          star.vx += dx * easeForce * 0.012;
          star.vy += dy * easeForce * 0.012;
        } else {
          const dxBase = star.baseX - star.x;
          const dyBase = star.baseY - star.y;
          star.vx += dxBase * 0.04;
          star.vy += dyBase * 0.04;
        }

        star.vx *= 0.86;
        star.vy *= 0.86;

        star.x += star.vx;
        star.y += star.vy;

        const isExcited = (star.vx * star.vx + star.vy * star.vy) > 0.08;

        ctx.beginPath();
        ctx.arc(star.x, star.y, isExcited ? star.size * 1.5 : star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = isExcited ? 1 : star.alpha;
        ctx.fill();
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}