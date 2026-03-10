'use client';

import { useState, useCallback, useEffect } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { Category } from '@/lib/data/meta';
import { addPoints, recordStreak } from '@/lib/storage';

interface ExercisePlayerProps {
  categoryKey: string;
  modeKey: string;
  category: Category;
}

const EXERCISES: Record<string, Record<string, Array<{ question: string; options: string[]; correct: number }>>> = {
  derivatives: {
    expres: [
      { question: 'd/dx (x³)', options: ['3x²', '2x³', 'x²', '3x'], correct: 0 },
      { question: 'd/dx (5x²)', options: ['5x', '10x', '2x', '5x²'], correct: 1 },
      { question: 'd/dx (sin x)', options: ['cos x', '-sin x', '-cos x', 'tan x'], correct: 0 },
      { question: 'd/dx (eˣ)', options: ['eˣ', 'x·eˣ⁻¹', 'ln(x)', '1/x'], correct: 0 },
    ],
    inercia: [
      { question: 'd²/dx² (x⁴)', options: ['12x²', '4x³', '24x', '6x²'], correct: 0 },
      { question: 'd³/dx³ (x⁵)', options: ['60x²', '20x⁴', '120x', '5x⁴'], correct: 0 },
    ],
    cadena: [
      { question: 'd/dx (sin(2x))', options: ['2cos(2x)', 'cos(2x)', '-2sin(2x)', '2sin(2x)'], correct: 0 },
      { question: 'd/dx (e²ˣ)', options: ['2e²ˣ', 'e²ˣ', '2xe²ˣ', 'e²ˣ/2'], correct: 0 },
    ],
    implicita: [
      { question: 'Si x² + y² = 25, dy/dx = ?', options: ['-x/y', 'x/y', '-y/x', '2x'], correct: 0 },
    ],
  },
  limits: {
    expres: [
      { question: 'lim (x→2) x²', options: ['4', '2', '0', '∞'], correct: 0 },
      { question: 'lim (x→0) (1+x)', options: ['1', '0', '∞', '-1'], correct: 0 },
    ],
    indeterminados: [
      { question: 'lim (x→0) sin(x)/x', options: ['1', '0', '∞', 'No existe'], correct: 0 },
      { question: 'lim (x→∞) (1+1/x)ˣ', options: ['e', '1', '∞', '0'], correct: 0 },
    ],
    hopital: [
      { question: 'lim (x→0) (eˣ-1)/x', options: ['1', '0', 'e', '∞'], correct: 0 },
    ],
    multivariable: [
      { question: 'lim (x,y)→(0,0) xy/(x²+y²)', options: ['No existe', '0', '1', '∞'], correct: 0 },
    ],
  },
  integrals: {
    expres: [
      { question: '∫ x² dx', options: ['x³/3 + C', 'x³ + C', '2x + C', 'x²/2 + C'], correct: 0 },
      { question: '∫ cos(x) dx', options: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', 'tan(x) + C'], correct: 0 },
    ],
    partes: [
      { question: '∫ x·eˣ dx', options: ['(x-1)eˣ + C', 'x·eˣ + C', 'eˣ + C', 'x²eˣ/2 + C'], correct: 0 },
    ],
    sustitucion: [
      { question: '∫ 2x·cos(x²) dx', options: ['sin(x²) + C', 'cos(x²) + C', '-sin(x²) + C', '2sin(x²) + C'], correct: 0 },
    ],
    definidas: [
      { question: '∫₀¹ x dx', options: ['1/2', '1', '0', '2'], correct: 0 },
    ],
  },
};

export function ExercisePlayer({ categoryKey, modeKey, category }: ExercisePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const exercises = EXERCISES[categoryKey]?.[modeKey] || EXERCISES.derivatives.expres;
  const currentExercise = exercises[currentIndex % exercises.length];

  const colorMap: Record<string, { bg: string; accent: string; border: string }> = {
    sky: { bg: 'bg-sky-50', accent: 'bg-sky-500', border: 'border-sky-200' },
    emerald: { bg: 'bg-emerald-50', accent: 'bg-emerald-500', border: 'border-emerald-200' },
    rose: { bg: 'bg-rose-50', accent: 'bg-rose-500', border: 'border-rose-200' },
  };

  const colors = colorMap[category.color] || colorMap.sky;

  const handleSelect = useCallback((index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    if (index === currentExercise.correct) {
      setScore((s) => s + 10);
      addPoints(10);
      recordStreak();
    }
  }, [showResult, currentExercise.correct]);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
  }, [categoryKey, modeKey]);

  return (
    <div className={`rounded-3xl ${colors.bg} p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Ejercicio {(currentIndex % exercises.length) + 1}/{exercises.length}
        </span>
        <span className="text-xs font-semibold text-foreground">
          +{score} pts
        </span>
      </div>

      <div className="text-center py-4">
        <p className="text-2xl font-semibold text-foreground">{currentExercise.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {currentExercise.options.map((option, index) => {
          let optionClass = `rounded-3xl border-2 ${colors.border} bg-white px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:shadow-md`;

          if (showResult) {
            if (index === currentExercise.correct) {
              optionClass = 'rounded-3xl border-2 border-emerald-400 bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700 shadow-md';
            } else if (index === selected && index !== currentExercise.correct) {
              optionClass = 'rounded-3xl border-2 border-red-400 bg-red-100 px-4 py-3 text-sm font-medium text-red-700 shadow-md';
            }
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={optionClass}
            >
              <span className="flex items-center justify-center gap-2">
                {option}
                {showResult && index === currentExercise.correct && <Check className="w-4 h-4" />}
                {showResult && index === selected && index !== currentExercise.correct && <X className="w-4 h-4" />}
              </span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleNext}
            className={`${colors.accent} text-white px-6 py-2.5 rounded-3xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl`}
          >
            Siguiente
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-muted text-muted-foreground px-4 py-2.5 rounded-3xl text-sm font-medium shadow-sm transition-all duration-200 hover:bg-muted/80"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
