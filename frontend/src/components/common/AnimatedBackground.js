import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#f97316', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 6)],
      opacity: Math.random() * 0.5 + 0.1
    }));

    const orbs = [
      { x: 0.2, y: 0.2, r: 300, color: '#bae6fd' },
      { x: 0.8, y: 0.7, r: 250, color: '#d1fae5' },
      { x: 0.5, y: 0.5, r: 200, color: '#fde68a' }
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw orbs
      orbs.forEach((orb, i) => {
        const x = (orb.x + Math.sin(t * 0.3 + i) * 0.05) * canvas.width;
        const y = (orb.y + Math.cos(t * 0.2 + i) * 0.05) * canvas.height;
        const g = ctx.createRadialGradient(x, y, 0, x, y, orb.r);
        g.addColorStop(0, orb.color + '40');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particles
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Connect nearby particles
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      t += 0.005;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f0fdf4 60%, #fef9ee 100%)' }} />
  );
};

export default AnimatedBackground;