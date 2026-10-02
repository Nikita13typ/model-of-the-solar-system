import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  radius: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  orbitRadius: number; // px for display
  size: number; // px for display
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 2439,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    orbitRadius: 70,
    size: 6,
    description: 'Самая маленькая планета и ближайшая к Солнцу. Поверхность покрыта кратерами.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 6052,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    orbitRadius: 100,
    size: 10,
    description: 'Самая горячая планета с плотной атмосферой из углекислого газа.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 6378,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    orbitRadius: 140,
    size: 11,
    description: 'Наш дом! Единственная известная планета с жизнью и жидкой водой на поверхности.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 3396,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    orbitRadius: 185,
    size: 8,
    description: 'Красная планета с самой высокой горой в Солнечной системе — Олимп.'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 71492,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#e8a87c',
    orbitRadius: 250,
    size: 28,
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном — гигантским штормом.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 60268,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#f0d890',
    orbitRadius: 320,
    size: 24,
    description: 'Знаменита своими великолепными кольцами из льда и камней.'
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 25559,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    orbitRadius: 385,
    size: 18,
    description: 'Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°.'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 24764,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4070e0',
    orbitRadius: 440,
    size: 17,
    description: 'Самая далёкая планета с сильнейшими ветрами до 2100 км/ч.'
  }
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      const newAngles = anglesRef.current.map((angle, index) => {
        // Base speed: Earth completes orbit in ~10 seconds at speed 1
        const baseSpeed = (2 * Math.PI) / (planets[index].orbitalPeriod / 365 * 10);
        return angle + baseSpeed * delta * speed;
      });
      anglesRef.current = newAngles;
      setAngles([...newAngles]);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet);
  };

  const centerX = 480;
  const centerY = 480;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <header className="w-full py-4 px-6 text-center bg-gradient-to-b from-gray-900 to-transparent">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
          🌌 Солнечная Система
        </h1>
        <p className="text-gray-400 text-sm mt-1">Нажмите на планету для получения информации</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 w-full max-w-7xl px-4 flex-1">
        {/* Solar System Visualization */}
        <div className="relative flex-shrink-0 w-full max-w-[530px] aspect-square flex items-center justify-center overflow-hidden">
          <div
            className="relative rounded-full border border-gray-800"
            style={{
              width: '960px',
              height: '960px',
              transform: 'scale(0.55)',
              transformOrigin: 'center center',
              background: 'radial-gradient(circle, #0a0a2e 0%, #000010 100%)'
            }}
          >
            {/* Stars background */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            {/* Sun */}
            <div
              className="absolute rounded-full cursor-pointer z-10"
              style={{
                width: '60px',
                height: '60px',
                left: centerX - 30 + 'px',
                top: centerY - 30 + 'px',
                background: 'radial-gradient(circle, #fff7a0 0%, #ffcc00 30%, #ff8800 70%, #ff4400 100%)',
                boxShadow: '0 0 40px #ff8800, 0 0 80px #ff660088, 0 0 120px #ff440044'
              }}
              onClick={() => setSelectedPlanet(null)}
            >
              <div className="absolute inset-0 rounded-full animate-pulse opacity-50"
                style={{ background: 'radial-gradient(circle, #fff7a0 0%, transparent 70%)' }}
              />
            </div>

            {/* Orbits and Planets */}
            {planets.map((planet, index) => {
              const x = centerX + Math.cos(angles[index]) * planet.orbitRadius;
              const y = centerY + Math.sin(angles[index]) * planet.orbitRadius;
              const isSelected = selectedPlanet?.name === planet.name;

              return (
                <div key={planet.name}>
                  {/* Orbit path */}
                  <div
                    className="absolute rounded-full border border-gray-700/40"
                    style={{
                      width: planet.orbitRadius * 2 + 'px',
                      height: planet.orbitRadius * 2 + 'px',
                      left: centerX - planet.orbitRadius + 'px',
                      top: centerY - planet.orbitRadius + 'px',
                    }}
                  />
                  {/* Planet */}
                  <div
                    className={`absolute rounded-full cursor-pointer transition-transform duration-200 hover:scale-150 z-20 ${isSelected ? 'scale-150' : ''}`}
                    style={{
                      width: planet.size + 'px',
                      height: planet.size + 'px',
                      left: x - planet.size / 2 + 'px',
                      top: y - planet.size / 2 + 'px',
                      background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${adjustColor(planet.color, -40)})`,
                      boxShadow: isSelected
                        ? `0 0 15px ${planet.color}, 0 0 30px ${planet.color}88`
                        : `0 0 5px ${planet.color}66`,
                    }}
                    onClick={() => handlePlanetClick(planet)}
                    title={planet.nameRu}
                  >
                    {/* Saturn's ring */}
                    {planet.name === 'Saturn' && (
                      <div
                        className="absolute"
                        style={{
                          width: planet.size * 2 + 'px',
                          height: planet.size * 0.5 + 'px',
                          left: -(planet.size * 0.5) + 'px',
                          top: planet.size * 0.3 + 'px',
                          border: `2px solid ${planet.color}88`,
                          borderRadius: '50%',
                          transform: 'rotateX(60deg)'
                        }}
                      />
                    )}
                  </div>
                  {/* Planet label */}
                  <div
                    className="absolute text-xs text-gray-400 pointer-events-none font-medium"
                    style={{
                      left: x - 20 + 'px',
                      top: y + planet.size / 2 + 4 + 'px',
                      width: '40px',
                      textAlign: 'center',
                      fontSize: '9px'
                    }}
                  >
                    {planet.nameRu}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4 pb-6">
          {/* Planet Info Card */}
          {selectedPlanet && (
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${adjustColor(selectedPlanet.color, -40)})`,
                    boxShadow: `0 0 20px ${selectedPlanet.color}66`
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
                  <p className="text-gray-400 text-sm">{selectedPlanet.name}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPlanet.description}</p>
              <div className="space-y-3">
                <InfoRow icon="📏" label="Радиус" value={`${selectedPlanet.radius.toLocaleString()} км`} />
                <InfoRow icon="☀️" label="Расстояние от Солнца" value={`${selectedPlanet.distanceFromSun} млн км`} />
                <InfoRow icon="🔄" label="Орбитальный период" value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)} />
              </div>
            </div>
          )}

          {!selectedPlanet && (
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🪐</div>
                <h2 className="text-lg font-semibold text-white mb-2">Выберите планету</h2>
                <p className="text-gray-400 text-sm">
                  Нажмите на любую планету на схеме, чтобы узнать о ней больше
                </p>
              </div>
              <div className="mt-4 space-y-1">
                {planets.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlanet(p)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ background: p.color }}
                    />
                    <span className="text-gray-300 text-sm">{p.nameRu}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Управление</h3>

            {/* Play/Pause */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isPlaying
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Пауза
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Воспроизведение
                  </>
                )}
              </button>
            </div>

            {/* Speed Control */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Скорость: <span className="text-white font-medium">{speed}x</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>

            {/* Speed Presets */}
            <div className="flex gap-2 mt-3">
              {[0.5, 1, 2, 5, 10].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                    speed === s
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Масштаб</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              ⚠️ Масштабы орбит и размеров планет не соответствуют реальным пропорциям.
              Планеты увеличены для наглядности, а расстояния сжаты для удобства отображения.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-white font-medium">{value}</div>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} дней`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} лет (${days.toLocaleString()} дней)`;
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
