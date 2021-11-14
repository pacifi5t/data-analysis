import { ClassifiedSeries, VarSeries } from "./series";

export function pretty(num: number): number {
  return parseFloat(num.toPrecision(4));
}

export function mean(series: VarSeries) {
  return series.initialArray.reduce((total, x) => total + x) / series.length;
}

export function stdDev(series: VarSeries, mean: number) {
  return Math.sqrt(
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 2), 0) /
      series.length
  );
}

export function median(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const len = array.length;
  return len % 2 != 0 ? array[(len + 1) / 2] : array[len / 2 + len / 2 + 1] / 2;
}

export function skewnessCoef(
  series: VarSeries,
  stdDeviation: number,
  mean: number
) {
  return (
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 3), 0) /
    (series.length * Math.pow(stdDeviation, 3))
  );
}

export function kurtosisCoef(
  series: VarSeries,
  stdDeviation: number,
  mean: number
) {
  return (
    series.initialArray.reduce((total, x) => total + Math.pow(x - mean, 4), 0) /
      (series.length * Math.pow(stdDeviation, 4)) -
    3
  );
}

export function antikurtosisCoef(kurtosisCoefficient: number) {
  return 1 / Math.sqrt(kurtosisCoefficient + 3);
}

export function kde(bandwidth: number, series: VarSeries, limits: number[]) {
  if (series.length == 0) {
    return [];
  }

  //Epanechnikov's Kernel
  const kernel = (u: number) =>
    Math.abs(u) <= Math.sqrt(5) ? (0.75 / Math.sqrt(5)) * (1 - (u * u) / 5) : 0;

  const density = [];
  limits.forEach((lim) => {
    const sum = series.initialArray.reduce(
      (total, elem) => total + kernel((lim - elem) / bandwidth),
      0
    );
    density.push([
      lim,
      (sum / (series.length * bandwidth)) * (limits[1] - limits[0])
    ]);
  });

  return density;
}

export function updateClassifiedSeries(
  classCount: number,
  varSeries: VarSeries
): ClassifiedSeries {
  const limits = [];
  const limitFirst = varSeries.data[0];
  const limitLast = varSeries.data[varSeries.data.length - 1];

  const width = (limitLast - limitFirst) / classCount;
  limits.push(limitFirst);
  for (let i = 1; i < classCount; i++) {
    limits.push(i * width + limitFirst);
  }
  limits.push(limitLast);

  const classifiedArray = [];
  varSeries.data.forEach((elem, index) => {
    let classNum = 1;
    for (let i = 1; i < limits.length - 1; i++) {
      if (elem < limits[i]) {
        break;
      }
      classNum++;
    }
    for (let i = 0; i < varSeries.count.get(index); i++) {
      classifiedArray.push(classNum);
    }
  });

  return new ClassifiedSeries(classCount, limits, classifiedArray);
}
