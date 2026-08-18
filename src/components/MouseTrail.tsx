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
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
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
        window.innerHeight * 3
      );
      
      const starDensity = window.innerWidth < 768 ? 16000 : 8000;
      const numStars = Math.floor((canvasWidth * totalDocHeight) / starDensity);

      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * totalDocHeight;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.4 + 0.5,
          color: `hsl(${200 + Math.random() * 60}, ${70 + Math.random() * 30}%, ${65 + Math.random() * 35}%)`,
          vx: 0,
          vy: 0
        });
      }
    };

    const resize = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      initStars();
    };

    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      clientMouseX = e.clientX;
      clientMouseY = e.clientY;
    };
    
    const onMouseLeave = () => {
      clientMouseX = -10000;
      clientMouseY = -10000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      const scrollY = window.scrollY;
      const viewHeight = canvasHeight;
      const viewWidth = canvasWidth;

      const currentMouseDocX = clientMouseX;
      const currentMouseDocY = clientMouseY >= 0 ? clientMouseY + scrollY : -10000;

      ctx.clearRect(0, 0, viewWidth, viewHeight);
      
      const buffer = 150;
      const minY = scrollY - buffer;
      const maxY = scrollY + viewHeight + buffer;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        const isVisible = star.y >= minY && star.y <= maxY;

        const dx = currentMouseDocX - star.x;
        const dy = currentMouseDocY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const pullRadius = 140;

        if (dist < pullRadius) {
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

          ctx.beginPath();
          ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          
          const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
          if (speed > 0.3) {
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 6;
            ctx.shadowColor = star.color;
          } else {
            ctx.globalAlpha = 0.4 + Math.random() * 0.35; 
            ctx.shadowBlur = 0;
          }
          
          ctx.fill();
        }
      }
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}