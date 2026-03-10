export const CATEGORIES = {
  derivatives: {
    key: 'derivatives',
    name: 'Derivadas',
    symbol: 'd/dx',
    color: 'sky',
    modes: [
      { key: 'expres', label: 'Exprés', description: 'Derivadas rápidas' },
      { key: 'inercia', label: 'Inercia', description: 'Derivadas sucesivas' },
      { key: 'cadena', label: 'Cadena', description: 'Regla de la cadena' },
      { key: 'implicita', label: 'Implícita', description: 'Derivación implícita' },
    ],
  },
  limits: {
    key: 'limits',
    name: 'Límites',
    symbol: 'lim',
    color: 'emerald',
    modes: [
      { key: 'expres', label: 'Exprés', description: 'Límites directos' },
      { key: 'indeterminados', label: 'Indeterminados', description: '0/0, ∞/∞' },
      { key: 'hopital', label: "L'Hôpital", description: 'Regla de L\'Hôpital' },
      { key: 'multivariable', label: 'Multivariable', description: 'Límites en 2D' },
    ],
  },
  integrals: {
    key: 'integrals',
    name: 'Integrales',
    symbol: '∫',
    color: 'rose',
    modes: [
      { key: 'expres', label: 'Exprés', description: 'Primitivas básicas' },
      { key: 'partes', label: 'Por partes', description: 'Integración por partes' },
      { key: 'sustitucion', label: 'Sustitución', description: 'Cambio de variable' },
      { key: 'definidas', label: 'Definidas', description: 'Integrales acotadas' },
    ],
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type Category = typeof CATEGORIES[CategoryKey];
