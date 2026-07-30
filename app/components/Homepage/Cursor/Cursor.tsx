"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

type Ripple = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  lineWidth: number;
  hue: number;
  rotation: number;
  squash: number; // for a fun squash/stretch wobble
};

type Sparkle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
};

const DAMPING = 0.96;
const FADE_SPEED = 0.01;
const SPAWN_DISTANCE = 12;
let HUE = 0;

const Cursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripples = useRef<Ripple[]>([]);
  const sparkles = useRef<Sparkle[]>([]);
  const lastSpawn = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const rafId = useRef<number | null>(null);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnSparkles = (x: number, y: number, count: number, hue: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        sparkles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: hue + Math.random() * 40 - 20,
          size: 1.5 + Math.random() * 2,
        });
      }
      if (sparkles.current.length > 200) {
        sparkles.current.splice(0, sparkles.current.length - 200);
      }
    };

    const spawnRipple = (x: number, y: number, big = false) => {
      HUE = (HUE + (big ? 47 : 23)) % 360; // rainbow cycles through hues each spawn
      ripples.current.push({
        x,
        y,
        radius: big ? 8 : 4,
        maxRadius: big ? 240 : 110 + Math.random() * 50,
        alpha: big ? 0.95 : 0.6 + Math.random() * 0.2,
        speed: (big ? 4.6 : 2.8) + Math.random() * 0.8,
        lineWidth: big ? 3 : 1.8 + Math.random() * 1.2,
        hue: HUE,
        rotation: Math.random() * Math.PI * 2,
        squash: 0,
      });
      spawnSparkles(x, y, big ? 24 : 6, HUE);
      if (ripples.current.length > 50) ripples.current.shift();
    };

    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastSpawn.current.x;
      const dy = e.clientY - lastSpawn.current.y;
      if (Math.hypot(dx, dy) > SPAWN_DISTANCE) {
        spawnRipple(e.clientX, e.clientY);
        lastSpawn.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener("mousemove", handleMove);

    const handleClick = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY, true);
    };
    window.addEventListener("click", handleClick);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      time.current += 0.05;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // --- sparkles: little bouncy stars that burst out on each ripple ---
      const sList = sparkles.current;
      for (let i = sList.length - 1; i >= 0; i--) {
        const s = sList[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.06; // light gravity for a playful arc
        s.vx *= 0.98;
        s.life -= 0.02;

        if (s.life <= 0) {
          sList.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${s.life})`;
        ctx.fill();
      }

      // --- rainbow ripples with a bouncy squash/stretch wobble ---
      const list = ripples.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const r = list[i];

        r.speed *= DAMPING;
        r.radius += r.speed;
        r.alpha -= FADE_SPEED * (1 + r.radius / r.maxRadius);
        r.rotation += 0.03;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          list.splice(i, 1);
          continue;
        }

        const progress = r.radius / r.maxRadius;
        // funky squash/stretch: ring pulses into a slight ellipse as it grows
        const wobble = Math.sin(time.current * 3 + r.rotation) * 0.08;
        const scaleX = 1 + wobble;
        const scaleY = 1 - wobble;

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rotation);
        ctx.scale(scaleX, scaleY);

        // hue shifts as the ring expands — rainbow trail effect
        const hueShift = (r.hue + progress * 80) % 360;

        // glow ring
        ctx.save();
        ctx.filter = "blur(2px)";
        ctx.beginPath();
        ctx.arc(0, 0, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hueShift}, 100%, 70%, ${r.alpha * 0.9})`;
        ctx.lineWidth = r.lineWidth * 1.8;
        ctx.stroke();
        ctx.restore();

        // crisp bright edge
        ctx.beginPath();
        ctx.arc(0, 0, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hueShift}, 100%, 85%, ${r.alpha})`;
        ctx.lineWidth = r.lineWidth * 0.6;
        ctx.stroke();

        // trailing rainbow ring behind the crest
        const trailRadius = r.radius * 0.75;
        if (trailRadius > 4) {
          const trailHue = (hueShift + 40) % 360;
          ctx.beginPath();
          ctx.arc(0, 0, trailRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${trailHue}, 100%, 65%, ${r.alpha * 0.4 * (1 - progress)})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // groovy dotted ring — little bouncing dots riding the wave crest
        const dotCount = 10;
        for (let d = 0; d < dotCount; d++) {
          const theta = (d / dotCount) * Math.PI * 2 + time.current * 1.5;
          const bounce = Math.sin(time.current * 6 + d) * 3;
          const dotR = r.radius + bounce;
          const dx = Math.cos(theta) * dotR;
          const dy = Math.sin(theta) * dotR;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${(hueShift + d * 20) % 360}, 100%, 75%, ${r.alpha})`;
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      rafId.current = requestAnimationFrame(draw);
    };

    rafId.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.cursor} />;
};

export default Cursor;