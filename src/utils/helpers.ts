import * as mymath from "../math";
import { ClassifiedSeries, VarSeries } from "../math/series";

export function pretty(num: number): number {
  return prettyToPrecision(num, 3);
}

export function prettyToPrecision(num: number, precision: number): number {
  if (num == undefined) {
    return NaN;
  }
  return parseFloat(num.toPrecision(precision));
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

export function updateCharacteristicsTable(sample: VarSeries) {
  const items = [];
  const len = sample.initialArray.length;
  const array = sample.initialArray;

  const meanValue = mymath.mean(array);
  const stdDeviation = mymath.stdDev(array, meanValue);
  const meanStdDev = mymath.meanDeviation(sample.length, stdDeviation);
  const meanInterval = mymath.meanConfInterval(
    sample.length,
    meanStdDev,
    meanValue
  );
  items.push({
    title: "Mean",
    val: pretty(meanValue),
    stddev: pretty(meanStdDev),
    conf: `${pretty(meanInterval[0])} ; ${pretty(meanInterval[1])}`
  });

  const medianValue = mymath.median(array);
  const medianInterval = mymath.medianConfInterval(array);
  items.push({
    title: "Median",
    val: pretty(medianValue),
    stddev: "-",
    conf: `${pretty(medianInterval[0])} ; ${pretty(medianInterval[1])}`
  });

  const stdDevDeviation = mymath.stdDevDeviation(len, stdDeviation);
  const stdDevConfInterval = mymath.stdDevConfInterval(
    len,
    stdDeviation,
    stdDevDeviation
  );
  items.push({
    title: "Standard deviation",
    val: pretty(stdDeviation),
    stddev: pretty(stdDevDeviation),
    conf: `${pretty(stdDevConfInterval[0])} ; ${pretty(stdDevConfInterval[1])}`
  });

  const shiftedDev = mymath.shiftedDeviation(array, meanValue);
  const skewnessCoef = mymath.skewnessCoef(array, shiftedDev, meanValue);
  const skewnessDeviation = mymath.skewnessDeviation(len);
  const skewnessInterval = mymath.coefConfInterval(
    len,
    skewnessCoef,
    skewnessDeviation
  );
  items.push({
    title: "Skewness coefficient",
    val: pretty(skewnessCoef),
    stddev: pretty(skewnessDeviation),
    conf: `${pretty(skewnessInterval[0])} ; ${pretty(skewnessInterval[1])}`
  });

  const kurtosisCoef = mymath.kurtosisCoef(array, shiftedDev, meanValue);
  const kurtosisDeviation = mymath.kurtosisDeviation(len);
  const kurtosisInterval = mymath.coefConfInterval(
    len,
    kurtosisCoef,
    kurtosisDeviation
  );
  items.push({
    title: "Kurtosis coefficient",
    val: pretty(kurtosisCoef),
    stddev: pretty(kurtosisDeviation),
    conf: `${pretty(kurtosisInterval[0])} ; ${pretty(kurtosisInterval[1])}`
  });

  return items;
}

export function getDifferenceSample(sampleX: VarSeries, sampleY: VarSeries) {
  const arrZ = [];
  for (let i = 0; i < sampleX.length; i++) {
    const z = sampleX.initialArray[i] - sampleY.initialArray[i];
    arrZ.push(
      isNaN(z) ? sampleX.initialArray[i] ?? sampleY.initialArray[i] : z
    );
  }
  return new VarSeries(arrZ);
}
