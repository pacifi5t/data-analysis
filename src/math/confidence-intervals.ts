import type { VarSeries } from "../utils/series";
import { studentDistribQuan } from "./quantiles";

const alpha = 0.05;

export function meanConfInterval(
  series: VarSeries,
  meanStdDev: number,
  mean: number
) {
  const q = studentDistribQuan(1 - alpha / 2, series.length - 1);
  return [mean - q * meanStdDev, mean + q * meanStdDev];
}

export function medianConfInterval(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const len = series.length;
  const q = studentDistribQuan(1 - alpha / 2, len - 1);
  return [
    array[Math.round(len / 2 - (q * Math.sqrt(len)) / 2)],
    array[Math.round(len / 2 + 1 + (q * Math.sqrt(len)) / 2)]
  ];
}

export function stdDevConfInterval(
  series: VarSeries,
  stdDev: number,
  stdDevDeviation: number
) {
  const len = series.length;
  const q = studentDistribQuan(1 - alpha / 2, len - 1);
  return [stdDev - q * stdDevDeviation, stdDev + q * stdDevDeviation];
}

export function coefConfInterval(
  series: VarSeries,
  coefficient: number,
  coefStdDev: number
) {
  const q = studentDistribQuan(1 - alpha / 2, series.length - 1);
  return [coefficient - q * coefStdDev, coefficient + q * coefStdDev];
}
