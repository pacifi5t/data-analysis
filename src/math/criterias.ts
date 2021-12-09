import { jStat } from "jstat";
import { alpha, fisherDistribQuan, mean, normDistribQuan, stdDev } from ".";

export function depMeanEq(arrX: number[], arrY: number[]) {
  const arrZ = [];
  for (let i = 0; i < arrX.length; i++) {
    arrZ.push(arrX[i] - arrY[i]);
  }
  const zMean = mean(arrZ);
  const zStd = stdDev(arrZ, zMean);
  const t = (zMean * Math.sqrt(arrZ.length)) / zStd;
  const p = jStat.ttest(t, arrZ.length - 1, 2);

  return [p >= alpha, p];
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
  const p = jStat.ttest(t, v, 2);
  // console.log(p, p >= alpha);

  return [p >= alpha, p];
}

export function dispersionEq(arrX: number[], arrY: number[]) {
  const f =
    Math.pow(stdDev(arrX, mean(arrX)), 2) /
    Math.pow(stdDev(arrY, mean(arrY)), 2);
  const v1 = arrX.length - 1;
  const v2 = arrY.length - 1;

  // const p = jStat.ftest(f, v1, v2);
  // console.log(p, p >= alpha);

  const f1 = fisherDistribQuan(alpha / 2, v1, v2);
  const f2 = fisherDistribQuan(1 - alpha / 2, v1, v2);
  // console.log(f, f1, f2, f1 <= f && f <= f2 );

  return [f1 <= f && f <= f2, f];
}

export function testMannWhitney(arrX: number[], arrY: number[]) {
  let U = 0;
  for (let i = 0; i < arrX.length; i++) {
    const x = arrX[i];
    for (let j = 0; j < arrY.length; j++) {
      const y = arrY[j];
      if (x > y) {
        U += 1;
      } else if (x + Number.EPSILON > y && x - Number.EPSILON < y) {
        U += 0.5;
      }
    }
  }

  const E = (arrX.length * arrY.length) / 2;
  const D = (E / 6) * (arrX.length + arrY.length + 1);
  const u = (U - E) / Math.sqrt(D);
  return [Math.abs(u) <= normDistribQuan(1 - alpha / 2), u];
}

export function testWilcoxonSignedRank(arrX: number[], arrY: number[]) {
  let arrZ = [];
  for (let i = 0; i < arrX.length; i++) {
    arrZ.push(arrX[i] - arrY[i]);
  }
  arrZ = arrZ.filter((elem) => elem != 0);

  const arrS = [];
  for (let i = 0; i < arrZ.length; i++) {
    arrS.push(arrZ[i] > 0 ? 1 : 0);
  }

  const ranks = [];
  const duplicates = new Map<number, Array<number>>();
  const sorted = [...arrZ].sort((a, b) => a - b);

  sorted.forEach((elem, index) => {
    if (sorted.indexOf(elem) !== index) {
      if (duplicates.has(elem)) {
        duplicates.set(elem, [...duplicates.get(elem), index + 1]);
      } else {
        duplicates.set(elem, [index + 1]);
      }
    }
  });

  for (let i = 0; i < arrS.length; i++) {
    const elem = arrS[i];
    ranks.push(
      duplicates.has(elem)
        ? duplicates
            .get(elem)
            .reduce((total: number, x: number) => total + x, 0) /
            duplicates.get(elem).length
        : i
    );
  }

  let T = 0;
  for (let i = 0; i < arrS.length; i++) {
    T += arrS[i] * ranks[i];
  }

  const E = (arrS.length * (arrS.length + 1)) / 4;
  const D = (E * (2 * arrS.length + 1)) / 6;
  const u = (T - E) / Math.sqrt(D);
  return [Math.abs(u) <= normDistribQuan(1 - alpha / 2), u];
}
