import type { VarSeries } from "../utils/series";

export function meanDeviation(series: VarSeries, stdDeviation: number) {
  return stdDeviation / Math.sqrt(series.length);
}

export function stdDevDeviation(series: VarSeries, stdDeviation: number) {
  return meanDeviation(series, stdDeviation) / Math.sqrt(2);
}

export function skewnessDeviation1(series: VarSeries) {
  return Math.sqrt(
    (6 * (series.length - 2)) / ((series.length + 1) * (series.length + 3))
  );
}

export function skewnessDeviation2(series: VarSeries) {
  const len = series.length;
  return Math.sqrt((6 * len * (len - 1)) / ((len - 2) * (len + 1) * (len + 3)));
}

export function kurtosisDeviation1(series: VarSeries) {
  const len = series.length;
  return Math.sqrt(
    (24 * len * (len - 2) * (len - 3)) /
      (Math.pow(len + 1, 2) * (len + 3) * (len + 5))
  );
}

export function kurtosisDeviation2(series: VarSeries) {
  const len = series.length;
  return Math.sqrt(
    (24 * len * Math.pow(len - 1, 2)) /
      ((len - 3) * (len - 2) * (len + 3) * (len + 5))
  );
}
