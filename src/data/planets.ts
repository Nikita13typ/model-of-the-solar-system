export interface PlanetData {
  id: string;
  name: string;
  nameRu: string;
  radius: number;
  distanceFromSun: number;
  orbitalPeriod: number;
  color: string;
  colorInner: string;
  colorOuter: string;
  orbitRadius: number;
  size: number;
  description: string;
  facts: string[];
  hasRings?: boolean;
  ringColor?: string;
  moons: number;
  gravity: string;
  temperature: string;
  type: string;
  angle: number;
  trailColor: string;
}

export const SUN = {
  radius: 696340,
  displaySize: 35,
  color: '#FDB813',
  colorInner: '#FFFFFF',
  colorOuter: '#FF6B00',
};

export const planets: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 2439,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#B5B5B5',
    colorInner: '#D4D4D4',
    colorOuter: '#6B6B6B',
    orbitRadius: 80,
    size: 4,
    description: 'Самая маленькая планета Солнечной системы и ближайшая к Солнцу. Несмотря на близость к звезде, не является самой горячей — эту честь держит Венера.',
    facts: [
      'Один день на Меркурии длится 59 земных дней',
      'Температура колеблется от -180°C до +430°C',
      'Не имеет атмосферы и спутников',
      'Поверхность покрыта кратерами, как Луна'
    ],
    moons: 0,
    gravity: '3.7 м/с²',
    temperature: '-180°C ... +430°C',
    type: 'Скалистая планета',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#B5B5B530',
  },
  {
    id: 'venus',
    name: 'Venus',
    nameRu: 'Венера',
    radius: 6052,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#E8CDA0',
    colorInner: '#F5E6C8',
    colorOuter: '#C4956A',
    orbitRadius: 120,
    size: 8,
    description: 'Самая горячая планета из-за парникового эффекта. Вращается в обратном направлении — Солнце восходит на западе.',
    facts: [
      'Атмосферное давление в 90 раз выше земного',
      'Вращается в обратном направлении',
      'Самая яркая планета на небе после Луны',
      'Один день длиннее одного года'
    ],
    moons: 0,
    gravity: '8.87 м/с²',
    temperature: '~465°C',
    type: 'Скалистая планета',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#E8CDA030',
  },
  {
    id: 'earth',
    name: 'Earth',
    nameRu: 'Земля',
    radius: 6378,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: '#4DA6FF',
    colorInner: '#7EC8E3',
    colorOuter: '#1A5276',
    orbitRadius: 170,
    size: 9,
    description: 'Наш дом — единственная известная планета с жизнью. 71% поверхности покрыт водой, а магнитное поле защищает от солнечной радиации.',
    facts: [
      'Единственная планета с жидкой водой на поверхности',
      'Магнитное поле защищает от солнечного ветра',
      'Возраст: ~4.5 миллиарда лет',
      'Атмосфера: 78% азот, 21% кислород'
    ],
    moons: 1,
    gravity: '9.81 м/с²',
    temperature: '-89°C ... +57°C',
    type: 'Скалистая планета',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#4DA6FF30',
  },
  {
    id: 'mars',
    name: 'Mars',
    nameRu: 'Марс',
    radius: 3396,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#E07050',
    colorInner: '#F09070',
    colorOuter: '#8B3A2A',
    orbitRadius: 225,
    size: 6,
    description: 'Красная планета — главный кандидат для колонизации. Здесь находится Олимп — самый высокий вулкан в Солнечной системе (21.9 км).',
    facts: [
      'Гора Олимп — 21.9 км, в 2.5 раза выше Эвереста',
      'Каньон Маринер длиной 4000 км',
      'Имеет два спутника: Фобос и Деймос',
      'Марсоходы исследуют поверхность с 1997 года'
    ],
    moons: 2,
    gravity: '3.72 м/с²',
    temperature: '-140°C ... +20°C',
    type: 'Скалистая планета',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#E0705030',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 71492,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#E8A87C',
    colorInner: '#F5C9A8',
    colorOuter: '#A06030',
    orbitRadius: 320,
    size: 22,
    description: 'Крупнейшая планета — в неё поместились бы все остальные планеты. Большое Красное Пятно — шторм, бушующий более 350 лет.',
    facts: [
      'Масса в 318 раз больше Земли',
      'Большое Красное Пятно — шторм размером с 2 Земли',
      'Имеет 95 известных спутников',
      'Самые короткие сутки — всего 10 часов'
    ],
    moons: 95,
    gravity: '24.79 м/с²',
    temperature: '~-110°C',
    type: 'Газовый гигант',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#E8A87C20',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 60268,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#F0D890',
    colorInner: '#FFF0C0',
    colorOuter: '#B8960A',
    orbitRadius: 420,
    size: 19,
    description: 'Владелец великолепных колец из миллиардов частиц льда и камня. Плотность настолько мала, что Сатурн мог бы плавать в воде.',
    facts: [
      'Кольца простираются на 282 000 км, но толщиной всего ~10 м',
      'Плотность меньше воды — мог бы плавать!',
      'Спутник Титан имеет плотную атмосферу',
      'Имеет 146 известных спутников'
    ],
    hasRings: true,
    ringColor: '#F0D89088',
    moons: 146,
    gravity: '10.44 м/с²',
    temperature: '~-140°C',
    type: 'Газовый гигант',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#F0D89020',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 25559,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7DE8E8',
    colorInner: '#A0FFFF',
    colorOuter: '#3A8888',
    orbitRadius: 520,
    size: 14,
    description: 'Уникальный ледяной гигант, вращающийся «на боку» — его ось наклонена на 98°. Был первой планетой, открытой с помощью телескопа.',
    facts: [
      'Ось вращения наклонена на 98° — катится по орбите',
      'Открыт Уильямом Гершелем в 1781 году',
      'Имеет 13 тусклых колец',
      'Самая холодная атмосфера: до -224°C'
    ],
    moons: 28,
    gravity: '8.87 м/с²',
    temperature: '~-224°C',
    type: 'Ледяной гигант',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#7DE8E820',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 24764,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4070E0',
    colorInner: '#6090FF',
    colorOuter: '#1A3080',
    orbitRadius: 600,
    size: 13,
    description: 'Самая далёкая планета с рекордными ветрами до 2100 км/ч. Был открыт благодаря математическим расчётам, а не наблюдениям.',
    facts: [
      'Ветры достигают 2100 км/ч — рекорд в Солнечной системе',
      'Открыт в 1846 году по математическим расчётам',
      'Спутник Тритон движется по обратной орбите',
      'Совершает один оборот за 165 земных лет'
    ],
    moons: 16,
    gravity: '11.15 м/с²',
    temperature: '~-214°C',
    type: 'Ледяной гигант',
    angle: Math.random() * Math.PI * 2,
    trailColor: '#4070E020',
  },
];
