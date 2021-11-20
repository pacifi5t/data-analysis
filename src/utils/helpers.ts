import { min, max } from "../math/other";
import {
  antikurtosisCoef,
  kurtosisCoef1,
  kurtosisCoef2,
  mean,
  median,
  shiftedStdDev,
  skewnessCoef1,
  skewnessCoef2,
  stdDev
} from "../math/characteristics";
import {
  coefConfInterval,
  meanConfInterval,
  medianConfInterval,
  stdDevConfInterval
} from "../math/confidence-intervals";
import {
  kurtosisDeviation2,
  meanDeviation,
  skewnessDeviation2,
  stdDevDeviation
} from "../math/deviations";
import { normDistribQuan } from "../math/quantiles";
import { ClassifiedSeries, VarSeries } from "./series";

export function pretty(num: number): number {
  return parseFloat(num.toPrecision(4));
}

export function purgeAnomalies(series: VarSeries, a: number, b: number) {
  const array = [];
  series.initialArray.forEach((elem) => {
    if (elem >= a && elem <= b) {
      array.push(elem);
    }
  });

  return new VarSeries(array);
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

export function identifyNormalDistrib(series: VarSeries) {
  const meanValue = mean(series);
  const skewness = skewnessCoef2(
    series,
    skewnessCoef1(series, shiftedStdDev(series, meanValue), meanValue)
  );
  const skewnessStdDev = skewnessDeviation2(series);
  const kurtosis2 = kurtosisCoef2(
    series,
    kurtosisCoef1(series, shiftedStdDev(series, meanValue), meanValue)
  );
  const kurtosisStdDev = kurtosisDeviation2(series);

  const quantile = normDistribQuan(1 - 0.05 / 2);
  const uA = Math.abs(skewness / skewnessStdDev);
  const uE = Math.abs(kurtosis2 / kurtosisStdDev);

  return uA <= quantile && uE <= quantile ? true : false;
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

export function updateCharacteristicsTable(series: VarSeries) {
  const items = [];
  const meanValue = mean(series);
  const stdDeviation = stdDev(series, meanValue);
  const meanStdDev = meanDeviation(series, stdDeviation);
  const meanInterval = meanConfInterval(series, meanStdDev, meanValue);
  items.push({
    t: "Mean",
    v: pretty(meanValue),
    d: pretty(meanStdDev),
    i: `${pretty(meanInterval[0])} ; ${pretty(meanInterval[1])}`
  });

  const medianValue = median(series);
  const medianInterval = medianConfInterval(series);
  items.push({
    t: "Median",
    v: pretty(medianValue),
    d: "-",
    i: `${pretty(medianInterval[0])} ; ${pretty(medianInterval[1])}`
  });

  const stdDevStdDev = stdDevDeviation(series, stdDeviation);
  const stdDevInterval = stdDevConfInterval(series, stdDeviation, stdDevStdDev);
  items.push({
    t: "Standard Deviation",
    v: pretty(stdDeviation),
    d: pretty(stdDevStdDev),
    i: `${pretty(stdDevInterval[0])} ; ${pretty(stdDevInterval[1])}`
  });

  const skewnessCoef = skewnessCoef2(
    series,
    skewnessCoef1(series, shiftedStdDev(series, meanValue), meanValue)
  );
  const skewnessStdDev = skewnessDeviation2(series);
  const skewnessInterval = coefConfInterval(
    series,
    skewnessCoef,
    skewnessStdDev
  );
  items.push({
    t: "Skewness Coefficient",
    v: pretty(skewnessCoef),
    d: pretty(skewnessStdDev),
    i: `${pretty(skewnessInterval[0])} ; ${pretty(skewnessInterval[1])}`
  });

  const kurtosis1 = kurtosisCoef1(
    series,
    shiftedStdDev(series, meanValue),
    meanValue
  );
  const kurtosis2 = kurtosisCoef2(series, kurtosis1);
  const kurtosisStdDev = kurtosisDeviation2(series);
  const kurtosisInterval = coefConfInterval(series, kurtosis2, kurtosisStdDev);
  items.push({
    t: "Kurtosis Coefficient",
    v: pretty(kurtosis2),
    d: pretty(kurtosisStdDev),
    i: `${pretty(kurtosisInterval[0])} ; ${pretty(kurtosisInterval[1])}`
  });

  const antikurtosis = antikurtosisCoef(kurtosis1);
  items.push({
    t: "Antikurtosis Coefficient",
    v: pretty(antikurtosis),
    d: "-",
    i: "-"
  });

  items.push({
    t: "Minimum",
    v: min(series),
    d: "-",
    i: "-"
  });

  items.push({
    t: "Maximum",
    v: max(series),
    d: "-",
    i: "-"
  });
  return items;
}
