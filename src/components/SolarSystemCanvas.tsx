import { useRef, useEffect, useCallback, useState } from 'react';
import { planets, PlanetData, SUN } from '../data/planets';
import { Camera } from '../hooks/useCamera';

interface SolarSystemCanvasProps {
  camera: Camera;
  isPlaying: boolean;
  speed: number;
  selectedPlanet: PlanetData | null;
  hoveredPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  onHoverPlanet: (planet: PlanetData | null) => void;
  screenToWorld: (sx: number, sy: number, rect: DOMRect) => { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onWheel: (e: WheelEvent) => void;
  isDragging: React.MutableRefObject<boolean>;
  hasMoved: React.MutableRefObject<boolean>;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number;
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 4000,
      y: (Math.random() - 0.5) * 4000,
      size: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
      layer: Math.floor(Math.random() * 3),
    });
  }
  return stars;
}

export default function SolarSystemCanvas({
  camera,
  isPlaying,
  speed,
  selectedPlanet,
  hoveredPlanet,
  onSelectPlanet,
  onHoverPlanet,
  screenToWorld,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onWheel,
  isDragging,
  hasMoved,
}: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const anglesRef = useRef<number[]>(planets.map(p => p.angle));
  const starsRef = useRef<Star[]>(generateStars(500));
  const trailsRef = useRef<Array<{ x: number; y: number }[]>>(
    planets.map(() => [])
  );
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(0);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wheel event
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // Click detection
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasMoved.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy, rect);

    // Check if clicked on a planet
    let clicked: PlanetData | null = null;
    for (let i = planets.length - 1; i >= 0; i--) {
      const p = planets[i];
      const px = Math.cos(anglesRef.current[i]) * p.orbitRadius;
      const py = Math.sin(anglesRef.current[i]) * p.orbitRadius;
      const dist = Math.hypot(world.x - px, world.y - py);
      const hitRadius = Math.max(p.size * 1.8, 15) / camera.zoom;
      if (dist < hitRadius) {
        clicked = p;
        break;
      }
    }

    // Check sun click
    if (!clicked) {
      const sunDist = Math.hypot(world.x, world.y);
      if (sunDist < SUN.displaySize * 1.5 / camera.zoom) {
        onSelectPlanet(null);
        return;
      }
    }

    onSelectPlanet(clicked);
  }, [screenToWorld, camera.zoom, onSelectPlanet, hasMoved]);

  const handleMouseMoveCanvas = useCallback((e: React.MouseEvent) => {
    onMouseMove(e);
    if (isDragging.current) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy, rect);

    let hovered: PlanetData | null = null;
    for (let i = planets.length - 1; i >= 0; i--) {
      const p = planets[i];
      const px = Math.cos(anglesRef.current[i]) * p.orbitRadius;
      const py = Math.sin(anglesRef.current[i]) * p.orbitRadius;
      const dist = Math.hypot(world.x - px, world.y - py);
      const hitRadius = Math.max(p.size * 1.8, 15) / camera.zoom;
      if (dist < hitRadius) {
        hovered = p;
        break;
      }
    }
    onHoverPlanet(hovered);
  }, [screenToWorld, camera.zoom, onHoverPlanet, onMouseMove, isDragging]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      timeRef.current += delta;

      if (isPlaying) {
        anglesRef.current = anglesRef.current.map((angle, i) => {
          const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod / 365 * 12);
          return angle + baseSpeed * delta * speed;
        });

        // Update trails
        anglesRef.current.forEach((angle, i) => {
          const px = Math.cos(angle) * planets[i].orbitRadius;
          const py = Math.sin(angle) * planets[i].orbitRadius;
          trailsRef.current[i].push({ x: px, y: py });
          if (trailsRef.current[i].length > 80) {
            trailsRef.current[i].shift();
          }
        });
      }

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      bgGrad.addColorStop(0, '#0a0a2e');
      bgGrad.addColorStop(0.5, '#050520');
      bgGrad.addColorStop(1, '#000008');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Save and apply camera transform
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(camera.x, camera.y);

      // Draw stars with parallax
      const parallaxFactors = [0.03, 0.1, 0.25];
      starsRef.current.forEach(star => {
        const pf = parallaxFactors[star.layer];
        const sx = star.x + camera.x * pf;
        const sy = star.y + camera.y * pf;
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size / camera.zoom, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw orbit paths
      planets.forEach((planet) => {
        const isSelected = selectedPlanet?.id === planet.id;
        const isHovered = hoveredPlanet?.id === planet.id;
        ctx.beginPath();
        ctx.arc(0, 0, planet.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? `${planet.color}50`
          : isHovered
            ? `${planet.color}35`
            : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = (isSelected ? 1.5 : 0.8) / camera.zoom;
        if (!isSelected && !isHovered) {
          ctx.setLineDash([3 / camera.zoom, 6 / camera.zoom]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw trails
      planets.forEach((planet, i) => {
        const trail = trailsRef.current[i];
        if (trail.length < 2) return;
        for (let j = 1; j < trail.length; j++) {
          const alpha = (j / trail.length) * 0.4;
          ctx.beginPath();
          ctx.moveTo(trail[j - 1].x, trail[j - 1].y);
          ctx.lineTo(trail[j].x, trail[j].y);
          ctx.strokeStyle = planet.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = (planet.size * 0.3) / camera.zoom;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });

      // Draw Sun
      // Outer glow
      const sunGlow = ctx.createRadialGradient(0, 0, SUN.displaySize * 0.5, 0, 0, SUN.displaySize * 5);
      sunGlow.addColorStop(0, 'rgba(255, 200, 50, 0.25)');
      sunGlow.addColorStop(0.2, 'rgba(255, 150, 0, 0.12)');
      sunGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.04)');
      sunGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, SUN.displaySize * 5, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Corona rays
      const rayCount = 16;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + timeRef.current * 0.08;
        const rayLen = SUN.displaySize * (2.5 + Math.sin(timeRef.current * 1.5 + i * 0.7) * 0.8);
        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle) * SUN.displaySize * 0.9,
          Math.sin(angle) * SUN.displaySize * 0.9
        );
        ctx.lineTo(
          Math.cos(angle) * rayLen,
          Math.sin(angle) * rayLen
        );
        const rayAlpha = 0.06 + Math.sin(timeRef.current * 2 + i) * 0.03;
        ctx.strokeStyle = `rgba(255, 180, 50, ${rayAlpha})`;
        ctx.lineWidth = (2 + Math.sin(timeRef.current + i) * 1) / camera.zoom;
        ctx.stroke();
      }

      // Sun body
      const sunGrad = ctx.createRadialGradient(
        -SUN.displaySize * 0.25, -SUN.displaySize * 0.25, 0,
        0, 0, SUN.displaySize
      );
      sunGrad.addColorStop(0, SUN.colorInner);
      sunGrad.addColorStop(0.3, SUN.color);
      sunGrad.addColorStop(0.7, SUN.colorOuter);
      sunGrad.addColorStop(1, '#CC3300');
      ctx.beginPath();
      ctx.arc(0, 0, SUN.displaySize, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Sun surface turbulence
      for (let i = 0; i < 5; i++) {
        const turbAngle = timeRef.current * 0.3 + i * 1.2;
        const turbX = Math.cos(turbAngle) * SUN.displaySize * 0.4;
        const turbY = Math.sin(turbAngle) * SUN.displaySize * 0.4;
        const turbGrad = ctx.createRadialGradient(turbX, turbY, 0, turbX, turbY, SUN.displaySize * 0.4);
        turbGrad.addColorStop(0, 'rgba(255, 255, 150, 0.15)');
        turbGrad.addColorStop(1, 'rgba(255, 200, 50, 0)');
        ctx.beginPath();
        ctx.arc(turbX, turbY, SUN.displaySize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = turbGrad;
        ctx.fill();
      }

      // Draw planets
      planets.forEach((planet, i) => {
        const angle = anglesRef.current[i];
        const px = Math.cos(angle) * planet.orbitRadius;
        const py = Math.sin(angle) * planet.orbitRadius;
        const isSelected = selectedPlanet?.id === planet.id;
        const isHovered = hoveredPlanet?.id === planet.id;
        const displaySize = planet.size * (isSelected ? 1.3 : isHovered ? 1.15 : 1);

        // Atmosphere glow for Earth and Venus
        if (planet.id === 'earth' || planet.id === 'venus') {
          const atmoGrad = ctx.createRadialGradient(px, py, displaySize * 0.9, px, py, displaySize * 2.5);
          atmoGrad.addColorStop(0, `${planet.color}20`);
          atmoGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(px, py, displaySize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = atmoGrad;
          ctx.fill();
        }

        // Saturn rings
        if (planet.hasRings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.3);
          ctx.scale(1, 0.35);
          
          // Outer ring
          ctx.beginPath();
          ctx.arc(0, 0, displaySize * 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = `${planet.color}30`;
          ctx.lineWidth = displaySize * 0.5 / camera.zoom;
          ctx.stroke();
          
          // Middle ring
          ctx.beginPath();
          ctx.arc(0, 0, displaySize * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `${planet.color}50`;
          ctx.lineWidth = displaySize * 0.35 / camera.zoom;
          ctx.stroke();
          
          // Inner ring
          ctx.beginPath();
          ctx.arc(0, 0, displaySize * 1.4, 0, Math.PI * 2);
          ctx.strokeStyle = `${planet.color}25`;
          ctx.lineWidth = displaySize * 0.2 / camera.zoom;
          ctx.stroke();
          
          ctx.restore();
        }

        // Planet shadow
        const shadowAngle = angle + Math.PI * 0.8;
        const shadowOffsetX = Math.cos(shadowAngle) * displaySize * 0.25;
        const shadowOffsetY = Math.sin(shadowAngle) * displaySize * 0.25;

        // Planet body with gradient
        const planetGrad = ctx.createRadialGradient(
          px - displaySize * 0.35, py - displaySize * 0.35, 0,
          px + shadowOffsetX, py + shadowOffsetY, displaySize * 1.3
        );
        planetGrad.addColorStop(0, planet.colorInner);
        planetGrad.addColorStop(0.5, planet.color);
        planetGrad.addColorStop(1, planet.colorOuter);
        ctx.beginPath();
        ctx.arc(px, py, displaySize, 0, Math.PI * 2);
        ctx.fillStyle = planetGrad;
        ctx.fill();

        // Specular highlight
        const specGrad = ctx.createRadialGradient(
          px - displaySize * 0.4, py - displaySize * 0.4, 0,
          px - displaySize * 0.4, py - displaySize * 0.4, displaySize * 0.5
        );
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.arc(px, py, displaySize, 0, Math.PI * 2);
        ctx.fillStyle = specGrad;
        ctx.fill();

        // Jupiter bands
        if (planet.id === 'jupiter') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, displaySize, 0, Math.PI * 2);
          ctx.clip();
          for (let b = -4; b <= 4; b++) {
            const bandY = py + b * displaySize * 0.22;
            ctx.beginPath();
            ctx.moveTo(px - displaySize, bandY);
            ctx.lineTo(px + displaySize, bandY);
            ctx.strokeStyle = b % 2 === 0 ? 'rgba(180, 100, 50, 0.25)' : 'rgba(220, 170, 120, 0.15)';
            ctx.lineWidth = displaySize * 0.1;
            ctx.stroke();
          }
          // Great Red Spot
          ctx.beginPath();
          ctx.ellipse(px + displaySize * 0.25, py + displaySize * 0.1, displaySize * 0.2, displaySize * 0.13, 0.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200, 80, 50, 0.4)';
          ctx.fill();
          ctx.restore();
        }

        // Mars surface features
        if (planet.id === 'mars') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, displaySize, 0, Math.PI * 2);
          ctx.clip();
          // Polar cap
          ctx.beginPath();
          ctx.arc(px, py - displaySize * 0.7, displaySize * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fill();
          ctx.restore();
        }

        // Selection / hover ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(px, py, displaySize + 4 / camera.zoom, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? `${planet.color}BB` : `${planet.color}55`;
          ctx.lineWidth = 1.5 / camera.zoom;
          ctx.stroke();

          if (isSelected) {
            // Animated selection ring
            const pulse = Math.sin(timeRef.current * 3) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(px, py, displaySize + 8 / camera.zoom, 0, Math.PI * 2);
            const hex = Math.floor(pulse * 100).toString(16).padStart(2, '0');
            ctx.strokeStyle = `${planet.color}${hex}`;
            ctx.lineWidth = 1 / camera.zoom;
            ctx.stroke();
          }
        }

        // Planet name label
        const fontSize = Math.max(9, Math.min(13, 12 / camera.zoom));
        ctx.font = `${isSelected ? '600' : '400'} ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        const labelAlpha = isSelected ? 1 : isHovered ? 0.85 : 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${labelAlpha})`;
        ctx.fillText(planet.nameRu, px, py + displaySize + fontSize + 2 / camera.zoom);
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [camera, isPlaying, speed, selectedPlanet, hoveredPlanet]);

  // Set canvas size with DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = canvasSize.width + 'px';
    canvas.style.height = canvasSize.height + 'px';
  }, [canvasSize]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={handleClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
}
