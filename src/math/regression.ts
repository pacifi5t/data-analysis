import { pearsonCorrelationEstimate, shiftedDeviation, mean } from ".";

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
