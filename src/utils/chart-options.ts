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

export const mixedChartOptions = {
  series: [
    {
      type: 'column',
      data: []
    },
    {
      type: 'line',
      data: []
    }
  ],
  chart: {
    type: 'line'
  },
  stroke: {
    curve: 'smooth',
    width: [0, 4]
  },
  xaxis: {
    type: 'category'
  },
  legend: {
    show: false
  }
};
