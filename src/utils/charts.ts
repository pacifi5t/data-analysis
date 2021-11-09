import * as d3 from "d3";
import type { ClassifiedSeries } from "./series";

export function createECDFChart(data: { x1: number; x2: number; y: number }[]) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  d3.select("#ecdf").selectChild("svg").remove();

  const svg = d3
    .select("#ecdf")
    .append("svg")
    .attr("class", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([data[0].x1, Math.floor(data[data.length - 1].x2 + 1)])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("whatever")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.x1))
    .attr("x2", (d) => x(d.x2))
    .attr("y1", (d) => y(d.y))
    .attr("y2", (d) => y(d.y))
    .attr("stroke", "#ff3e00")
    .attr("stroke-width", 5);

  svg
    .selectAll("whatever")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.x2))
    .attr("cy", (d) => y(d.y))
    .attr("r", (d) => 3)
    .attr("stroke", "#ff3e00")
    .attr("fill", "white");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right)
    .attr("y", height + margin.top + 20)
    .text("x");

  // Y axis label:
  svg
    .append("text")
    .attr("text-anchor", "end")
    // .attr('transform', 'rotate(-90)')
    .attr("y", margin.top + 20)
    .attr("x", -margin.top - 10)
    .text("Fn(x)");
}

export function createKDEchart(series: ClassifiedSeries) {
  try {
    document.getElementById("kde").replaceChildren("");
  } catch (e) {
    //console.log(e);
  }

  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#kde")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([series.limits[0], series.limits[series.limits.length - 1]])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(series.limits.length));

  const histogram = d3
    .bin()
    .value((d) => d)
    .domain([series.limits[0], series.limits[series.limits.length - 1]])
    .thresholds(x.ticks(series.classCount));

  const data = Array.from(series.frequency.values());
  console.log(data);
  
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, Math.max(...data)]);
  svg.append("g").call(d3.axisLeft(y));

  let counter = - width / series.classCount + 1;
  svg
    .selectAll("rect")
    .data(Array.from(series.frequency.values()))
    .join("rect")
    .attr("x", (d) => {counter += width / series.classCount; return counter})
    .attr("y", (d) => y(d))
    .attr("width", (d) => width / series.classCount)
    .attr("height", (d) => height - y(d))
    .style("fill", "#69b3a2");
}
