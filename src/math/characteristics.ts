import type { VarSeries } from "src/utils/series";

export function mean(series: VarSeries) {
  return series.initialArray.reduce((total, x) => total + x) / series.length;
}

export function stdDev(series: VarSeries, mean: number) {
  return Math.sqrt(
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 2), 0) /
      series.length
  );
}

export function median(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const len = array.length;
  return len % 2 != 0 ? array[(len + 1) / 2] : array[len / 2 + len / 2 + 1] / 2;
}

export function skewnessCoef(
  series: VarSeries,
  stdDeviation: number,
  mean: number
) {
  return (
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 3), 0) /
    (series.length * Math.pow(stdDeviation, 3))
  );
}

export function kurtosisCoef(
  series: VarSeries,
  stdDeviation: number,
  mean: number
) {
  return (
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 4), 0) /
      (series.length * Math.pow(stdDeviation, 4)) -
    3
  );
}

export function antikurtosisCoef(kurtosisCoefficient: number) {
  return 1 / Math.sqrt(kurtosisCoefficient + 3);
}
