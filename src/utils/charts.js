/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as d3 from "d3";

/**
 * @param {number[]} arrX
 * @param {number[]} arrY
 */
export function scatterPlot(arrX, arrY) {
  try {
    document.getElementById("scatter").replaceChildren("");
  } catch (e) {
    //console.error(e);
  }

  const margin = { x: 40, y: 40 },
    width = 800 - margin.x * 2,
    height = 600 - margin.y * 2;

  const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width + margin.x * 2)
    .attr("height", height + margin.y * 2)
    .append("g")
    .attr("transform", `translate(${margin.x},${margin.y})`);

  const x = d3
    .scaleLinear()
    .domain([d3.min(arrX), d3.max(arrX)])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([d3.min(arrY), d3.max(arrY)])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

  const data = arrX.map((value, i) => ({ x: value, y: arrY[i] }));

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
    .text("x");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", -margin.x / 2)
    .attr("y", 0)
    .text("y");
}
