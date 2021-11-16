<script lang="ts">
  import { createAnomaliesChart } from "../utils/charts";
  import { onMount } from "svelte";
  import { mutableDataStore } from "../utils/stores";
  import { quartile1, quartile3 } from "../math/other";

  let mutableSeries = $mutableDataStore;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      const k = 1.5;
      const q1 = quartile1(mutableSeries);
      const q3 = quartile3(mutableSeries);
      const a = q1 - k * (q3 - q1);
      const b = q3 + k * (q3 - q1);
      createAnomaliesChart(mutableSeries, a, b);
    }
  });
</script>

<div id="anomalies" />
