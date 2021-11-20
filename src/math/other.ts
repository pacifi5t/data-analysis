import type { VarSeries } from "../utils/series";

export function min(series: VarSeries) {
  return series.initialArray.reduce((m, x) => (x < m ? x : m));
}

export function max(series: VarSeries) {
  return series.initialArray.reduce((m, x) => (x > m ? x : m));
}

export function quartile1(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const q = (1 / 4) * (array.length + 1);
  const qInt = Math.floor(q);
  return q == qInt ? array[q] : (array[qInt] + array[qInt + 1]) / 2;
}

export function quartile3(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const q = (3 / 4) * (array.length + 1);
  const qInt = Math.floor(q);
  return q == qInt ? array[q] : (array[qInt] + array[qInt + 1]) / 2;
}

export function aproxLaplace(u: number) {
  if (u <= 0) {
    return 1 - aproxLaplace(Math.abs(u));
  }

  const b1 = 0.31938153;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const t = 1 / (1 + 0.2316419 * u);
  return (
    1 -
    (1 / Math.sqrt(2 * Math.PI)) *
      Math.exp((-u * u) / 2) *
      (b1 * t +
        b2 * t * t +
        b3 * Math.pow(t, 3) +
        b4 * Math.pow(t, 4) +
        b5 * Math.pow(t, 5)) +
    7.8 * Math.pow(10, -8)
  );
}
