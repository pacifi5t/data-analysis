import { jStat } from "jstat";
import type { ClassifiedSeries, VarSeries } from "./series";
import { mean } from "./characteristics";
import { mu, sigma } from "./parameters";

export function min(series: VarSeries) {
  return series.initialArray.reduce((m, x) => (x < m ? x : m));
}

export function max(series: VarSeries) {
  return series.initialArray.reduce((m, x) => (x > m ? x : m));
}

export function quartile1(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const q = (1 / 4) * (array.length + 1);
  const qInt = Math.floor(q);
  return q == qInt ? array[q] : (array[qInt] + array[qInt + 1]) / 2;
}

export function quartile3(series: VarSeries) {
  const array = [...series.initialArray].sort((a, b) => a - b);
  const q = (3 / 4) * (array.length + 1);
  const qInt = Math.floor(q);
  return q == qInt ? array[q] : (array[qInt] + array[qInt + 1]) / 2;
}

export function aproxLaplace(u: number) {
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

export function pearsonFunction(hiSqr: number, v: number) {
  return jStat.gammap(v / 2, hiSqr / 2) / jStat.gammafn(v / 2);
}

export function hiSquare(series: ClassifiedSeries, varseries: VarSeries) {
  const theoriticalFreqs = [];
  const meanValue = mean(varseries);
  const m = mu(meanValue);
  const s = sigma(meanValue, varseries);
  for (let i = 0; i < series.classCount; i++) {
    const p =
      aproxLaplace((series.limits[i + 1] - m) / s) -
      aproxLaplace((series.limits[i] - m) / s);
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
