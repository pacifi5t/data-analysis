import * as d3 from "d3";
import { min, max } from "../math/other";

export function createECDFChart(data) {
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
    .attr("y", margin.top + 20)
    .attr("x", -margin.top - 10)
    .text("Fn(x)");
}

export function createKDEchart(series, density) {
  try {
    document.getElementById("kde").replaceChildren("");
  } catch (e) {
    //console.error(e);
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
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, Math.max(...data)]);
  svg.append("g").call(d3.axisLeft(y));

  let counter = -width / series.classCount + 1;
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => {
      counter += width / series.classCount;
      return counter;
    })
    .attr("y", (d) => y(d))
    .attr("width", (d) => width / series.classCount)
    .attr("height", (d) => height - y(d))
    .attr("stroke", "white")
    .style("fill", "#ff3e00");

  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  svg
    .append("path")
    .datum(density)
    .attr("fill", "none")
    .attr("stroke", "rgba(31, 41, 55, 100)")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("d", line);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 20)
    .text("x");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("y", margin.top + 20)
    .attr("x", -margin.top * 4)
    .text("p");
}

export function createAnomaliesChart(series, a, b) {
  try {
    document.getElementById("anomalies").replaceChildren("");
  } catch (e) {
    //console.error(e);
  }
  
  const sMin = min(series);
  const sMax = max(series);
  const padding = (sMax - sMin) / 40;

  const data = [];
  for (let i = 0; i < series.length; i++) {
    const y = series.initialArray[i];
    const isAnomaly = y >= a && y <= b ? false : true;
    data.push({ x: i, y: y, isAnomaly: isAnomaly });
  }

  const margin = { x: 40, y: 40 },
    width = 800 - margin.x * 2,
    height = 600 - margin.y * 2;

  const svg = d3
    .select("#anomalies")
    .append("svg")
    .attr("width", width + margin.x * 2)
    .attr("height", height + margin.y * 2)
    .append("g")
    .attr("transform", `translate(${margin.x}, ${margin.y})`);

  const x = d3
    .scaleLinear()
    .domain([0, series.length - 1])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([d3.min([sMin, a]) - padding, d3.max([sMax, b]) + padding])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

  const lines = svg.append("g");

  lines
    .append("line")
    .attr("x1", x(0))
    .attr("x2", width)
    .attr("y1", y(a))
    .attr("y2", y(a))
    .attr("stroke", "red");

  lines
    .append("line")
    .attr("x1", x(0))
    .attr("x2", width)
    .attr("y1", y(b))
    .attr("y2", y(b))
    .attr("stroke", "red");

  svg
    .selectAll("whatever")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("fill", (d) => (d.isAnomaly ? "red" : "rgba(31, 41, 55, 100)"))
    .attr("r", 4);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.y)
    .text("№");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x", -margin.x / 2)
    .text("x");
}
