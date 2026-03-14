import React, { useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();

  // Dark Mode Stars
  const starsData = useMemo(() => {
    const starColors = [
      '#ffffff', '#f8f9fa', '#e3f2fd',
      '#cde6ffff', '#b5e3f8ff', '#9ceff8ff',
      '#fff9bfff', '#f8ebabff', '#fafab1ff',
      '#ffe1baff', '#f8e0bdff'
    ];

    const allStars = [];
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

    // Center stars
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

    return allStars;
  }, []);

  // Light Mode Elements (Drifting Fog)
  const lightModeData = useMemo(() => {
    const fog = [];
    // Create large, soft cloud puffs that drift slowly
    for (let i = 0; i < 8; i++) {
      fog.push({
        x: Math.random(),
        y: Math.random() * 0.5, // Top half only
        speed: (Math.random() * 0.00005) + 0.00001, // Very slow drift
        size: Math.random() * 1.5 + 2.0, // Large size
        opacity: Math.random() * 0.2 + 0.1, // Subtle opacity
        stretch: Math.random() * 0.5 + 1.0 // Horizontal stretch
      });
    }

    // Create Birds (More of them)
    const birds = [];
    for (let i = 0; i < 25; i++) {
      birds.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.5), // Top 50% of screen
        speed: Math.random() * 0.8 + 0.3, // Faster movement
        size: Math.random() * 0.6 + 0.7,
        wingFrame: Math.random() * 10,
        flapSpeed: Math.random() * 0.12 + 0.06
      });
    }

    // Shooting Stars / Meteors
    const meteors = [];
    for (let i = 0; i < 5; i++) {
      meteors.push({
        x: Math.random() * window.innerWidth,
        y: -50,
        vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
        vy: Math.random() * 3 + 2, // Downward velocity
        trail: [], // Smoke trail
        opacity: 1,
        active: Math.random() > 0.5 // Start some inactive
      });
    }

    return { fog, birds, meteors };
  }, []);

  // Load Background Image (Responsive)
  const bgImageRef = useRef(null);
  useEffect(() => {
    const loadImage = () => {
      const img = new Image();
      // Use the same image for both mobile and desktop as requested
      img.src = '/1234567.png';
      img.onload = () => { bgImageRef.current = img; };
    };

    loadImage();

    // Reload image on window resize
    window.addEventListener('resize', loadImage);
    return () => window.removeEventListener('resize', loadImage);
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

      if (isDarkMode) {
        // --- DARK MODE RENDER ---
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

        starsData.forEach((star) => {
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
      } else {
        // --- LIGHT MODE RENDER (Image + Birds + Clouds) ---

        if (bgImageRef.current) {
          const img = bgImageRef.current;
          const ratio = img.naturalWidth / img.naturalHeight;
          const renderWidth = width;
          const renderHeight = renderWidth / ratio;

          // Calculate scroll position but cap it so the image stops at its bottom edge
          // If the image is taller than the screen, it will scroll up until the bottom appears
          // and then stay fixed as requested ("after that elements continue")
          const maxScroll = Math.max(0, renderHeight - height);
          const currentScroll = Math.min(window.scrollY, maxScroll);

          ctx.drawImage(img, 0, -currentScroll, renderWidth, renderHeight);
        } else {
          ctx.fillStyle = '#87CEEB'; // Sky blue fallback
          ctx.fillRect(0, 0, width, height);
        }

        ctx.shadowBlur = 0;

        // Render Clouds (White Fluffy Puffs)
        lightModeData.fog.forEach(f => {
          f.x += f.speed;
          if (f.x > 1.2) f.x = -0.2;

          const x = f.x * width;
          const y = f.y * height;
          const size = Math.min(width, height) * 0.25 * f.size;

          const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
          grad.addColorStop(0, `rgba(255, 255, 255, ${f.opacity * 0.8})`); // Slightly more visible
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(f.stretch * 1.5, 1);
          ctx.translate(-x, -y);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Render Birds
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';

        lightModeData.birds.forEach(bird => {
          bird.x += bird.speed;
          bird.wingFrame += bird.flapSpeed;

          // Wrap around screen
          if (bird.x > width + 50) {
            bird.x = -50;
            bird.y = Math.random() * (height * 0.5);
          }

          const wingY = Math.sin(bird.wingFrame) * 4 * bird.size;

          ctx.beginPath();
          ctx.moveTo(bird.x, bird.y);
          ctx.quadraticCurveTo(bird.x - 5 * bird.size, bird.y - wingY, bird.x - 10 * bird.size, bird.y + (wingY * 0.5));
          ctx.moveTo(bird.x, bird.y);
          ctx.quadraticCurveTo(bird.x + 5 * bird.size, bird.y - wingY, bird.x + 10 * bird.size, bird.y + (wingY * 0.5));
          ctx.stroke();
        });

        // Render Meteors with Smoke Trails
        lightModeData.meteors.forEach(meteor => {
          if (!meteor.active) {
            // Randomly activate meteors
            if (Math.random() < 0.002) {
              meteor.active = true;
              meteor.x = Math.random() * width;
              meteor.y = -50;
              meteor.vx = (Math.random() - 0.5) * 6;
              meteor.vy = Math.random() * 4 + 3;
              meteor.opacity = 1;
              meteor.trail = [];
            }
            return;
          }

          // Update position
          meteor.x += meteor.vx;
          meteor.y += meteor.vy;

          // Add to trail
          meteor.trail.push({ x: meteor.x, y: meteor.y, opacity: meteor.opacity });
          if (meteor.trail.length > 20) meteor.trail.shift();

          // Fade out
          meteor.opacity -= 0.01;

          // Deactivate if off screen or faded
          if (meteor.y > height + 50 || meteor.x < -50 || meteor.x > width + 50 || meteor.opacity <= 0) {
            meteor.active = false;
            meteor.trail = [];
            return;
          }

          // Draw smoke trail
          meteor.trail.forEach((point, i) => {
            const trailOpacity = (i / meteor.trail.length) * point.opacity * 0.4;
            const size = (i / meteor.trail.length) * 8;

            const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size);
            grad.addColorStop(0, `rgba(255, 255, 255, ${trailOpacity})`);
            grad.addColorStop(1, `rgba(200, 200, 200, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
          });

          // Draw meteor head
          ctx.fillStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Glow
          const meteorGlow = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 12);
          meteorGlow.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity * 0.8})`);
          meteorGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);
          ctx.fillStyle = meteorGlow;
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, 12, 0, Math.PI * 2);
          ctx.fill();
        });
      }


      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starsData, lightModeData, isDarkMode]); // Re-run effect when theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
      style={{ display: 'block' }}

    />
  );
};

export default BackgroundEffects;
