import { ClassifiedSeries, VarSeries } from "./series";
import * as d3 from "d3";

export function pretty(num: number): number {
  return parseFloat(num.toPrecision(4));
}

export function kde(bandwidth: number, series: VarSeries, limits: number[]) {
  //Epanechnikov's Kernel
  const kernel = (u: number) =>
    Math.abs((u /= bandwidth)) <= 1 ? 0.75 * (1 - u * u) / bandwidth : 0;

  return limits.map((t) => [
    t,
    d3.mean(series.initialArray, (d) => kernel(t - d))
  ]);
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
