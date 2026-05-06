import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  hue: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];
    const STAR_COUNT = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        drift: (Math.random() - 0.5) * 0.3,
        hue: Math.random() > 0.7 ? 280 : Math.random() > 0.5 ? 195 : 0,
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      stars.forEach((star, i) => {
        // Twinkle
        const twinkle = Math.sin(time * 2 + i * 0.7) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        let color: string;
        if (star.hue === 195) {
          color = `rgba(0, 212, 255, ${star.opacity * twinkle})`;
        } else if (star.hue === 280) {
          color = `rgba(168, 85, 247, ${star.opacity * twinkle})`;
        } else {
          color = `rgba(255, 255, 255, ${star.opacity * twinkle * 0.5})`;
        }

        ctx.fillStyle = color;
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Slowly drift
        star.y -= star.speed;
        star.x += star.drift;

        // Reset if out of bounds
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }
        if (star.x < -10 || star.x > canvas.width + 10) {
          star.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
