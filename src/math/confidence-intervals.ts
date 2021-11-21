import { studentDistribQuan } from ".";

export const alpha = 0.05;

export function meanConfInterval(
  len: number,
  meanStdDev: number,
  mean: number
) {
  const q = studentDistribQuan(1 - alpha / 2, len - 1);
  return [mean - q * meanStdDev, mean + q * meanStdDev];
}

export function medianConfInterval(array: number[]) {
  const q = studentDistribQuan(1 - alpha / 2, array.length - 1);
  return [
    array[Math.round(array.length / 2 - (q * Math.sqrt(array.length)) / 2)],
    array[Math.round(array.length / 2 + 1 + (q * Math.sqrt(array.length)) / 2)]
  ];
}

export function stdDevConfInterval(
  len: number,
  stdDev: number,
  stdDevDeviation: number
) {
  const q = studentDistribQuan(1 - alpha / 2, len - 1);
  return [stdDev - q * stdDevDeviation, stdDev + q * stdDevDeviation];
}

export function coefConfInterval(
  len: number,
  coefficient: number,
  coefStdDev: number
) {
  const q = studentDistribQuan(1 - alpha / 2, len - 1);
  return [coefficient - q * coefStdDev, coefficient + q * coefStdDev];
}
