export const edfOptions = {
  chart: {
    type: 'line'
  },
  title: {
    text: 'Empirical Distribution Function',
    align: 'center'
  },
  stroke: {
    curve: 'stepline'
  },
  series: [
    {
      name: 'Value',
      data: []
    }
  ],
  xaxis: {
    type: 'numeric'
  },
  yaxis: {
    min: 0,
    max: 1
  }
};
