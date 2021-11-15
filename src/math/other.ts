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
