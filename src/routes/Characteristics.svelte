<script lang="ts">
  import { Table } from "attractions";
  import { pretty } from "../utils/helpers";
  import { mutableSamplesStore } from "../utils/stores";
  import * as mymath from "../math";

  const headers = [
    { text: "", value: "title" },
    { text: "Value", value: "val" },
    { text: "Standard Deviation", value: "stddev" },
    { text: "Confidence Interval", value: "conf" }
  ];

  let mutableSamples: mymath.VarSeries[] = [];
  let tableItems = [];

  mutableSamplesStore.subscribe((value: mymath.VarSeries[]) => {
    mutableSamples = value;
    if (value.length != 0) {
      for (let index = 0; index < value.length; index++) {
        tableItems[index] = updateCharacteristicsTable(mutableSamples[index]);
      }
    }
  });

  function updateCharacteristicsTable(sample: mymath.VarSeries) {
    const len = sample.initialArray.length;
    const array = sample.initialArray;
    const items = [];

    const meanValue = mymath.mean(array);
    const stdDeviation = mymath.stdDev(array, meanValue);
    const meanStdDev = mymath.meanDeviation(sample.length, stdDeviation);
    const meanInterval = mymath.meanConfInterval(
      sample.length,
      meanStdDev,
      meanValue
    );
    items.push({
      title: "Mean",
      val: pretty(meanValue),
      stddev: pretty(meanStdDev),
      conf: `${pretty(meanInterval[0])} ; ${pretty(meanInterval[1])}`
    });

    const medianValue = mymath.median(array);
    const medianInterval = mymath.medianConfInterval(array);
    items.push({
      title: "Median",
      val: pretty(medianValue),
      stddev: "-",
      conf: `${pretty(medianInterval[0])} ; ${pretty(medianInterval[1])}`
    });

    const stdDevDeviation = mymath.stdDevDeviation(len, stdDeviation);
    const stdDevConfInterval = mymath.stdDevConfInterval(
      len,
      stdDeviation,
      stdDevDeviation
    );
    items.push({
      title: "Standard deviation",
      val: pretty(stdDeviation),
      stddev: pretty(stdDevDeviation),
      conf: `${pretty(stdDevConfInterval[0])} ; ${pretty(
        stdDevConfInterval[1]
      )}`
    });

    const shiftedDev = mymath.shiftedDeviation(array, meanValue);
    const skewnessCoef = mymath.skewnessCoef(array, shiftedDev, meanValue);
    const skewnessDeviation = mymath.skewnessDeviation(len);
    const skewnessInterval = mymath.coefConfInterval(
      len,
      skewnessCoef,
      skewnessDeviation
    );
    items.push({
      title: "Skewness coefficient",
      val: pretty(skewnessCoef),
      stddev: pretty(skewnessDeviation),
      conf: `${pretty(skewnessInterval[0])} ; ${pretty(skewnessInterval[1])}`
    });

    const kurtosisCoef = mymath.kurtosisCoef(array, shiftedDev, meanValue);
    const kurtosisDeviation = mymath.kurtosisDeviation(len);
    const kurtosisInterval = mymath.coefConfInterval(
      len,
      kurtosisCoef,
      kurtosisDeviation
    );
    items.push({
      title: "Kurtosis coefficient",
      val: pretty(kurtosisCoef),
      stddev: pretty(kurtosisDeviation),
      conf: `${pretty(kurtosisInterval[0])} ; ${pretty(kurtosisInterval[1])}`
    });

    return items;
  }
</script>

{#each tableItems as item, i}
  <div class="flex flex-row">
    <span class="text-center mx-2">
      ATTRIBUTE {i + 1}
    </span>
    <Table class="pb-8" {headers} items={item} />
  </div>
{/each}

<style>
  span {
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
</style>
