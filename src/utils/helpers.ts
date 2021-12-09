import * as mymath from "../math";
import { ClassifiedSeries, VarSeries } from "../math/series";

export function pretty(num: number): number {
  if(num == undefined) {
    return NaN;
  }
  return parseFloat(num.toPrecision(4));
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

export function updateSampleTable(sample: VarSeries) {
  const items = [];
  const meanValue = mymath.mean(sample.initialArray);
  const stdDeviation = mymath.stdDev(sample.initialArray, meanValue);
  const meanStdDev = mymath.meanDeviation(sample.length, stdDeviation);
  const meanInterval = mymath.meanConfInterval(
    sample.length,
    meanStdDev,
    meanValue
  );
  items.push({
    t: "Mean",
    v: pretty(meanValue),
    d: pretty(meanStdDev),
    i: `${pretty(meanInterval[0])} ; ${pretty(meanInterval[1])}`
  });

  const medianValue = mymath.median(sample.initialArray);
  const medianInterval = mymath.medianConfInterval(sample.initialArray);
  items.push({
    t: "Median",
    v: pretty(medianValue),
    d: "-",
    i: `${pretty(medianInterval[0])} ; ${pretty(medianInterval[1])}`
  });

  return items;
}

export function getDifferenceSample(sampleX: VarSeries, sampleY: VarSeries) {
  const arrZ = [];
  for (let i = 0; i < sampleX.length; i++) {
    arrZ.push(sampleX.initialArray[i] - sampleY.initialArray[i]);
  }
  return new VarSeries(arrZ);
}
