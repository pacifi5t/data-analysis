/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as d3 from "d3";
import * as mymath from "../math";


export function createKDEchart(series, density, varseries, isNormal) {
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

  if (isNormal) {
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
}

export function createPGPchart(series, isNormal) {
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
    width = 800 - margin.x * 2,
    height = 600 - margin.y * 2;

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
    .attr("y", -27)
    .attr("x", 0)
    .attr("transform", "rotate(-90)")
    .text("z = u(F(x))");

  if (isNormal) {
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
}
