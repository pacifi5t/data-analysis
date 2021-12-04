import { jStat } from "jstat";
import { alpha, fisherDistribQuan, mean, stdDev } from ".";

export function depMeanEq(arrX: number[], arrY: number[]) {
  const arrZ = [];
  for (let i = 0; i < arrX.length; i++) {
    arrZ.push(arrX[i] - arrY[i]);
  }
  const zMean = mean(arrZ);
  const zStd = stdDev(arrZ, zMean);
  const t = (zMean * Math.sqrt(arrZ.length)) / zStd;
  const p = 2 * (1 - jStat.ttest(t, arrZ.length - 1, 2));

  return p >= alpha;
}

export function indepMeanEq(arrX: number[], arrY: number[]) {
  const xMean = mean(arrX);
  const yMean = mean(arrY);
  const v = arrX.length + arrY.length - 2;
  const stdDeviation =
    ((arrX.length - 1) * stdDev(arrX, xMean) +
      (arrY.length - 1) * stdDev(arrY, yMean)) /
    v;
  const t =
    (xMean - yMean) /
    Math.sqrt(stdDeviation / arrX.length + stdDeviation / arrY.length);
  const p = 2 * (1 - jStat.ttest(t, v, 2));

  return p >= alpha;
}

export function dispersionEq(arrX: number[], arrY: number[]) {
  const f =
    Math.pow(stdDev(arrX, mean(arrX)), 2) /
    Math.pow(stdDev(arrY, mean(arrY)), 2);
  const v1 = arrX.length - 1;
  const v2 = arrY.length - 1;
  const fisher = jStat.ftest(f, v1, v2);
  const p = 2 * (f <= 1 ? fisher : 1 - fisher);

  // const f1 = fisherDistribQuan(alpha / 2, v1, v2);
  // const f2 = fisherDistribQuan(1 - alpha / 2, v1, v2);

  return p >= alpha;
}
