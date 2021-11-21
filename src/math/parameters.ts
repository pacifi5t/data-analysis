import { normDistribQuan } from "./quantiles";
import { alpha } from ".";

const normQuan = normDistribQuan(1 - alpha / 2);

export function muFunc(mean: number) {
  return mean;
}

export function sigmaFunc(mean: number, array: number[]) {
  return Math.sqrt(
    array.reduce((total, x) => total + x * x, 0) / array.length -
      Math.pow(mean, 2)
  );
}

export function muDispersion(len: number, sigma: number) {
  return (sigma * sigma) / len;
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
