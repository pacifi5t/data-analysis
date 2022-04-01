import { mean, shiftedDeviation } from ".";
import { alpha } from "./confidence-intervals";
import { normDistribQuan } from "./quantiles";

export function pearsonCorrelationEstimate(arrX: number[], arrY: number[]) {
  const xMean = mean(arrX);
  const yMean = mean(arrY);

  return (
    (mean(arrX.map((_, i) => arrX[i] * arrY[i])) - xMean * yMean) /
    (shiftedDeviation(arrX, xMean) * shiftedDeviation(arrY, yMean))
  );
}

export function pearsonCorrelationInterval(
  len: number,
  estimate: number
): [number, number] {
  const a = estimate + (estimate * (1 - Math.pow(estimate, 2))) / (2 * len);
  const b =
    (normDistribQuan(1 - alpha / 2) * (1 - Math.pow(estimate, 2))) /
    Math.sqrt(len - 1);

  return [a - b, a + b];
}

export function tStatistic(len: number, estimate: number) {
  return (estimate * Math.sqrt(len - 2)) / Math.sqrt(1 - Math.pow(estimate, 2));
}
