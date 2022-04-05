import { max, min, sum } from "d3";
import { mean, shiftedDeviation } from ".";
import { alpha } from "./confidence-intervals";
import { normDistribQuan } from "./quantiles";

export interface CorrelationArray {
  x: number[];
  y: number[][];
}

export interface RankArrayEntry {
  rx: number;
  ry: number;
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

export function arr2ToRanked(arrX: number[], arrY: number[]) {
  const sortedX = [...arrX].sort((a, b) => a - b);
  const duplicatesX = new Map<number, number[]>();
  const rankMapX = new Map<number, number>();
  sortedX.forEach((elem, index) => {
    if (sortedX.indexOf(elem) !== index) {
      if (duplicatesX.has(elem)) {
        duplicatesX.set(elem, [...duplicatesX.get(elem), index + 1]);
      } else {
        duplicatesX.set(elem, [index + 1]);
      }
    }
  });

  for (let i = 0; i < sortedX.length; i++) {
    const elem = sortedX[i];
    if (duplicatesX.has(i)) {
      rankMapX.set(
        elem,
        duplicatesX
          .get(elem)
          .reduce((total: number, x: number) => total + x, 0) /
          duplicatesX.get(elem).length
      );
    } else {
      rankMapX.set(elem, i + 1);
    }
  }

  const sortedY = [...arrY].sort((a, b) => a - b);
  const duplicatesY = new Map<number, number[]>();
  const rankMapY = new Map<number, number>();
  sortedY.forEach((elem, index) => {
    if (sortedY.indexOf(elem) !== index) {
      if (duplicatesY.has(elem)) {
        duplicatesY.set(elem, [...duplicatesY.get(elem), index + 1]);
      } else {
        duplicatesY.set(elem, [index + 1]);
      }
    }
  });

  for (let i = 0; i < sortedY.length; i++) {
    const elem = sortedY[i];
    if (duplicatesY.has(i)) {
      rankMapY.set(
        elem,
        duplicatesY
          .get(elem)
          .reduce((total: number, x: number) => total + x, 0) /
          duplicatesY.get(elem).length
      );
    } else {
      rankMapY.set(elem, i + 1);
    }
  }

  const ranked = new Array<RankArrayEntry>();
  for (let i = 0; i < arrX.length; i++) {
    ranked.push({ rx: rankMapX.get(arrX[i]), ry: rankMapY.get(arrY[i]) });
  }

  return {
    array: ranked.sort((a, b) => a.rx - b.rx),
    duplicatesX: duplicatesX,
    duplicatesY: duplicatesY
  };
}

export function spearmanCorrelationEstimate(
  rankedArray: Array<RankArrayEntry>,
  duplicatesX: Map<number, number[]>,
  duplicatesY: Map<number, number[]>
) {
  if (duplicatesX.size !== 0 || duplicatesY.size !== 0) {
    const a =
      Array.from(duplicatesX.values()).reduce(
        (total, elem) => total + (Math.pow(elem.length, 3) - elem.length),
        0
      ) / 12;
    const b =
      Array.from(duplicatesY.values()).reduce(
        (total, elem) => total + (Math.pow(elem.length, 3) - elem.length),
        0
      ) / 12;

    return spearmanWithDuplicates(rankedArray, a, b);
  } else {
    return spearmanWithoutDuplicates(rankedArray);
  }
}

function spearmanWithDuplicates(
  rankedArray: Array<RankArrayEntry>,
  a: number,
  b: number
) {
  const len = rankedArray.length;
  const nom =
    (len / 6) * (Math.pow(len, 2) - 1) -
    rankedArray.reduce(
      (total, elem) => total + Math.pow(elem.rx - elem.ry, 2),
      0
    ) -
    a -
    b;

  const denom = Math.sqrt(
    ((len / 6) * (Math.pow(len, 2) - 1) - 2 * a) *
      ((len / 6) * (Math.pow(len, 2) - 1) - 2 * b)
  );

  return nom / denom;
}

function spearmanWithoutDuplicates(rankedArray: Array<RankArrayEntry>) {
  const len = rankedArray.length;
  return (
    1 -
    (6 / (len * (Math.pow(len, 2) - 1))) *
      rankedArray.reduce(
        (total, elem) => total + Math.pow(elem.rx - elem.ry, 2),
        0
      )
  );
}
