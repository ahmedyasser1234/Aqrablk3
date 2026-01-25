import React, { useEffect, useRef, useMemo } from 'react';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);

  const starsData = useMemo(() => {
    const starColors = [
      '#ffffff', '#f8f9fa', '#e3f2fd',
      '#cde6ffff', '#b5e3f8ff', '#9ceff8ff',
      '#fffde7', '#fff9c4', '#fff59d'
    ];

    const allStars = [];
    const count = 300;

    for (let i = 0; i < count; i++) {
      allStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        blinkSpeed: 0.002 + Math.random() * 0.003,
        blinkOffset: Math.random() * Math.PI * 2,
        rotationRadius: Math.random() * 20 + 10,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        angle: Math.random() * Math.PI * 2,
        centerX: Math.random() * window.innerWidth,
        centerY: Math.random() * window.innerHeight,
      });
    }

    return allStars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = null;
    try {
      ctx = canvas.getContext('2d', { alpha: false });
    } catch (e) {
      console.warn("Could not get canvas context", e);
      return;
    }

    if (!ctx) return;

    let animationFrameId;
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

    const render = () => {
      if (!ctx) return;
      ctx.fillStyle = '#080911';
      ctx.fillRect(0, 0, width, height);

      // Create subtle gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width
      );
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#080911');
      gradient.addColorStop(1, '#000000');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      starsData.forEach((star) => {
        star.angle += star.rotationSpeed;

        const blink = Math.sin(Date.now() * star.blinkSpeed + star.blinkOffset);
        const alpha = 0.3 + (blink + 1) / 2 * 0.7;

        ctx.beginPath();
        // Simple star movement (drifting)
        star.x += Math.cos(star.angle) * 0.1;
        star.y += Math.sin(star.angle) * 0.1;

        // Wrap around screen
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starsData]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-50"
    />
  );
};

export default BackgroundEffects;