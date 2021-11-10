import { ClassifiedSeries, VarSeries } from "./series";

export function pretty(num: number): number {
  return parseFloat(num.toPrecision(4));
}

export function kde(x: number, bandwidth: number, series: VarSeries) {
  //Epanechnikov's Kernel
  const kernel = (total: number, u: number) =>
    total +
    (3 / (4 * Math.sqrt(5))) *
      (1 - (u * u) / 5) *
      +(Math.abs(u) <= Math.sqrt(5));
  return series.initialArray.reduce(kernel) / (bandwidth * series.length);
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
