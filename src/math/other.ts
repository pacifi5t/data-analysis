import { jStat } from "jstat";
import type { ClassifiedSeries, VarSeries } from "./series";
import * as chars from "./characteristics";
import { muFunc, sigmaFunc } from "./parameters";
import {
  kurtosisDeviation2,
  skewnessDeviation2,
  shiftedDeviation
} from "./deviations";
import { normDistribQuan } from "./quantiles";
import { alpha } from ".";

export function min(array: number[]) {
  return array.reduce((m, x) => (x < m ? x : m));
}

export function max(array: number[]) {
  return array.reduce((m, x) => (x > m ? x : m));
}

export function normDistrib(x: number, m: number, s: number) {
  function aproxLaplace(u: number) {
    if (u <= 0) {
      return 1 - aproxLaplace(Math.abs(u));
    }
    const b1 = 0.31938153;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const t = 1 / (1 + 0.2316419 * u);
    return (
      1 -
      (1 / Math.sqrt(2 * Math.PI)) *
        Math.exp((-u * u) / 2) *
        (b1 * t +
          b2 * t * t +
          b3 * Math.pow(t, 3) +
          b4 * Math.pow(t, 4) +
          b5 * Math.pow(t, 5)) +
      7.8 * Math.pow(10, -8)
    );
  }
  return aproxLaplace((x - m) / s);
}

export function normDistribDensity(x: number, m: number, s: number) {
  return (
    Math.exp(-Math.pow(x - m, 2) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s)
  );
}

export function quartile1(array: number[]) {
  const q = (1 / 4) * (array.length + 1);
  const qInt = Math.floor(q);
  return q == qInt ? array[q] : (array[qInt] + array[qInt + 1]) / 2;
}

export function quartile3(array: number[]) {
  const q = (3 / 4) * (array.length + 1);
  const qInt = Math.floor(q);
  return q == qInt ? array[q] : (array[qInt] + array[qInt + 1]) / 2;
}

export function pearsonFunction(hiSqr: number, v: number) {
  return jStat.gammap(v / 2, hiSqr / 2) / jStat.gammafn(v / 2);
}

export function hiSquare(series: ClassifiedSeries, varseries: VarSeries) {
  const theoriticalFreqs = [];
  const meanValue = chars.mean(varseries.initialArray);
  const mu = muFunc(meanValue);
  const sigma = sigmaFunc(meanValue, varseries.initialArray);
  for (let i = 0; i < series.classCount; i++) {
    const p =
      normDistrib(series.limits[i + 1], mu, sigma) -
      normDistrib(series.limits[i], mu, sigma);
    theoriticalFreqs.push(p * series.initialArray.length);
  }

  let sum = 0;
  for (let i = 0; i < series.classCount; i++) {
    sum +=
      Math.pow(series.frequency.get(i) - theoriticalFreqs[i], 2) /
      theoriticalFreqs[i];
  }
  return sum;
}

export function pearsonCriteria(pearsonFunc: number) {
  return 1 - pearsonFunc;
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

export function identifyNormalDistrib(array: number[]) {
  const meanValue = chars.mean(array);
  const shiftedDev = shiftedDeviation(array, meanValue);
  const skewness = chars.skewnessCoef(array, shiftedDev, meanValue);
  const skewnessStdDev = skewnessDeviation2(array.length);
  const kurtosis = chars.kurtosisCoef(
    array,
    shiftedDev,
    meanValue
  );
  const kurtosisStdDev = kurtosisDeviation2(array.length);

  const quantile = normDistribQuan(1 - alpha / 2);
  const uA = Math.abs(skewness / skewnessStdDev);
  const uE = Math.abs(kurtosis / kurtosisStdDev);

  return uA <= quantile && uE <= quantile ? true : false;
}
