import * as mymath from "../math";
import { ClassifiedSeries, VarSeries } from "../math/series";

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

export function updateParamsTable(series: VarSeries) {
  const items = [];
  const meanValue = mymath.mean(series);
  const muValue = mymath.mu(meanValue);
  const sigmaValue = mymath.sigma(meanValue, series);
  const muDisp = mymath.muDispersion(sigmaValue, series);
  const muInterval = mymath.muConfInterval(muValue, muDisp);
  items.push({
    t: "Mu",
    v: pretty(muValue),
    d: pretty(Math.sqrt(muDisp)),
    i: `${pretty(muInterval[0])} ; ${pretty(muInterval[1])}`
  });

  const sigmaDisp = mymath.sigmaDispersion(muDisp);
  const sigmaInterval = mymath.sigmaConfInterval(muValue, sigmaDisp);
  items.push({
    t: "Sigma",
    v: pretty(sigmaValue),
    d: pretty(Math.sqrt(sigmaDisp)),
    i: `${pretty(sigmaInterval[0])} ; ${pretty(sigmaInterval[1])}`
  });
  return items;
}

export function updateCharacteristicsTable(series: VarSeries) {
  const items = [];
  const meanValue = mymath.mean(series);
  const stdDeviation = mymath.stdDev(series, meanValue);
  const meanStdDev = mymath.meanDeviation(series, stdDeviation);
  const meanInterval = mymath.meanConfInterval(series, meanStdDev, meanValue);
  items.push({
    t: "Mean",
    v: pretty(meanValue),
    d: pretty(meanStdDev),
    i: `${pretty(meanInterval[0])} ; ${pretty(meanInterval[1])}`
  });

  const medianValue = mymath.median(series);
  const medianInterval = mymath.medianConfInterval(series);
  items.push({
    t: "Median",
    v: pretty(medianValue),
    d: "-",
    i: `${pretty(medianInterval[0])} ; ${pretty(medianInterval[1])}`
  });

  const stdDevStdDev = mymath.stdDevDeviation(series, stdDeviation);
  const stdDevInterval = mymath.stdDevConfInterval(
    series,
    stdDeviation,
    stdDevStdDev
  );
  items.push({
    t: "Standard Deviation",
    v: pretty(stdDeviation),
    d: pretty(stdDevStdDev),
    i: `${pretty(stdDevInterval[0])} ; ${pretty(stdDevInterval[1])}`
  });

  const skewnessCoef = mymath.skewnessCoef2(
    series,
    mymath.skewnessCoef1(
      series,
      mymath.shiftedStdDev(series, meanValue),
      meanValue
    )
  );
  const skewnessStdDev = mymath.skewnessDeviation2(series);
  const skewnessInterval = mymath.coefConfInterval(
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

  const kurtosis1 = mymath.kurtosisCoef1(
    series,
    mymath.shiftedStdDev(series, meanValue),
    meanValue
  );
  const kurtosis2 = mymath.kurtosisCoef2(series, kurtosis1);
  const kurtosisStdDev = mymath.kurtosisDeviation2(series);
  const kurtosisInterval = mymath.coefConfInterval(
    series,
    kurtosis2,
    kurtosisStdDev
  );
  items.push({
    t: "Kurtosis Coefficient",
    v: pretty(kurtosis2),
    d: pretty(kurtosisStdDev),
    i: `${pretty(kurtosisInterval[0])} ; ${pretty(kurtosisInterval[1])}`
  });

  const antikurtosis = mymath.antikurtosisCoef(kurtosis1);
  items.push({
    t: "Antikurtosis Coefficient",
    v: pretty(antikurtosis),
    d: "-",
    i: "-"
  });

  items.push({
    t: "Minimum",
    v: mymath.min(series),
    d: "-",
    i: "-"
  });

  items.push({
    t: "Maximum",
    v: mymath.max(series),
    d: "-",
    i: "-"
  });
  return items;
}
