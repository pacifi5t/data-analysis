import { pearsonCorrelationEstimate, shiftedDeviation, mean } from ".";
import { alpha } from "./confidence-intervals";
import { studentDistribQuan } from "./quantiles";

export function linearA0(arrX: number[], arrY: number[]) {
  return mean(arrY) - linearA1(arrX, arrY) * mean(arrX);
}

export function linearA1(arrX: number[], arrY: number[]) {
  return (
    (pearsonCorrelationEstimate(arrX, arrY) *
      shiftedDeviation(arrY, mean(arrY))) /
    shiftedDeviation(arrX, mean(arrX))
  );
}

export function linearFn2(x: number, a0: number, a1: number) {
  return a0 + a1 * x;
}

export function dispersionA0(arrX: number[], remainsDispersion: number) {
  return (
    (arrX.reduce((total, value) => total + value * value, 0) *
      remainsDispersion) /
    (Math.pow(arrX.length, 2) * shiftedDeviation(arrX, mean(arrX)))
  );
}

export function dispersionA1(arrX: number[], remainsDispersion: number) {
  return (
    (arrX.length * remainsDispersion) /
    (Math.pow(arrX.length, 2) * shiftedDeviation(arrX, mean(arrX)))
  );
}

export function paramConfInterval(
  param: number,
  paramDispersion: number,
  len: number
) {
  const quanStdDev =
    studentDistribQuan(1 - alpha / 2, len - 2) * Math.sqrt(paramDispersion);
  return [param - quanStdDev, param + quanStdDev];
}
