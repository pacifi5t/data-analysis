/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as d3 from "d3";
import * as mymath from "../math";

export function createECDFChart(data, varseries) {
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

  const meanValue = mymath.mean(varseries.initialArray);
  const m = mymath.muFunc(meanValue);
  const s = mymath.sigmaFunc(meanValue, varseries.initialArray);
  const data2 = [];

  for (const elem of varseries.initialArray) {
    data2.push([elem, mymath.normDistrib(elem, m, s)]);
  }
  svg
    .append("path")
    .datum(data2)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x((d) => x(d[0]))
        .y((d) => y(d[1]))
    );
}

export function createKDEchart(series, density, varseries) {
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
    .attr("stroke-width", 3)
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

  const meanValue = mymath.mean(varseries.initialArray);
  const m = mymath.muFunc(meanValue);
  const s = mymath.sigmaFunc(meanValue, varseries.initialArray);
  const data2 = [];
  const w = series.limits[1] - series.limits[0];

  for (const elem of series.limits) {
    data2.push([elem, mymath.normDistribDensity(elem, m, s) * w]);
  }
  svg
    .append("path")
    .datum(data2)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("d", line);
}

export function createAnomaliesChart(series, a, b) {
  try {
    document.getElementById("anomalies").replaceChildren("");
  } catch (e) {
    //console.error(e);
  }

  const sMin = d3.min(series.initialArray);
  const sMax = d3.max(series.initialArray);
  const padding = (sMax - sMin) / 40;

  const data = [];
  for (let i = 0; i < series.length; i++) {
    const y = series.initialArray[i];
    const isAnomaly = y >= a && y <= b ? false : true;
    data.push({ x: i, y: y, isAnomaly: isAnomaly });
  }

  const margin = { x: 40, y: 40 },
    width = 1280 - margin.x * 2,
    height = 800 - margin.y * 2;

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
    .attr("stroke", "red")
    .attr("stroke-width", 3);

  lines
    .append("line")
    .attr("x1", x(0))
    .attr("x2", width)
    .attr("y1", y(b))
    .attr("y2", y(b))
    .attr("stroke", "red")
    .attr("stroke-width", 3);

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

export function createPGPchart(series) {
  try {
    document.getElementById("pgp").replaceChildren("");
  } catch (e) {
    //console.error(e);
  }

  const meanValue = mymath.mean(series.initialArray);
  const m = mymath.muFunc(meanValue);
  const s = mymath.sigmaFunc(meanValue, series.initialArray);

  const data = [];
  const data2 = [];
  for (let i = 0; i < series.data.length - 1; i++) {
    const elem = series.data[i];
    data.push({
      x: elem,
      y: mymath.normDistribQuan(series.empDistrFunc.get(i))
    });
    data2.push({
      x: elem,
      y: mymath.normDistribQuan(mymath.normDistrib(elem, m, s))
    });
  }
  // console.log(series);
  // console.log(data);

  const margin = { x: 40, y: 40 },
    width = 1200 - margin.x * 2,
    height = 800 - margin.y * 2;

  const svg = d3
    .select("#pgp")
    .append("svg")
    .attr("width", width + margin.x * 2)
    .attr("height", height + margin.y * 2)
    .append("g")
    .attr("transform", `translate(${margin.x}, ${margin.y})`);

  const x = d3
    .scaleLinear()
    .domain([
      d3.min([data[0].x, data2[0].x]),
      d3.max([data[data.length - 1].x, data2[data2.length - 1].x])
    ])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min([data[0].y, data2[0].y]),
      d3.max([data[data.length - 1].y, data2[data2.length - 1].y])
    ])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("whatever")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("fill", "rgba(31, 41, 55, 100)")
    .attr("r", 4);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.y)
    .text("t = x");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("y", -25)
    .attr("x", 0)
    .attr("transform", "rotate(-90)")
    .text("z = u(F(x))");

  svg
    .append("path")
    .datum(data2)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x((d) => x(d.x))
        .y((d) => y(d.y))
    );
}
