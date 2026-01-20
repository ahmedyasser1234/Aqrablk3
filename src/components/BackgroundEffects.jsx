import React, { useEffect, useRef } from 'react';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef(null);

  // توليد النجوم
  const generateStars = () => {
    if (starsRef.current) return starsRef.current;

    const starColors = [
      '#ffffff', '#f8f9fa', '#e3f2fd',
      '#cde6ffff', '#b5e3f8ff', '#9ceff8ff',
      '#fff9bfff', '#f8ebabff', '#fafab1ff',
      '#ffe1baff', '#f8e0bdff'
    ];

    const allStars = [];

    // نجوم خارجية
    for (let i = 0; i < 5000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distanceFactor = (0.2 + Math.random() * 0.8) * 1.1;
      
      allStars.push({
        angle,
        distanceFactor,
        size: Math.pow(Math.random(), 10) * 1.6 + 0.3,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        rotationSpeed: (Math.random() * 0.0006 + 0.0002) * (Math.random() > 0.1 ? 1 : -1),
        blinkSpeed: Math.random() * 0.003 + 0.001, 
        blinkOffset: Math.random() * Math.PI * 2,
        opacityBase: Math.random() * 0.3 + 0.1,
        tilt: (Math.random() - 0.5) * 0.1 
      });
    }

    // نجوم المركز
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distanceFactor = Math.random() * 0.30;
      
      allStars.push({
        angle,
        distanceFactor,
        size: Math.random() * 1.2 + 0.2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        rotationSpeed: (Math.random() * 0.00001 + 0.000005),
        blinkSpeed: Math.random() * 0.02 + 0.005, 
        blinkOffset: Math.random() * Math.PI * 2,
        opacityBase: Math.random() * 0.4 + 0.2,
        tilt: (Math.random() - 0.5) * 0.05
      });
    }

    starsRef.current = allStars;
    return allStars;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const stars = generateStars();

    const render = () => {
      ctx.fillStyle = '#080911';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.max(width, height) * 0.9;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.2);
      gradient.addColorStop(0, 'rgba(10, 20, 50, 0.15)');
      gradient.addColorStop(1, 'rgba(8, 9, 17, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.angle += star.rotationSpeed;

        const blink = Math.sin(Date.now() * star.blinkSpeed + star.blinkOffset);
        const currentOpacity = star.opacityBase + (blink * 0.1);

        const r = star.distanceFactor * maxRadius;
        const x = centerX + Math.cos(star.angle) * r;
        const y = centerY + Math.sin(star.angle) * r * 1 + (Math.cos(star.angle) * star.tilt * 20);

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, currentOpacity));
        ctx.fill();

        if (star.size > 1.5) {
          ctx.shadowBlur = star.size * 1.5;
          ctx.shadowColor = star.color;
        } else {
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block', background: '#080911' }}
    />
  );
};

export default BackgroundEffects;