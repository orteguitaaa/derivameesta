export const GUIDES: Record<string, Record<string, Array<{ title: string; content: string }>>> = {
  derivatives: {
    expres: [
      { title: 'Regla de potencias', content: 'La derivada de x^n es n·x^(n-1)' },
      { title: 'Constantes', content: 'La derivada de una constante es 0' },
      { title: 'Suma/Resta', content: 'Deriva término a término' },
    ],
    inercia: [
      { title: 'Derivadas sucesivas', content: 'Aplica la derivada múltiples veces' },
      { title: 'Patrón', content: 'Busca patrones en derivadas repetidas' },
    ],
    cadena: [
      { title: 'Regla de la cadena', content: 'f(g(x))\' = f\'(g(x))·g\'(x)' },
      { title: 'Interior × Exterior', content: 'Deriva exterior, multiplica por derivada del interior' },
    ],
    implicita: [
      { title: 'Derivación implícita', content: 'Deriva ambos lados respecto a x' },
      { title: 'dy/dx', content: 'Trata y como función de x' },
    ],
  },
  limits: {
    expres: [
      { title: 'Sustitución directa', content: 'Sustituye el valor si no hay indeterminación' },
      { title: 'Límites laterales', content: 'Comprueba por izquierda y derecha' },
    ],
    indeterminados: [
      { title: 'Formas 0/0, ∞/∞', content: 'Factoriza o racionaliza' },
      { title: 'Límites notables', content: 'sen(x)/x → 1, (1+1/n)^n → e' },
    ],
    hopital: [
      { title: "Regla de L'Hôpital", content: 'lim f/g = lim f\'/g\' si 0/0 o ∞/∞' },
      { title: 'Aplicación', content: 'Deriva numerador y denominador por separado' },
    ],
    multivariable: [
      { title: 'Caminos', content: 'Evalúa por distintos caminos hacia el punto' },
      { title: 'Coordenadas polares', content: 'Útil para límites en el origen' },
    ],
  },
  integrals: {
    expres: [
      { title: 'Antiderivadas', content: 'Busca la función cuya derivada es f(x)' },
      { title: 'Constante C', content: 'No olvides la constante de integración' },
    ],
    partes: [
      { title: 'Fórmula', content: '∫u·dv = u·v - ∫v·du' },
      { title: 'LIATE', content: 'Prioridad: Log, Inversa trig, Algebraica, Trig, Exponencial' },
    ],
    sustitucion: [
      { title: 'Cambio de variable', content: 'u = g(x), du = g\'(x)dx' },
      { title: 'Reconocer patrones', content: 'Busca f(g(x))·g\'(x)' },
    ],
    definidas: [
      { title: 'Teorema fundamental', content: '∫[a,b] f(x)dx = F(b) - F(a)' },
      { title: 'Área', content: 'La integral definida representa área bajo la curva' },
    ],
  },
};
