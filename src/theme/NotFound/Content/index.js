import React, {useEffect, useRef} from 'react';
import styles from './styles.module.css';

export default function NotFoundContent() {
  const canvasRef = useRef(null);
  const fogRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fog = fogRef.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let particles = [];
    let frame;
    const mouse = {x: 0, y: 0};

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1.5;
        this.baseSize = this.size;
        this.speedY = Math.random() * 0.7 + 0.3;
      }

      update() {
        this.y += this.speedY;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 160 && distance > 0) {
          const force = (160 - distance) / 160;
          this.x += dx * force * 0.018;
          this.y += dy * force * 0.018;
        }

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const drawSize = distance < 160 ? this.baseSize * (1 + ((160 - distance) / 160) * 1.8) : this.size;
        const alpha = distance < 160 ? 0.9 + ((160 - distance) / 160) * 0.6 : 0.85;

        context.shadowBlur = distance < 160 ? 22 : 10;
        context.shadowColor = '#d4af37';
        context.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        context.beginPath();
        context.arc(this.x, this.y, drawSize, 0, Math.PI * 2);
        context.fill();
      }
    }

    const createParticles = () => {
      particles = Array.from({length: 80}, () => new Particle());
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      frame = window.requestAnimationFrame(animate);
    };

    const updateMouse = (event) => {
      const bounds = canvas.getBoundingClientRect();
      mouse.x = event.clientX - bounds.left;
      mouse.y = event.clientY - bounds.top;
      fog.style.setProperty('--mouse-x', `${(mouse.x / bounds.width) * 100}%`);
      fog.style.setProperty('--mouse-y', `${(mouse.y / bounds.height) * 100}%`);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', updateMouse);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', updateMouse);
    };
  }, []);

  return (
    <main className={`${styles.notFound} kingdomsx-not-found`}>
      <div className={styles.background} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={fogRef} className={styles.fog} />

      <div className={styles.content}>
        <div className={styles.kingdomLogo}>KINGDOMSX</div>
        <div className={styles.errorCode}>404</div>
        <div className={styles.subtitle}>THE REALM WAS LOST</div>
        <p className={styles.message}>
          The knowledge you seek has fallen into the mists of time.<br />
          Its Nexus has been destroyed, and its banners no longer fly.
        </p>
        <a href="/Home" className={styles.button}>Return to the Main Archives</a>
      </div>
    </main>
  );
}