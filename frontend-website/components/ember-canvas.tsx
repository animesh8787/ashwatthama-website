"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const particles: Particle[] = [];
    const MAX = 55;
    let animId: number;

    // Embers gently drift away from the pointer, as if disturbed by
    // presence — never toward it, and only within a short radius. The
    // canvas itself is pointer-events-none (so it never blocks clicks on
    // content above it), so position is tracked on the window instead.
    const pointer = { x: -9999, y: -9999, active: false };
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= W && pointer.y >= 0 && pointer.y <= H;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ResizeObserver (not a window "resize" listener) so the canvas
    // re-measures whenever its actual rendered box changes for any reason —
    // including the layout settling after web fonts finish loading, which
    // previously could leave W/H stuck at a too-small first measurement and
    // trap every particle in a narrow strip on the left.
    function resize(width: number, height: number) {
      W = canvas!.width = width;
      H = canvas!.height = height;
    }
    resize(canvas.offsetWidth, canvas.offsetHeight);
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const box = entry.contentBoxSize?.[0];
      if (box) {
        resize(box.inlineSize, box.blockSize);
      } else {
        resize(canvas!.offsetWidth, canvas!.offsetHeight);
      }
    });
    resizeObserver.observe(canvas);

    function randomParticle(): Particle {
      return {
        x: Math.random() * W,
        y: H + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.4 + Math.random() * 0.9),
        life: 0,
        maxLife: 90 + Math.random() * 120,
        size: 1.2 + Math.random() * 2.4,
        hue: 18 + Math.random() * 28,
      };
    }

    for (let i = 0; i < MAX; i++) {
      const p = randomParticle();
      p.y = Math.random() * H;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function frame() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles[i] = randomParticle();
          continue;
        }
        let driftX = p.vx + Math.sin(p.life * 0.04) * 0.3;
        let driftY = p.vy;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          const radius = 90;
          if (distSq < radius * radius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const push = (1 - dist / radius) * 1.1;
            driftX += (dx / dist) * push;
            driftY += (dy / dist) * push;
          }
        }

        p.x += driftX;
        p.y += driftY;

        const t = p.life / p.maxLife;
        const alpha =
          t < 0.15
            ? (t / 0.15) * 0.55
            : t > 0.75
            ? (1 - (t - 0.75) / 0.25) * 0.55
            : 0.55;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // <canvas> is a replaced element, so `absolute inset-0` alone does not
      // stretch it to fill the container the way it would a <div> — without
      // an explicit w-full/h-full it silently sits at its default intrinsic
      // size (300x150), which is why every particle was trapped in a small
      // box in the top-left corner instead of spanning the hero.
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
