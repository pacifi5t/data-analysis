import { ClassifiedSeries, Series } from './series';
import ApexCharts from 'apexcharts';

export function pretty(num: number): number {
  return parseFloat(num.toPrecision(4));
}

export function updateClassifiedSeries(
  classCount: number,
  series: Series
): ClassifiedSeries {
  const limits = [];
  const limitFirst = series.data[0];
  const limitLast = series.data[series.data.length - 1];

  const width = (limitLast - limitFirst) / classCount;
  limits.push(limitFirst);
  for (let i = 1; i < classCount; i++) {
    limits.push(i * width + limitFirst);
  }
  limits.push(limitLast);

  const classifiedArray = [];
  series.data.forEach((elem, index) => {
    let classNum = 1;
    for (let i = 1; i < limits.length - 1; i++) {
      if (elem < limits[i]) {
        break;
      }
      classNum++;
    }
    for (let i = 0; i < series.count.get(index); i++) {
      classifiedArray.push(classNum);
    }
  });

  return new ClassifiedSeries(classCount, limits, classifiedArray);
}

export function createChart(node: HTMLElement, options: unknown): ApexCharts {
  const chart = new ApexCharts(node, options);
  chart.render();
  return chart;
}
