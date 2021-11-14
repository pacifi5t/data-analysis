import type { VarSeries } from "src/utils/series";

export function meanDeviation(series: VarSeries, stdDeviation: number) {
  return stdDeviation / Math.sqrt(series.length);
}

export function stdDevDeviation(series: VarSeries, stdDeviation: number) {
  return meanDeviation(series, stdDeviation) / Math.sqrt(2);
}
