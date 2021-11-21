import type { VarSeries } from "../utils/series";
import { normDistribQuan } from "./quantiles";

const normQuan = normDistribQuan(1 - 0.05 / 2);

export function mu(mean: number) {
  return mean;
}

export function sigma(mean: number, series: VarSeries) {
  return Math.sqrt(
    series.initialArray.reduce((total, x) => total + x * x, 0) / series.length -
      Math.pow(mean, 2)
  );
}

export function muDispersion(sigma: number, series: VarSeries) {
  return (sigma * sigma) / series.length;
}

export function sigmaDispersion(muDisp: number) {
  return muDisp / 2;
}

export function muConfInterval(mu: number, muDisp: number) {
  const stdDev = Math.sqrt(muDisp);
  return [mu - normQuan * stdDev, mu + normQuan * stdDev];
}

export function sigmaConfInterval(mu: number, sigmaDisp: number) {
  const stdDev = Math.sqrt(sigmaDisp);
  return [mu - normQuan * stdDev, mu + normQuan * stdDev];
}
