const STORAGE_KEY = 'deriva_plus_progress';

export interface Progress {
  points: number;
  name: string;
  language: string;
  darkMode: boolean;
  streakDays: string[];
  achievements: string[];
}

const defaultProgress: Progress = {
  points: 250,
  name: 'Invitado',
  language: 'es',
  darkMode: false,
  streakDays: [],
  achievements: [],
};

export function getProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultProgress;
}

function saveProgress(progress: Progress): Progress {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  return progress;
}

export function setName(name: string): Progress {
  const progress = getProgress();
  progress.name = name;
  return saveProgress(progress);
}

export function setLanguage(language: string): Progress {
  const progress = getProgress();
  progress.language = language;
  return saveProgress(progress);
}

export function setDarkMode(darkMode: boolean): Progress {
  const progress = getProgress();
  progress.darkMode = darkMode;
  return saveProgress(progress);
}

export function addPoints(amount: number): Progress {
  const progress = getProgress();
  progress.points += amount;
  return saveProgress(progress);
}

export function recordStreak(): Progress {
  const progress = getProgress();
  const today = new Date().toISOString().slice(0, 10);
  if (!progress.streakDays.includes(today)) {
    progress.streakDays.push(today);
    if (progress.streakDays.length >= 5 && !progress.achievements.includes('streak_5')) {
      progress.achievements.push('streak_5');
    }
  }
  return saveProgress(progress);
}
