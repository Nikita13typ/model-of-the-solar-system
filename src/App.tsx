import { useState, useCallback } from 'react';
import SolarSystemCanvas from './components/SolarSystemCanvas';
import { useCamera } from './hooks/useCamera';
import { planets, PlanetData } from './data/planets';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const {
    camera,
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
    screenToWorld,
    isDragging,
    hasMoved,
  } = useCamera({ x: 0, y: 0, zoom: 0.85 });

  const handleSelectPlanet = useCallback((planet: PlanetData | null) => {
    setSelectedPlanet(planet);
    // Don't move camera on canvas click - user already sees the planet
  }, []);

  const handleFocusPlanet = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
    // Reset to overview when clicking from sidebar
    focusOn(0, 0, 0.85);
  }, [focusOn]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Canvas */}
      <SolarSystemCanvas
        camera={camera}
        isPlaying={isPlaying}
        speed={speed}
        selectedPlanet={selectedPlanet}
        hoveredPlanet={hoveredPlanet}
        onSelectPlanet={handleSelectPlanet}
        onHoverPlanet={setHoveredPlanet}
        screenToWorld={screenToWorld}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        isDragging={isDragging}
        hasMoved={hasMoved}
      />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <div className="flex items-center justify-center pt-4 px-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 pointer-events-auto">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400 bg-clip-text text-transparent text-center">
              ✦ Солнечная Система ✦
            </h1>
            <p className="text-gray-400 text-xs text-center mt-0.5">
              Перетаскивайте • Колёсико для зума • Нажмите на планету
            </p>
          </div>
        </div>
      </div>

      {/* Zoom Controls - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="w-10 h-10 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
          title="Приблизить"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="w-10 h-10 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
          title="Отдалить"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
          </svg>
        </button>
        <button
          onClick={resetCamera}
          className="w-10 h-10 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
          title="Сбросить вид"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <div className="text-center text-xs text-gray-400 bg-black/40 backdrop-blur-lg rounded-lg px-2 py-1 border border-white/5">
          {camera.zoom.toFixed(1)}x
        </div>
      </div>

      {/* Playback Controls - Bottom Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
              isPlaying
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">Скорость</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 md:w-36 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-sm text-white font-mono w-10 text-right">{speed.toFixed(1)}x</span>
            </div>
          </div>

          {/* Speed presets */}
          <div className="hidden md:flex items-center gap-1">
            {[0.5, 1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  Math.abs(speed - s) < 0.05
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Planet List - Left Side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1">
          {planets.map(planet => (
            <button
              key={planet.id}
              onClick={() => handleFocusPlanet(planet)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left group ${
                selectedPlanet?.id === planet.id
                  ? 'bg-white/10 border border-white/20'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.colorInner}, ${planet.color})`,
                  boxShadow: selectedPlanet?.id === planet.id ? `0 0 8px ${planet.color}` : 'none'
                }}
              />
              <span className={`text-xs font-medium ${
                selectedPlanet?.id === planet.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
              } transition-colors`}>
                {planet.nameRu}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Panel - Right Side */}
      {selectedPlanet && showInfo && (
        <div className="absolute right-4 top-20 bottom-20 w-80 z-20 hidden md:block animate-slideIn">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 h-full overflow-y-auto custom-scrollbar">
            {/* Close button */}
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Planet header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex-shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.colorInner}, ${selectedPlanet.color}, ${selectedPlanet.colorOuter})`,
                  boxShadow: `0 0 30px ${selectedPlanet.color}44, inset -4px -4px 10px rgba(0,0,0,0.3)`
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedPlanet.nameRu}</h2>
                <p className="text-gray-400 text-sm">{selectedPlanet.name}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300">
                  {selectedPlanet.type}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {selectedPlanet.description}
            </p>

            {/* Stats */}
            <div className="space-y-2 mb-4">
              <StatRow icon="📏" label="Радиус" value={`${selectedPlanet.radius.toLocaleString()} км`} />
              <StatRow icon="☀️" label="Расстояние" value={`${selectedPlanet.distanceFromSun} млн км`} />
              <StatRow icon="🔄" label="Орбит. период" value={formatPeriod(selectedPlanet.orbitalPeriod)} />
              <StatRow icon="🌡️" label="Температура" value={selectedPlanet.temperature} />
              <StatRow icon="⚖️" label="Гравитация" value={selectedPlanet.gravity} />
              <StatRow icon="🌙" label="Спутники" value={String(selectedPlanet.moons)} />
            </div>

            {/* Facts */}
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <span>💡</span> Интересные факты
              </h3>
              <ul className="space-y-2">
                {selectedPlanet.facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Info Panel */}
      {selectedPlanet && (
        <div className="absolute bottom-24 left-4 right-4 z-20 md:hidden animate-slideUp">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 max-h-60 overflow-y-auto">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.colorInner}, ${selectedPlanet.color})`,
                  boxShadow: `0 0 15px ${selectedPlanet.color}44`
                }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{selectedPlanet.nameRu}</h2>
                <p className="text-gray-400 text-xs">{selectedPlanet.type} • {selectedPlanet.distanceFromSun} млн км</p>
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{selectedPlanet.description}</p>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredPlanet && !selectedPlanet && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: hoveredPlanet.color }}
            />
            <span className="text-white text-sm font-medium">{hoveredPlanet.nameRu}</span>
            <span className="text-gray-400 text-xs">— нажмите для информации</span>
          </div>
        </div>
      )}

      {/* Toggle info button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all md:hidden"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Mobile Planet List - Bottom */}
      <div className="absolute bottom-20 left-4 right-4 z-20 lg:hidden">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {planets.map(planet => (
            <button
              key={planet.id}
              onClick={() => handleFocusPlanet(planet)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
                selectedPlanet?.id === planet.id
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.colorInner}, ${planet.color})`,
                  boxShadow: selectedPlanet?.id === planet.id ? `0 0 8px ${planet.color}` : 'none'
                }}
              />
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                selectedPlanet?.id === planet.id ? 'text-white' : 'text-gray-400'
              }`}>
                {planet.nameRu}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
      <span className="text-base">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
        <div className="text-sm text-white font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function formatPeriod(days: number): string {
  if (days < 365) return `${days} дней`;
  const years = (days / 365.25);
  if (years < 2) return `${days} дней`;
  return `${years.toFixed(1)} лет`;
}
