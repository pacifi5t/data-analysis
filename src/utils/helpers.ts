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

export function determineCorrelation(estimate: number) {
  const e = Math.abs(estimate);
  if (1 > e && e >= 0.5) {
    return "Strong";
  } else if (0.5 > e && e > 0.1) {
    return "Weak";
  } else {
    return "No";
  }
}
