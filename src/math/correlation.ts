import { max, min, sum } from "d3";
import { mean, shiftedDeviation } from ".";
import { alpha } from "./confidence-intervals";
import { normDistribQuan } from "./quantiles";

export interface CorrelationArray {
  x: number[];
  y: number[][];
}

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

export function correlationRatioTransformation(
  arrX: number[],
  arrY: number[]
): CorrelationArray {
  const minX = min(arrX);
  const k = 1 + 1.44 * Math.log(arrX.length);
  const h = (max(arrX) - minX) / k;

  const arrG = [];
  for (let i = 1; i <= k + 1; i++) {
    arrG.push(minX + (i - 1) * h);
  }

  const transArrX: number[] = [];
  for (let i = 0; i < k; i++) {
    transArrX.push((arrG[i] + arrG[i + 1]) / 2);
  }

  const transArrY: number[][] = [];
  for (let i = 0; i < k; i++) {
    transArrY.push([]);
  }

  for (let i = 0; i < arrX.length; i++) {
    for (let j = 0; j < k; j++) {
      if (arrX[i] < arrG[j + 1]) {
        transArrY[j].push(arrY[i]);
      }
    }
  }

  return { x: transArrX, y: transArrY };
}

export function correlationRatioEstimate(
  len: number,
  correlationArray: CorrelationArray
) {
  const classCount = correlationArray.x.length;

  const meanYGroup = [];
  for (let i = 0; i < classCount; i++) {
    const group = correlationArray.y[i];
    meanYGroup.push(sum(group) / group.length);
  }

  const meanY = correlationArray.y.reduce(
    (total, elem, i) => total + elem.length * meanYGroup[i],
    0
  );

  const nom = correlationArray.y.reduce(
    (total, elem, i) =>
      total + elem.length * Math.pow(meanYGroup[i] - meanY, 2),
    0
  );

  const denom = correlationArray.y.reduce(
    (total1, arr) =>
      total1 +
      arr.reduce((total2, y) => {
        return total2 + Math.pow(y - meanY, 2);
      }, 0),
    0
  );

  return Math.sqrt(nom / denom);
}

export function fStatistic(len: number, classCount: number, estimate: number) {
  const estimateSqr = Math.pow(estimate, 2);
  return (
    estimateSqr / (classCount - 1) / ((1 - estimateSqr) / (len - classCount))
  );
}
