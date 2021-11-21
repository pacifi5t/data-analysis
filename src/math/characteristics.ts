import type { VarSeries } from "./series";

export function mean(series: VarSeries) {
  return series.initialArray.reduce((total, x) => total + x) / series.length;
}

export function stdDev(series: VarSeries, mean: number) {
  return Math.sqrt(
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 2), 0) /
      (series.length - 1)
  );
}

export function shiftedStdDev(series: VarSeries, mean: number) {
  return Math.sqrt(
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 2), 0) /
      series.length
  );
}

export function median(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const len = array.length;
  return len % 2 != 0
    ? array[Math.round((len + 1) / 2)]
    : (array[len / 2] + array[len / 2 + 1]) / 2;
}

export function skewnessCoef1(
  series: VarSeries,
  shiftedStdDeviation: number,
  mean: number
) {
  return (
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 3), 0) /
    (series.length * Math.pow(shiftedStdDeviation, 3))
  );
}

export function skewnessCoef2(
  series: VarSeries,
  skewnessCoeffiecient1: number
) {
  const len = series.length;
  return (Math.sqrt(len * (len - 1)) / (len - 2)) * skewnessCoeffiecient1;
}

export function kurtosisCoef1(
  series: VarSeries,
  shiftedStdDeviation: number,
  mean: number
) {
  return (
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 4), 0) /
      (series.length * Math.pow(shiftedStdDeviation, 4)) -
    3
  );
}

export function kurtosisCoef2(
  series: VarSeries,
  kurtosisCoeffiecient1: number
) {
  const len = series.length;
  return (
    ((len * len - 1) / ((len - 2) * (len - 3))) *
    (kurtosisCoeffiecient1 + 6 / (len + 1))
  );
}

export function antikurtosisCoef(kurtosisCoeffiecient1: number) {
  return 1 / Math.sqrt(kurtosisCoeffiecient1 + 3);
}
