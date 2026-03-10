'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Flame,
  Trophy,
  User,
  Star,
  Zap,
  HelpCircle,
  ChevronDown,
  Globe,
  X,
} from 'lucide-react';
import { CATEGORIES, CategoryKey, Category } from '@/lib/data/meta';
import { GUIDES } from '@/lib/data/guides';
import { getProgress, setName, setLanguage, setDarkMode, Progress } from '@/lib/storage';
import { ModeSelector } from './ModeSelector';
import { ExercisePlayer } from './ExercisePlayer';

const TABS = {
  HOME: 'HOME',
  DAILY: 'DAILY',
  RANKING: 'RANKING',
  PROFILE: 'PROFILE',
} as const;

type TabKey = typeof TABS[keyof typeof TABS];

const translations: Record<string, Record<string, string>> = {
  es: {
    points: 'Puntos',
    navHome: 'Inicio',
    navDaily: 'Desafío',
    navRanking: 'Ranking',
    navProfile: 'Perfil',
    quickSession: 'Sesión rápida',
    whatPractice: '¿Qué quieres practicar hoy?',
    currentMode: 'Modo actual',
    dailyChallenge: 'Desafío diario',
    rankingTitle: 'Tabla de posiciones local',
    profileTitle: 'Tu identidad en Deriva+',
    settings: 'Configuración',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    save: 'Guardar',
    name: 'Nombre',
    help: 'Ayuda',
    close: 'Cerrar',
    selectLanguage: 'Seleccionar idioma',
    achievements: 'Logros',
    avatarSelector: 'Selector de avatar',
  },
  en: {
    points: 'Points',
    navHome: 'Home',
    navDaily: 'Challenge',
    navRanking: 'Ranking',
    navProfile: 'Profile',
    quickSession: 'Quick session',
    whatPractice: 'What do you want to practice today?',
    currentMode: 'Current mode',
    dailyChallenge: 'Daily challenge',
    rankingTitle: 'Local leaderboard',
    profileTitle: 'Your identity in Deriva+',
    settings: 'Settings',
    darkMode: 'Dark mode',
    language: 'Language',
    save: 'Save',
    name: 'Name',
    help: 'Help',
    close: 'Close',
    selectLanguage: 'Select language',
    achievements: 'Achievements',
    avatarSelector: 'Avatar selector',
  },
  ca: {
    points: 'Punts',
    navHome: 'Inici',
    navDaily: 'Repte',
    navRanking: 'Rànquing',
    navProfile: 'Perfil',
    quickSession: 'Sessió ràpida',
    whatPractice: 'Què vols practicar avui?',
    currentMode: 'Mode actual',
    dailyChallenge: 'Repte diari',
    rankingTitle: 'Classificació local',
    profileTitle: 'La teva identitat a Deriva+',
    settings: 'Configuració',
    darkMode: 'Mode fosc',
    language: 'Llengua',
    save: 'Desar',
    name: 'Nom',
    help: 'Ajuda',
    close: 'Tancar',
    selectLanguage: 'Seleccionar idioma',
    achievements: 'Assoliments',
    avatarSelector: 'Selector d\'avatar',
  },
  eu: {
    points: 'Puntuak',
    navHome: 'Hasiera',
    navDaily: 'Erronka',
    navRanking: 'Sailkapena',
    navProfile: 'Profila',
    quickSession: 'Saioko saioa',
    whatPractice: 'Zer praktikatu nahi duzu gaur?',
    currentMode: 'Uneko modua',
    dailyChallenge: 'Eguneko erronka',
    rankingTitle: 'Sailkapen lokala',
    profileTitle: 'Zure identitatea Deriva+-n',
    settings: 'Ezarpenak',
    darkMode: 'Modu iluna',
    language: 'Hizkuntza',
    save: 'Gorde',
    name: 'Izena',
    help: 'Laguntza',
    close: 'Itxi',
    selectLanguage: 'Hizkuntza aukeratu',
    achievements: 'Lorpenak',
    avatarSelector: 'Avatar hautatzailea',
  },
};

function buildCalendar(streakDays: string[] = []) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Array<{ label: string; key: string; inStreak: boolean }> = [];
  const startWeekday = firstDay.getDay();

  for (let i = 0; i < startWeekday; i += 1) {
    days.push({ label: '', key: `blank-${i}`, inStreak: false });
  }

  const streakSet = new Set(streakDays);

  for (let d = 1; d <= lastDay.getDate(); d += 1) {
    const date = new Date(year, month, d);
    const iso = date.toISOString().slice(0, 10);
    days.push({
      label: String(d),
      key: iso,
      inStreak: streakSet.has(iso),
    });
  }

  return { days, month, year };
}

interface CollapsibleCategoryProps {
  categoryKey: CategoryKey;
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectMode: (categoryKey: CategoryKey, modeKey: string) => void;
  activeModeKey: string;
  activeCategoryKey: string;
  activeGuide: Array<{ title: string; content: string }>;
  openHelp: () => void;
}

function CollapsibleCategory({
  categoryKey,
  category,
  isExpanded,
  onToggle,
  onSelectMode,
  activeModeKey,
  activeCategoryKey,
  activeGuide,
  openHelp,
}: CollapsibleCategoryProps) {
  const colorMap: Record<string, { bg: string; bgLight: string; text: string; border: string; shadow: string }> = {
    sky: { bg: 'bg-sky-500', bgLight: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', shadow: 'shadow-sky-100' },
    emerald: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', shadow: 'shadow-emerald-100' },
    rose: { bg: 'bg-rose-500', bgLight: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', shadow: 'shadow-rose-100' },
  };

  const colors = colorMap[category.color] || colorMap.sky;
  const isActive = activeCategoryKey === categoryKey;

  return (
    <div className={`rounded-3xl border-2 ${colors.border} ${colors.bgLight} overflow-hidden shadow-lg ${colors.shadow} transition-all duration-300`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${colors.bg} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
            {category.symbol}
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${colors.text}`}>{category.name}</h3>
            <p className="text-xs text-muted-foreground">
              {category.modes.length} modos disponibles
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-5 h-5 ${colors.text}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <ModeSelector
                category={category}
                modeKey={isActive ? activeModeKey : category.modes[0].key}
                onChange={(key) => onSelectMode(categoryKey, key)}
              />

              {isActive && (
                <>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={openHelp}
                      className={`absolute right-2 top-2 z-10 w-8 h-8 ${colors.bg} text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <ExercisePlayer
                      categoryKey={categoryKey}
                      modeKey={activeModeKey}
                      category={category}
                    />
                  </div>

                  {activeGuide.length > 0 && (
                    <div className={`rounded-2xl border ${colors.border} bg-white/80 px-4 py-3`}>
                      <p className={`text-xs font-semibold ${colors.text} mb-2`}>
                        Mini-guía para este modo
                      </p>
                      <ul className="space-y-1.5">
                        {activeGuide.map((item) => (
                          <li key={item.title} className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{item.title}: </span>
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MathApp() {
  const [tab, setTab] = useState<TabKey>(TABS.HOME);
  const [activeCategoryKey, setActiveCategoryKey] = useState<CategoryKey>('derivatives');
  const [activeModeKey, setActiveModeKey] = useState('expres');
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>('derivatives');
  const [selectedAvatar, setSelectedAvatar] = useState('📐');
  const [progress, setProgressState] = useState<Progress>(() => getProgress());
  const [nameInput, setNameInput] = useState(progress.name || 'Invitado');
  const [rankingFilter, setRankingFilter] = useState('global');
  const [languageState, setLanguageState] = useState(progress.language || 'es');
  const [darkMode, setDarkModeState] = useState(progress.darkMode || false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [helpContent, setHelpContent] = useState({ definition: '', how: '' });

  const activeCategory = CATEGORIES[activeCategoryKey];
  const activeGuide = useMemo(() => {
    const catGuides = GUIDES[activeCategoryKey] || {};
    return catGuides[activeModeKey] || [];
  }, [activeCategoryKey, activeModeKey]);

  const avatars = ['📐', '📊', '📈', '🧮', '📚', '🧠', '🔬', '🛰️'];

  const baseUsers = useMemo(
    () => [
      {
        id: 'you',
        name: progress.name || 'Tú',
        points: progress.points || 0,
        tag: 'Deriva+',
        categories: ['global', 'derivatives', 'limits'],
      },
      {
        id: 'ada',
        name: 'Ada',
        points: 820,
        tag: 'Pro',
        categories: ['global', 'derivatives'],
      },
      {
        id: 'gauss',
        name: 'Gauss',
        points: 640,
        tag: 'Clásico',
        categories: ['global', 'limits'],
      },
      {
        id: 'noether',
        name: 'Noether',
        points: 510,
        tag: 'Teoría',
        categories: ['global', 'derivatives'],
      },
    ],
    [progress.name, progress.points]
  );

  const rankingData = useMemo(
    () =>
      baseUsers
        .filter((u) => u.categories.includes(rankingFilter))
        .sort((a, b) => b.points - a.points),
    [baseUsers, rankingFilter]
  );

  const calendar = buildCalendar(progress.streakDays || []);

  const curiosities = [
    'La derivada de eˣ es eˣ, una función que nunca cambia su propia forma.',
    'El límite de (1 + 1/n)ⁿ cuando n tiende a infinito define el número e.',
    'Muchas integrales no tienen solución en términos de funciones elementales, pero sí numéricas.',
  ];
  const curiosity = curiosities[new Date().getDate() % curiosities.length] || curiosities[0];

  const hasStreakMedal = (progress.achievements || []).includes('streak_5');

  const t = (key: string) => translations[languageState]?.[key] || translations.es[key] || key;

  const handleNameBlur = () => {
    const next = setName(nameInput);
    setProgressState(next);
  };

  const handleSelectMode = (categoryKey: CategoryKey, modeKey: string) => {
    setActiveCategoryKey(categoryKey);
    setActiveModeKey(modeKey);
    setExpandedCategory(categoryKey);
  };

  const openHelp = () => {
    const categoryType =
      activeCategoryKey === 'derivatives'
        ? 'derivative'
        : activeCategoryKey === 'limits'
        ? 'limit'
        : 'integral';

    const definitions: Record<string, string> = {
      derivative:
        'Una derivada mide cómo cambia una función respecto a su variable: es la pendiente instantánea de la curva.',
      limit:
        'Un límite describe el valor al que se aproxima una función cuando la variable se acerca a un punto.',
      integral:
        'Una integral representa acumulación: áreas bajo la curva o suma continua de infinitos aportes pequeños.',
    };

    const catGuides = GUIDES[activeCategoryKey] || {};
    const modeGuides = catGuides[activeModeKey] || [];
    const first = modeGuides[0];
    const how = first
      ? `${first.title}: ${first.content}`
      : 'Piensa en la regla principal que se aplica en este tipo de ejercicio (potencias, cadena, notables, etc.).';

    setHelpContent({
      definition: definitions[categoryType],
      how,
    });
    setShowHelp(true);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguageState(lang);
    const next = setLanguage(lang);
    setProgressState(next);
    setShowLanguageSelector(false);
  };

  const handleDarkModeToggle = () => {
    const nextValue = !darkMode;
    setDarkModeState(nextValue);
    const next = setDarkMode(nextValue);
    setProgressState(next);
  };

  const languages = [
    { code: 'es', label: 'Castellano', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ca', label: 'Català', flag: '🏳️' },
    { code: 'eu', label: 'Euskara', flag: '🏳️' },
  ];

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 bg-gradient-to-b from-amber-50/50 to-rose-50/30">
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {t('quickSession')}
          </p>
          <h1 className="text-xl font-bold text-foreground text-balance">
            {t('whatPractice')}
          </h1>
        </div>

        <div className="space-y-4">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
            <CollapsibleCategory
              key={key}
              categoryKey={key}
              category={CATEGORIES[key]}
              isExpanded={expandedCategory === key}
              onToggle={() => setExpandedCategory(expandedCategory === key ? null : key)}
              onSelectMode={handleSelectMode}
              activeModeKey={activeModeKey}
              activeCategoryKey={activeCategoryKey}
              activeGuide={activeCategoryKey === key ? activeGuide : []}
              openHelp={openHelp}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderDaily = () => (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 bg-gradient-to-b from-orange-50/50 to-amber-50/30">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {t('dailyChallenge')}
          </p>
          <h2 className="text-lg font-bold text-foreground">
            Inercia de derivadas sucesivas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Completa al menos un ejercicio cada día para mantener tu racha.
          </p>
        </div>

        <div className="rounded-3xl bg-white border-2 border-amber-100 p-5 space-y-5 shadow-lg shadow-amber-50">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">
              Calendario de racha
            </p>
            <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground mb-2 font-medium">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-xs">
              {calendar.days.map((d) =>
                d.label ? (
                  <div
                    key={d.key}
                    className={`flex items-center justify-center aspect-square rounded-xl transition-all duration-200 ${
                      d.inStreak
                        ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white font-bold shadow-md shadow-amber-200'
                        : 'text-muted-foreground bg-amber-50'
                    }`}
                  >
                    {d.label}
                  </div>
                ) : (
                  <div key={d.key} />
                )
              )}
            </div>
          </div>

          <div className="space-y-4">
            <ExercisePlayer
              categoryKey="derivatives"
              modeKey="inercia"
              category={CATEGORIES.derivatives}
            />
            <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-3">
              <span className="text-xl">💡</span>
              <p className="text-xs text-amber-800 leading-relaxed">{curiosity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRanking = () => (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 bg-gradient-to-b from-violet-50/50 to-indigo-50/30">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {t('navRanking')}
          </p>
          <h2 className="text-lg font-bold text-foreground">
            {t('rankingTitle')}
          </h2>
        </div>

        <div className="rounded-3xl bg-white border-2 border-violet-100 p-5 space-y-4 shadow-lg shadow-violet-50">
          <div className="flex gap-2">
            {[
              { key: 'global', label: 'Global' },
              { key: 'derivatives', label: 'Derivadas' },
              { key: 'limits', label: 'Límites' },
            ].map((tabDef) => (
              <button
                key={tabDef.key}
                type="button"
                onClick={() => setRankingFilter(tabDef.key)}
                className={`flex-1 rounded-3xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                  rankingFilter === tabDef.key
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-200'
                    : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                }`}
              >
                {tabDef.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {rankingData.map((row, index) => (
              <div
                key={row.id}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  row.id === 'you'
                    ? 'bg-gradient-to-r from-violet-100 to-indigo-100 border-2 border-violet-200'
                    : 'bg-violet-50/50 hover:bg-violet-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-400 text-white shadow-md' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md' :
                  'bg-violet-200 text-violet-700'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.tag}</p>
                </div>
                <p className="text-sm font-bold text-violet-600">{row.points} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 bg-gradient-to-b from-teal-50/50 to-cyan-50/30">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              {t('navProfile')}
            </p>
            <h2 className="text-lg font-bold text-foreground">
              {t('profileTitle')}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowLanguageSelector(true)}
              className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-md shadow-teal-100 hover:shadow-lg transition-all duration-200"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={openHelp}
              className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-200 hover:shadow-lg transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white border-2 border-teal-100 p-5 space-y-5 shadow-lg shadow-teal-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-3xl shadow-lg shadow-teal-200">
              {selectedAvatar}
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                {t('name')}
              </label>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleNameBlur}
                className="w-full rounded-2xl border-2 border-teal-100 bg-teal-50/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-400 focus:bg-white transition-all duration-200"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">{t('avatarSelector')}</p>
            <div className="grid grid-cols-8 gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`aspect-square rounded-2xl text-xl flex items-center justify-center transition-all duration-200 ${
                    selectedAvatar === avatar
                      ? 'bg-gradient-to-br from-teal-400 to-cyan-400 shadow-lg shadow-teal-200 scale-110'
                      : 'bg-teal-50 hover:bg-teal-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-teal-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{t('darkMode')}</p>
              <p className="text-xs text-muted-foreground">Cambia el tema visual</p>
            </div>
            <button
              type="button"
              onClick={handleDarkModeToggle}
              className={`w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300 ${
                darkMode ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  darkMode ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white border-2 border-teal-100 p-5 space-y-4 shadow-lg shadow-teal-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t('achievements')}</p>
            <p className="text-xs font-bold text-teal-600">
              {progress.points} puntos MPS
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                  hasStreakMedal
                    ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Racha x5</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Maestro</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Constancia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (tab) {
      case TABS.DAILY:
        return renderDaily();
      case TABS.RANKING:
        return renderRanking();
      case TABS.PROFILE:
        return renderProfile();
      case TABS.HOME:
      default:
        return renderHome();
    }
  };

  const navItems = [
    { key: TABS.HOME, icon: Home, label: t('navHome'), color: 'from-rose-400 to-pink-400' },
    { key: TABS.DAILY, icon: Flame, label: t('navDaily'), color: 'from-orange-400 to-amber-400' },
    { key: TABS.RANKING, icon: Trophy, label: t('navRanking'), color: 'from-violet-400 to-indigo-400' },
    { key: TABS.PROFILE, icon: User, label: t('navProfile'), color: 'from-teal-400 to-cyan-400' },
  ];

  return (
    <div
      className={`${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-teal-100 flex justify-center items-center p-4 md:p-8`}
    >
      {/* Mobile Phone Container */}
      <div className="w-full max-w-[400px] bg-white rounded-[48px] shadow-2xl overflow-hidden min-h-[700px] max-h-[85vh] relative flex flex-col border-[10px] border-gray-900">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />
        
        {/* Header */}
        <header className="px-6 pt-10 pb-4 flex items-center justify-between bg-white/90 backdrop-blur-sm">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 bg-clip-text text-transparent">
              Deriva+
            </h1>
            <p className="text-xs text-muted-foreground">
              Cálculo guiado en tonos pastel
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-4 py-2 rounded-3xl shadow-lg shadow-emerald-200">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold">
              {progress.points} {t('points')}
            </span>
          </div>
        </header>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-white/90 backdrop-blur-sm border-t border-gray-100 flex items-center justify-around px-4 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                  }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    active
                      ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Help Modal */}
        {showHelp && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">{t('help')}</h3>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs font-semibold text-sky-700 mb-1">Definición</p>
                  <p className="text-sm text-sky-900">{helpContent.definition}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Cómo se hace</p>
                  <p className="text-sm text-emerald-900">{helpContent.how}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Language Selector Modal */}
        {showLanguageSelector && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">{t('selectLanguage')}</h3>
                <button
                  type="button"
                  onClick={() => setShowLanguageSelector(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                      languageState === lang.code
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg'
                        : 'bg-gray-50 text-foreground hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
