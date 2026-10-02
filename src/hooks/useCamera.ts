import { useState, useRef, useCallback, useEffect } from 'react';

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export function useCamera(initialCamera: Camera = { x: 0, y: 0, zoom: 1 }) {
  const [camera, setCamera] = useState<Camera>(initialCamera);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const touchStart = useRef<{ dist: number; cx: number; cy: number } | null>(null);
  const animRef = useRef<number>(0);
  const targetCamera = useRef<Camera | null>(null);

  const screenToWorld = useCallback((sx: number, sy: number, rect: DOMRect) => {
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    return {
      x: (sx - cx) / camera.zoom - camera.x,
      y: (sy - cy) / camera.zoom - camera.y,
    };
  }, [camera]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
    setCamera(prev => {
      const newZoom = Math.max(0.15, Math.min(8, prev.zoom * zoomFactor));
      
      // Zoom toward cursor position
      const rect = (e.target as HTMLElement).closest('canvas')?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        const worldX = (mouseX - cx) / prev.zoom - prev.x;
        const worldY = (mouseY - cy) / prev.zoom - prev.y;
        
        const newX = (mouseX - cx) / newZoom - worldX;
        const newY = (mouseY - cy) / newZoom - worldY;
        
        return { x: newX, y: newY, zoom: newZoom };
      }
      
      return { ...prev, zoom: newZoom };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      isDragging.current = true;
      hasMoved.current = false;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      targetCamera.current = null; // Cancel any animation
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      hasMoved.current = true;
    }
    
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setCamera(prev => ({
      ...prev,
      x: prev.x + dx / prev.zoom,
      y: prev.y + dy / prev.zoom,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      hasMoved.current = false;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      targetCamera.current = null;
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      hasMoved.current = true;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      touchStart.current = {
        dist: Math.hypot(dx, dy),
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        hasMoved.current = true;
      }
      
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setCamera(prev => ({
        ...prev,
        x: prev.x + dx / prev.zoom,
        y: prev.y + dy / prev.zoom,
      }));
    } else if (e.touches.length === 2 && touchStart.current) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / touchStart.current.dist;
      touchStart.current.dist = dist;
      setCamera(prev => ({
        ...prev,
        zoom: Math.max(0.15, Math.min(8, prev.zoom * scale)),
      }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    touchStart.current = null;
  }, []);

  const zoomIn = useCallback(() => {
    targetCamera.current = null;
    setCamera(prev => ({ ...prev, zoom: Math.min(8, prev.zoom * 1.4) }));
  }, []);

  const zoomOut = useCallback(() => {
    targetCamera.current = null;
    setCamera(prev => ({ ...prev, zoom: Math.max(0.15, prev.zoom / 1.4) }));
  }, []);

  const resetCamera = useCallback(() => {
    targetCamera.current = { ...initialCamera };
    
    const animateToTarget = () => {
      if (!targetCamera.current) return;
      
      setCamera(prev => {
        const target = targetCamera.current!;
        const lerp = 0.08;
        const newX = prev.x + (target.x - prev.x) * lerp;
        const newY = prev.y + (target.y - prev.y) * lerp;
        const newZoom = prev.zoom + (target.zoom - prev.zoom) * lerp;
        
        const done = Math.abs(newX - target.x) < 0.1 && 
                     Math.abs(newY - target.y) < 0.1 && 
                     Math.abs(newZoom - target.zoom) < 0.001;
        
        if (done) {
          targetCamera.current = null;
          return { x: target.x, y: target.y, zoom: target.zoom };
        }
        
        animRef.current = requestAnimationFrame(animateToTarget);
        return { x: newX, y: newY, zoom: newZoom };
      });
    };
    
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animateToTarget);
  }, [initialCamera]);

  const focusOn = useCallback((x: number, y: number, zoom?: number) => {
    setCamera(prev => {
      targetCamera.current = {
        x: x,
        y: y,
        zoom: zoom ?? prev.zoom,
      };
      return prev;
    });
    
    // Animate to target
    const animateToTarget = () => {
      if (!targetCamera.current) return;
      
      setCamera(prev => {
        const target = targetCamera.current!;
        const lerp = 0.08;
        const newX = prev.x + (target.x - prev.x) * lerp;
        const newY = prev.y + (target.y - prev.y) * lerp;
        const newZoom = prev.zoom + (target.zoom - prev.zoom) * lerp;
        
        const done = Math.abs(newX - target.x) < 0.1 && 
                     Math.abs(newY - target.y) < 0.1 && 
                     Math.abs(newZoom - target.zoom) < 0.001;
        
        if (done) {
          targetCamera.current = null;
          return { x: target.x, y: target.y, zoom: target.zoom };
        }
        
        animRef.current = requestAnimationFrame(animateToTarget);
        return { x: newX, y: newY, zoom: newZoom };
      });
    };
    
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animateToTarget);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return {
    camera,
    setCamera,
    screenToWorld,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    zoomIn,
    zoomOut,
    resetCamera,
    focusOn,
    isDragging,
    hasMoved,
  };
}
