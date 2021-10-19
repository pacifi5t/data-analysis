import * as d3 from 'd3';

export function createEDFChart(
  parsedSeries: { x1: number; x2: number; y: number }[]
) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  const svg = d3
    .select('#edf')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([
      parsedSeries[0].x1,
      Math.floor(parsedSeries[parsedSeries.length - 1].x2 + 1)
    ])
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  svg.selectAll(".tick line").attr("stroke", "#EBEBEB")

  svg
    .selectAll('whatever')
    .data(parsedSeries)
    .enter()
    .append('line')
    .attr('x1', (d) => x(d.x1))
    .attr('x2', (d) => x(d.x2))
    .attr('y1', (d) => y(d.y))
    .attr('y2', (d) => y(d.y))
    .attr('stroke', '#ff3e00')
    .attr('stroke-width', 5);

  svg
    .selectAll('whatever')
    .data(parsedSeries)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.x2))
    .attr('cy', (d) => y(d.y))
    .attr('r', (d) => 3)
    .attr('stroke', '#ff3e00')
    .attr('fill', 'white');
}
